import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../../main/resources/static/logics/addBillingClient.js', import.meta.url), 'utf8');

function submitBillingClient(id = null) {
    const fields = { '#partyName': 'Example Ltd', '#ledgerNumber': '001', '#pageNumber': '07', '#isActive': '0' };
    const events = [];
    let click;
    const request = {};
    const jquery = selector => ({
        ready: callback => callback(),
        hide() {},
        is: () => false,
        change() {},
        click: callback => { click = callback; },
        val: () => fields[selector],
        attr: () => id,
        0: { reset: () => events.push(['reset']) }
    });
    jquery.ajax = options => {
        request.options = options;
        return {
            done(callback) {
                request.resolve = callback;
                return this;
            },
            fail(callback) {
                request.reject = callback;
            }
        };
    };
    runInNewContext(script, {
        $: jquery,
        document: {},
        setTimeout() {},
        sessionStorage: { getItem: () => id, clear: () => events.push(['clear']) },
        window: { set location(path) { events.push(['navigate', path]); } },
        alert: message => events.push(['alert', message]),
        postAddBillingClientURL: '/synthetic/add',
        postEditBillingClientURL: '/synthetic/edit',
        accessToken: 'synthetic-token'
    });
    click({ preventDefault: () => events.push(['preventDefault']) });
    assert.deepEqual(events.shift(), ['preventDefault']);
    return { request, events };
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
