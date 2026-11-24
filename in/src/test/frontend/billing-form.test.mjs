import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { mockDeferredAjax } from './support/deferred-ajax.mjs';

const script = readFileSync(new URL('../../main/resources/static/logics/addBillingClient.js', import.meta.url), 'utf8');

function submitBillingClient(id = null, loadedId = id) {
    const fields = { '#partyName': 'Example Ltd', '#ledgerNumber': '001', '#pageNumber': '07', '#isActive': '0' };
    const events = [];
    let checked = false;
    let selectedId = id;
    let click;
    const { ajax, requests } = mockDeferredAjax();
    const jquery = selector => ({
        ready: callback => callback(),
        hide() {},
        is: () => checked,
        change() {},
        click: callback => { click = callback; },
        val: value => value === undefined ? fields[selector] : (fields[selector] = value),
        prop: (_, value) => { checked = value; },
        attr: (_, value) => value === undefined ? loadedId : (loadedId = value),
        0: { reset: () => events.push(['reset']) }
    });
    jquery.ajax = ajax;
    runInNewContext(script, {
        $: jquery,
        document: {},
        sessionStorage: { getItem: () => selectedId, removeItem: () => { selectedId = null; events.push(['consume']); }, clear: () => events.push(['clear']) },
        window: { set location(path) { events.push(['navigate', path]); } },
        alert: message => events.push(['alert', message]),
        getBillingByIdURL: '/synthetic/details',
        postAddBillingClientURL: '/synthetic/add',
        postEditBillingClientURL: '/synthetic/edit',
        accessToken: 'synthetic-token'
    });
    click({ preventDefault: () => events.push(['preventDefault']) });
    assert.deepEqual(events.shift(), ['preventDefault']);
    return { request: requests.find(({ options }) => options.method === 'POST'), events, requests, fields };
}

for (const [id, endpoint, verb] of [[null, 'add', 'added'], ['17', 'edit', 'updated']]) {
    test('billing form sends the ' + endpoint + ' request and confirms success', () => {
        const { request, events } = submitBillingClient(id);
        assert.equal(request.options.url, '/synthetic/' + endpoint);
        assert.equal(request.options.method, 'POST');
        assert.equal(request.options.headers.Authorization, 'synthetic-token');
        assert.deepEqual(JSON.parse(request.options.data), {
            partyName: 'Example Ltd', ledgerNo: '001', pageNo: '07', isActive: '0',
            ...(id === null ? {} : { id })
        });
        request.resolve({ success: 200 });
        assert.deepEqual(events, [
            ['reset'], ['navigate', 'viewBillingClient'], ['alert', 'Billing client ' + verb + ' successfully.']
        ]);
    });
}

for (const [description, handler, response, unauthorized] of [
    ['application 401', 'resolve', { success: 401 }, true],
    ['HTTP 401', 'reject', { status: 401 }, true],
    ['application error', 'resolve', { success: 500 }, false],
    ['missing response', 'resolve', null, false],
    ['network error', 'reject', { status: 0 }, false]
]) {
    test('billing form preserves input on ' + description, () => {
        const { request, events } = submitBillingClient('17');
        request[handler](response);
        assert.deepEqual(events, unauthorized
            ? [['clear'], ['alert', 'Your session is no longer authorized. Sign in again before saving.']]
            : [['alert', 'Unable to save the billing client.']]);
    });
}


test('saving before billing client edit details load sends no request', () => {
    const { request, events } = submitBillingClient('17', '');
    assert.equal(request, undefined);
    assert.deepEqual(events, [['alert', 'The billing client details are unavailable. Reopen the billing client before saving.']]);
});


test('opening a billing client requests its details immediately', () => {
    const { requests } = submitBillingClient('17', '');
    assert.equal(requests.length, 1);
    assert.equal(requests[0].options.url, '/synthetic/details');
    assert.equal(requests[0].options.method, 'GET');
    assert.equal(requests[0].options.data.id, '17');
});

test('billing client load errors explain how to retry', () => {
    const { requests, events } = submitBillingClient('17', '');
    requests[0].reject();
    assert.deepEqual(events.at(-1), ['alert', 'Unable to load the billing client. Reopen it and try again.']);
});


test('successful billing details populate the form and consume the selected ID', () => {
    const { requests, events, fields } = submitBillingClient('17', '');
    requests[0].resolve({ success: 200, body: { id: 17, client: 'Test Party-002-09', isActive: 1 } });
    assert.equal(fields['#partyName'], 'Test Party');
    assert.equal(fields['#ledgerNumber'], '002');
    assert.equal(fields['#pageNumber'], '09');
    assert.equal(fields['#isActive'], '1');
    assert.deepEqual(events.at(-1), ['consume']);
});
