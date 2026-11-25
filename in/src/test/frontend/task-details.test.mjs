import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { mockDeferredAjax } from './support/deferred-ajax.mjs';

const script = readFileSync(new URL('../../main/resources/static/logics/viewCreateTaskDetails.js', import.meta.url), 'utf8');

function loadTask(billingOptions = ['Example Client']) {
    const selects = new Map();
    for (const id of ['billingClientName', 'responsibility', 'intimation', 'execution', 'consulting']) {
        const values = id === 'billingClientName' ? billingOptions : ['current@example.test'];
        const options = values.map(value => ({ value }));
        selects.set(id, { id, options, appendChild: option => options.push(option) });
    }
    const events = [];
    const { ajax, requests } = mockDeferredAjax();
    const jquery = (target, selector = typeof target === 'string' ? target : '#' + target.id) => ({
        ready() {},
        val(value) {
            events.push([selector, value]);
            return this;
        },
        trigger: event => events.push([selector, event]),
        prop() {},
        attr: (key, value) => value === undefined ? '17' : events.push([selector, key, value])
    });
    jquery.ajax = ajax;
    jquery.param = values => new URLSearchParams(values).toString();
    const context = {
        $: jquery,
        document: { getElementById: id => selects.get(id), createElement: tagName => ({ tagName }) },
        sessionStorage: { getItem: () => '17', removeItem: key => events.push(['clear', key]) },
        confirm: () => true,
        window: { set location(path) { events.push(['navigate', path]); } },
        deleteTaskDetailsByIdURL: '/synthetic/delete',
        formatDateToUi: value => value,
        alert: message => events.push(['alert', message]),
        getTaskDetailsByIdURL: '/synthetic/details', accessToken: 'synthetic-token'
    };
    runInNewContext(script, context);
    context.getViewTaskById();
    return { request: requests[0].options, events, billingOptions: selects.get('billingClientName').options, selects, context, requests };
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


test('task details preserve saved assignments missing from the current dropdowns', () => {
    const { request, events, selects } = loadTask();
    const legacy = 'legacy@example.test';
    request.success({
        success: 200,
        body: [{ taskId: 17, responsibility: legacy, intimation: legacy, exceution: legacy, consulting: legacy }]
    });
    for (const id of ['responsibility', 'intimation', 'execution', 'consulting']) {
        assert.deepEqual(selects.get(id).options, [
            { value: 'current@example.test' }, { tagName: 'option', value: legacy, textContent: legacy }
        ]);
        assert.deepEqual(events.filter(([field]) => field === '#' + id), [['#' + id, legacy]]);
    }
});


test('task deletion uses DELETE and redirects only after confirmed success', () => {
    const { context, requests, events } = loadTask();
    context.getViewTaskDeleteById();
    const { options } = requests.at(-1);
    assert.equal(options.type, 'DELETE');
    assert.equal(options.url, '/synthetic/delete?taskId=17');
    assert.equal(options.headers.Authorization, 'synthetic-token');
    options.success({ success: 200 });
    assert.deepEqual(events, [['alert', 'Task deleted successfully.'], ['navigate', 'dashboard']]);
});

test('task deletion permission failures stay on the current page', () => {
    const { context, requests, events } = loadTask();
    context.getViewTaskDeleteById();
    requests.at(-1).options.success({ success: 403 });
    assert.deepEqual(events, [['alert', 'You do not have permission to delete this task.']]);
});
