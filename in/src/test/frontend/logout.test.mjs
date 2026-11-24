import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../../main/resources/static/logics/common.js', import.meta.url), 'utf8');

function createLogout(accessToken) {
    const requests = [];
    const events = [];
    const jquery = () => ({ on() {}, ready() {} });
    jquery.ajax = options => requests.push(options);
    const context = {
        $: jquery,
        document: { set cookie(value) { events.push(['cookie', value]); } },
        window: { set location(path) { events.push(['location', path]); } },
        sessionStorage: { clear() { events.push(['clear']); } },
        getLogoutURL: '/synthetic/logout',
        accessToken
    };
    runInNewContext(script, context);
    return { context, requests, events };
}

for (const result of ['success', 'error', 'timeout']) {
    test('logout clears local state immediately and redirects on ' + result, () => {
        const { context, requests, events } = createLogout('synthetic-token');
        context.Logout();
        context.Logout();

        assert.equal(requests.length, 1);
        const request = requests[0];
        assert.equal(request.url, '/synthetic/logout');
        assert.equal(request.headers.Authorization, 'synthetic-token');
        assert.equal(request.timeout, 5000);
        assert.equal(context.accessToken, null);
        assert.deepEqual(events.map(event => event[0]), ['clear', 'cookie']);
        assert.match(events[1][1], /^token=; Path=\//);

        request.complete({}, result);
        assert.deepEqual(events.at(-1), ['location', '/vscca']);
    });
}

test('logout goes directly to login when the token is missing', () => {
    const { context, requests, events } = createLogout(null);
    context.Logout();
    assert.deepEqual(requests, []);
    assert.deepEqual(events.map(event => event[0]), ['clear', 'cookie', 'location']);
});
