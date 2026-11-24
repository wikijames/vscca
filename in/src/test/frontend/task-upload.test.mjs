import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { mockDeferredAjax } from './support/deferred-ajax.mjs';

const script = readFileSync(new URL('../../main/resources/static/logics/createTask.js', import.meta.url), 'utf8');

function uploadTasks(confirmed = true, filename = 'synthetic.xlsx') {
    const events = [];
    const form = { reset: () => events.push(['reset']) };
    const { ajax, requests } = mockDeferredAjax();
    const file = { value: filename };
    const uploadButton = { disabled: false };
    const jquery = () => ({ ready() {} });
    jquery.ajax = ajax;
    const context = {
        $: jquery,
        document: { getElementById: id => ({ file, fileinfo: form, uploadTasks: uploadButton })[id] },
        FormData: class {
            constructor(formElement) { this.form = formElement; }
        },
        sessionStorage: { clear: () => events.push(['clear']) },
        confirm: () => confirmed,
        alert: message => events.push(['alert', message]),
        window: { set location(path) { events.push(['navigate', path]); } },
        accessToken: 'synthetic-token',
        postUploadBulkTaskURL: '/synthetic/upload'
    };
    runInNewContext(script, context);
    context.ValidateUploadFile();
    return { requests, events, form, uploadButton, submit: context.ValidateUploadFile };
}

test('task upload resets its own form and redirects after confirmed import', () => {
    const { requests, events, form } = uploadTasks();
    const [{ options }] = requests;
    assert.equal(options.url, '/synthetic/upload');
    assert.equal(options.type, 'POST');
    assert.equal(options.headers.Authorization, 'synthetic-token');
    assert.equal(options.data.form, form);
    assert.equal(options.contentType, false);
    assert.equal(options.processData, false);
    assert.deepEqual(events, []);
    options.success({ success: 200, message: 'success' });
    assert.deepEqual(events, [['reset'], ['alert', 'Tasks uploaded successfully.'], ['navigate', 'dashboard']]);
});

test('cancelling a task upload keeps the selected file and sends no request', () => {
    const { requests, events } = uploadTasks(false);
    assert.deepEqual(requests, []);
    assert.deepEqual(events, []);
});

for (const [label, handler, response] of [
    ['rejected workbook', 'success', { success: 0 }],
    ['unconfirmed import', 'success', { success: 200 }],
    ['missing response', 'success', null],
    ['HTTP failure', 'error', { status: 500 }]
]) {
    test('task upload keeps the form and selected file on ' + label, () => {
        const { requests, events } = uploadTasks();
        requests[0].options[handler](response);
        assert.deepEqual(events, [['alert', 'Unable to import tasks. Check the workbook and try again.']]);
    });
}


test('task upload accepts XLSX filenames regardless of case', () => {
    assert.equal(uploadTasks(true, 'TASKS.XLSX').requests.length, 1);
});

for (const [filename, message] of [
    ['', 'Select a task workbook to upload.'],
    ['tasks.csv', 'Select an XLSX task workbook.'],
    ['tasks.xls', 'Select an XLSX task workbook.']
]) {
    test('task upload blocks ' + (filename || 'an empty selection') + ' before sending a request', () => {
        const { requests, events } = uploadTasks(true, filename);
        assert.deepEqual(requests, []);
        assert.deepEqual(events, [['alert', message]]);
    });
}

test('task upload explains the XLSX and Sheet1 requirements after server validation fails', () => {
    const { requests, events } = uploadTasks();
    requests[0].options.success({ success: 400 });
    assert.deepEqual(events, [['alert', 'Upload a readable XLSX task workbook containing Sheet1.']]);
});


for (const [source, handler, response] of [
    ['application response', 'success', { success: 401 }],
    ['HTTP response', 'error', { status: 401 }]
]) {
    test('task upload handles an unauthorized ' + source + ' without resetting the form', () => {
        const { requests, events } = uploadTasks();
        requests[0].options[handler](response);
        assert.deepEqual(events, [
            ['clear'], ['alert', 'Your session is no longer authorized. Sign in again before uploading.']
        ]);
    });
}


test('task upload blocks a second submission while pending and unlocks after failure', () => {
    const { requests, uploadButton, submit } = uploadTasks();
    assert.equal(uploadButton.disabled, true);
    submit();
    assert.equal(requests.length, 1);

    requests[0].options.error({ status: 500 });
    requests[0].options.complete();
    assert.equal(uploadButton.disabled, false);
    submit();
    assert.equal(requests.length, 2);
});
