import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../../main/resources/static/logics/common.js', import.meta.url), 'utf8');

function createNavigation() {
    const events = [];
    let request;
    const jquery = () => ({
        on() {},
        ready() {},
        text(value) { events.push(['text', value]); }
    });
    jquery.ajax = settings => { request = settings; };
    const context = {
        $: jquery,
        document: {},
        window: { set location(path) { events.push(['location', path]); } },
        sessionStorage: { clear() { events.push(['clear']); } },
        alert: () => events.push(['alert']),
        getUserProfileByIdURL: '/synthetic/profile',
        accessToken: 'synthetic-token'
    };
    runInNewContext(script, context);
    context.topNavUserName();
    return { events, request };
}

test('top navigation displays profile information as literal text', () => {
    const { events, request } = createNavigation();
    assert.equal(request.headers.Authorization, 'synthetic-token');
    request.success({ success: 200, body: {
        accessType: 'Manager', firstName: 'Example <Review>', lastName: 'A & B'
    } });
    assert.deepEqual(events, [['text', 'Manager, Example <Review> A & B']]);
});

test('the existing missing-profile flow clears storage and returns to login', () => {
    const { events, request } = createNavigation();
    request.success({ success: 401 });
    assert.deepEqual(events, [['text', ''], ['alert'], ['clear'], ['location', '/vscca']]);
});
