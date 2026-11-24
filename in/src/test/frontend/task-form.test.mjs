import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { createElement } from './support/dom.mjs';
import { mockDeferredAjax } from './support/deferred-ajax.mjs';

const script = readFileSync(new URL('../../main/resources/static/logics/createTask.js', import.meta.url), 'utf8');

function submitTask(id = '', dueDate) {
    const fields = {
        '#projectName': 'Example', '#partyName': 'Example Ltd', '#description': 'Review',
        '#execution': 'user@example.test', '#taskId': id, '#status': 'Done', '#remarks': 'Reviewed',
        '#reasonForDelay': '', '#endDate': dueDate
    };
    const events = [];
    const optionsBySelector = new Map();
    const { ajax, requests } = mockDeferredAjax();
    let click;
    let changeDate;
    const jquery = selector => ({
        ready: callback => callback(),
        select2() {},
        hide() {},
        each(callback) {
            const options = [];
            optionsBySelector.set(selector, options);
            callback.call({ appendChild: option => options.push(option) });
        },
        change: callback => { changeDate = callback; },
        click: callback => { click = callback; },
        attr: () => id,
        val: () => fields[selector] ?? '',
        0: { reset: () => events.push(['reset']) }
    });
    jquery.ajax = ajax;
    jquery.each = (items, callback) => items.forEach((item, index) => callback(index, item));
    runInNewContext(script, {
        $: jquery, document: { createElement },
        sessionStorage: { getItem: () => id || null, clear: () => events.push(['clear']) },
        window: { set location(path) { events.push(['navigate', path]); } },
        alert: message => events.push(['alert', message]),
        accessToken: 'synthetic-token',
        getBillingClientsURL: '/synthetic/billing',
        getTasksURL: '/synthetic/task-types',
        getResponsiblityUsersURL: '/synthetic/responsibility',
        getExecutionUsersURL: '/synthetic/execution',
        getConsultingUsersURL: '/synthetic/consulting',
        getIntimationUsersURL: '/synthetic/intimation',
        postCreateTaskURL: '/synthetic/create',
        postEditTaskURL: '/synthetic/edit'
    });
    if (dueDate !== undefined) changeDate.call('#endDate');
    click({ preventDefault: () => events.push(['prevented']) });
    assert.deepEqual(events.shift(), ['prevented']);
    return { request: requests.find(({ options }) => options.method === 'POST'), events, requests, optionsBySelector };
}

for (const [id, endpoint, action, dueDate] of [
    ['', 'create', 'created', '25-11-2026'],
    ['17', 'edit', 'updated', undefined]
]) {
    test('task form sends the ' + endpoint + ' payload and confirms success', () => {
        const { request, events } = submitTask(id, dueDate);
        assert.equal(request.options.url, '/synthetic/' + endpoint);
        assert.equal(request.options.headers.Authorization, 'synthetic-token');
        assert.equal(request.options.contentType, 'application/json');
        assert.deepEqual(JSON.parse(request.options.data), {
            projectName: 'Example', partyName: 'Example Ltd', weightage: '', taskDescription: 'Review',
            taskType: '', billingClient: '', responsibility: '', intimation: '',
            exceution: 'user@example.test', consulting: '',
            ...(dueDate === undefined ? {} : { dueDate }),
            ...(id ? { taskId: id, status: 'Done', remarks: 'Reviewed', delayReason: '' } : {})
        });
        request.resolve({ success: 200 });
        assert.deepEqual(events, [['reset'], ['alert', 'Task ' + action + ' successfully.'], ['navigate', 'dashboard']]);
    });
}

for (const [label, handler, response, message, clearsSession] of [
    ['application 401', 'resolve', { success: 401 }, 'Your session is no longer authorized. Sign in again before saving.', true],
    ['HTTP 401', 'reject', { status: 401 }, 'Your session is no longer authorized. Sign in again before saving.', true],
    ['application 403', 'resolve', { success: 403 }, 'You do not have permission to save this task.'],
    ['HTTP 403', 'reject', { status: 403 }, 'You do not have permission to save this task.'],
    ['missing response', 'resolve', null, 'Unable to save the task.'],
    ['network error', 'reject', { status: 0 }, 'Unable to save the task.']
]) {
    test('task form stays open on ' + label, () => {
        const { request, events } = submitTask('17');
        request[handler](response);
        assert.deepEqual(events, clearsSession ? [['clear'], ['alert', message]] : [['alert', message]]);
    });
}


test('task dropdowns render API labels and submitted values as literal text', () => {
    const { requests, optionsBySelector } = submitTask();
    const label = 'Example <Review> & Co';
    const email = 'user@example.test';
    for (const [endpoint, selector, record, value, text] of [
        ['billing', '.billingClientNameClass', { client: label }, label, label],
        ['task-types', '#taskType', { task: label }, label, label],
        ...['responsibility', 'execution', 'consulting', 'intimation'].map(role => [
            role, '#' + role, { emailId: email, firstName: label, lastName: 'User' }, email, label + ' User'
        ])
    ]) {
        const { options } = requests.find(request => request.options.url === '/synthetic/' + endpoint);
        options.success({ body: [record] });
        const [option] = optionsBySelector.get(selector);
        assert.equal(option.tagName, 'option');
        assert.equal(option.value, value);
        assert.equal(option.textContent, text);
        assert.deepEqual(option.children, []);
    }
});
