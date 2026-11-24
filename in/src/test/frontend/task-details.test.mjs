import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { mockDeferredAjax } from './support/deferred-ajax.mjs';

const script = readFileSync(new URL('../../main/resources/static/logics/viewCreateTaskDetails.js', import.meta.url), 'utf8');

function loadTask() {
    const events = [];
    const { ajax, requests } = mockDeferredAjax();
    const jquery = selector => ({
        ready() {},
        val: value => events.push([selector, value]),
        prop() {},
        attr: (key, value) => events.push([selector, key, value])
    });
    jquery.ajax = ajax;
    const context = {
        $: jquery, document: {},
        sessionStorage: { getItem: () => '17', removeItem: key => events.push(['clear', key]) },
        formatDateToUi: value => value,
        alert: message => events.push(['alert', message]),
        getTaskDetailsByIdURL: '/synthetic/details', accessToken: 'synthetic-token'
    };
    runInNewContext(script, context);
    context.getViewTaskById();
    return { request: requests[0].options, events };
}

test('task details populate only the requested record before enabling edit saves', () => {
    const { request, events } = loadTask();
    assert.equal(request.url, '/synthetic/details');
    assert.equal(request.data.taskId, '17');
    request.success({ success: 200, body: [{ taskId: 18 }, { taskId: 17, projectName: 'Example' }] });
    assert.deepEqual(events.find(([field]) => field === '#projectName'), ['#projectName', 'Example']);
    assert.deepEqual(events.slice(-2), [['#save', 'title', 17], ['clear', 'taskId']]);
});

for (const [name, callback, response] of [
    ['missing record', 'success', { success: 200, body: [] }],
    ['unauthorized response', 'success', { success: 401 }],
    ['HTTP failure', 'error', { status: 500 }]
]) {
    test('task details report ' + name + ' without populating the form', () => {
        const { request, events } = loadTask();
        request[callback](response);
        assert.deepEqual(events, [['alert', 'Unable to load the task. Reopen it and try again.']]);
    });
}
