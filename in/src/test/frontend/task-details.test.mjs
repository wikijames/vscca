import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { mockDeferredAjax } from './support/deferred-ajax.mjs';

const script = readFileSync(new URL('../../main/resources/static/logics/viewCreateTaskDetails.js', import.meta.url), 'utf8');

function loadTask(billingOptions = ['Example Client']) {
    const options = billingOptions.map(value => ({ value }));
    const select = { options, appendChild: option => options.push(option) };
    const events = [];
    const { ajax, requests } = mockDeferredAjax();
    const jquery = (target, selector = target === select ? '#billingClientName' : target) => ({
        ready() {},
        val(value) {
            events.push([selector, value]);
            return this;
        },
        trigger: event => events.push([selector, event]),
        prop() {},
        attr: (key, value) => events.push([selector, key, value])
    });
    jquery.ajax = ajax;
    const context = {
        $: jquery,
        document: { getElementById: () => select, createElement: tagName => ({ tagName }) },
        sessionStorage: { getItem: () => '17', removeItem: key => events.push(['clear', key]) },
        formatDateToUi: value => value,
        alert: message => events.push(['alert', message]),
        getTaskDetailsByIdURL: '/synthetic/details', accessToken: 'synthetic-token'
    };
    runInNewContext(script, context);
    context.getViewTaskById();
    return { request: requests[0].options, events, billingOptions: options };
}

test('task details populate only the requested record before enabling edit saves', () => {
    const { request, events } = loadTask();
    assert.equal(request.url, '/synthetic/details');
    assert.equal(request.data.taskId, '17');
    request.success({ success: 200, body: [{ taskId: 18 }, { taskId: 17, projectName: 'Example', billingClient: 'Example Client' }] });
    assert.deepEqual(events.find(([field]) => field === '#projectName'), ['#projectName', 'Example']);
    assert.deepEqual(events.filter(([field]) => field === '#billingClientName'), [
        ['#billingClientName', 'Example Client'], ['#billingClientName', 'change.select2']
    ]);
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


test('task details retain a saved billing client missing from the current dropdown', () => {
    const { request, events, billingOptions } = loadTask([]);
    const value = 'Legacy <Client> & Co';
    request.success({ success: 200, body: [{ taskId: 17, billingClient: value }] });
    assert.deepEqual(billingOptions, [{ tagName: 'option', value, textContent: value }]);
    assert.deepEqual(events.filter(([field]) => field === '#billingClientName'), [
        ['#billingClientName', value], ['#billingClientName', 'change.select2']
    ]);
});
