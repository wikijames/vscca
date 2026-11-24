import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { mockDeferredAjax } from './support/deferred-ajax.mjs';

const script = readFileSync(new URL('../../main/resources/static/logics/createTask.js', import.meta.url), 'utf8');

function uploadTasks(confirmed = true) {
    const events = [];
    const form = { reset: () => events.push(['reset']) };
    const { ajax, requests } = mockDeferredAjax();
    const file = { value: 'synthetic.xlsx' };
    const jquery = () => ({ ready() {} });
    jquery.ajax = ajax;
    const context = {
        $: jquery,
        document: { getElementById: id => ({ file, fileinfo: form })[id] },
        FormData: class {
            constructor(formElement) { this.form = formElement; }
        },
        checkFileExtension: filename => filename.endsWith('.xlsx'),
        confirm: () => confirmed,
        alert: message => events.push(['alert', message]),
        window: { set location(path) { events.push(['navigate', path]); } },
        accessToken: 'synthetic-token',
        postUploadBulkTaskURL: '/synthetic/upload'
    };
    runInNewContext(script, context);
    context.ValidateUploadFile();
    return { requests, events, form };
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
