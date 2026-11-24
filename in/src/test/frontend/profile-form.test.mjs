import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { mockDeferredAjax } from './support/deferred-ajax.mjs';

const script = readFileSync(new URL('../../main/resources/static/logics/createProfile.js', import.meta.url), 'utf8');

function submitProfile(profileId, email = 'user@example.test', loadedId = profileId) {
    const fields = { '#firstName': 'Example', '#lastName': 'User', '#email': email, '#accessType': 'Supervisor', '#isActive': '0' };
    const events = [];
    const { ajax, requests } = mockDeferredAjax();
    const dropdowns = { accessType: [], location: [] };
    let click;
    const jquery = selector => ({
        ready: callback => callback(),
        hide() {},
        is: () => false,
        text() {},
        change() {},
        click: callback => { click = callback; },
        find: () => ({ each: callback => callback.call('#firstName') }),
        val: () => fields[selector] ?? '',
        attr: () => loadedId,
        0: { reset: () => events.push(['reset']) }
    });
    jquery.ajax = ajax;
    runInNewContext(script, {
        $: jquery, document: {
            getElementById: id => ({ appendChild: option => dropdowns[id].push(option) }),
            createElement: tagName => ({ tagName })
        },
        sessionStorage: { getItem: () => profileId, clear: () => events.push(['clear']) },
        window: { set location(path) { events.push(['navigate', path]); } },
        alert: message => events.push(['alert', message]),
        getUserDetailByIdURL: '/synthetic/details',
        getAccessURL: '/synthetic/access',
        getLocationURL: '/synthetic/locations',
        postProfileURL: '/synthetic/create',
        postEditUserDetailsURL: '/synthetic/edit',
        accessToken: 'synthetic-token'
    });
    click({ preventDefault: () => events.push(['preventDefault']) });
    assert.deepEqual(events.shift(), ['preventDefault']);
    return { request: requests.find(({ options }) => options.method === 'POST'), events, requests, dropdowns };
}

for (const [id, action, verb] of [[null, 'create', 'added'], ['17', 'edit', 'updated']]) {
    test('profile form submits the ' + action + ' payload and confirms success', () => {
        const { request, events } = submitProfile(id);
        assert.equal(request.options.url, '/synthetic/' + action);
        assert.equal(request.options.headers.Authorization, 'synthetic-token');
        assert.equal(request.options.contentType, 'application/json');
        assert.deepEqual(JSON.parse(request.options.data), {
            firstName: 'Example', lastName: 'User', mobileNumber: '', emailId: 'user@example.test',
            address: '', city: '', country: '', postalCode: '', responsibility: 0, execution: 0,
            consulting: 0, intimation: 0, aboutMe: '', accessType: 'Supervisor', location: '',
            ...(id === null ? {} : { id, isActive: '0' })
        });
        request.resolve({ success: 200 });
        assert.deepEqual(events, [['reset'], ['navigate', 'viewProfileGrid'], ['alert', 'Profile ' + verb + ' successfully.']]);
    });
}

test('profile form retains existing email validation before saving', () => {
    const { request, events } = submitProfile(null, 'invalid-email');
    assert.equal(request, undefined);
    assert.deepEqual(events, [['alert', 'Please enter valid email id']]);
});

for (const [label, handler, response, message, clearSession] of [
    ['application 401', 'resolve', { success: 401 }, 'Your session is no longer authorized. Sign in again before saving.', true],
    ['HTTP 401', 'reject', { status: 401 }, 'Your session is no longer authorized. Sign in again before saving.', true],
    ['application 403', 'resolve', { success: 403 }, 'You do not have permission to save this profile.'],
    ['HTTP 403', 'reject', { status: 403 }, 'You do not have permission to save this profile.'],
    ['missing response', 'resolve', null, 'Unable to save the profile.'],
    ['network error', 'reject', { status: 0 }, 'Unable to save the profile.']
]) {
    test('profile form preserves input on ' + label, () => {
        const { request, events } = submitProfile('17');
        request[handler](response);
        assert.deepEqual(events, clearSession ? [['clear'], ['alert', message]] : [['alert', message]]);
    });
}


test('saving before profile edit details load sends no request', () => {
    const { request, events } = submitProfile('17', undefined, '');
    assert.equal(request, undefined);
    assert.deepEqual(events, [['alert', 'The profile details are unavailable. Reopen the profile before saving.']]);
});


test('profile edit waits for both option lists before requesting details', () => {
    const { requests, events, dropdowns } = submitProfile('17', undefined, '');
    assert.equal(requests.length, 2);
    requests[1].options.success({ body: [{ workLocation: 'West <Annex> & Co' }] });
    assert.deepEqual(dropdowns.location, [{ tagName: 'option', value: 'West <Annex> & Co', textContent: 'West <Annex> & Co' }]);
    assert.equal(requests.length, 2);
    requests[0].options.success({ body: [] });
    const { options } = requests[2];
    assert.equal(options.url, '/synthetic/details');
    assert.equal(options.data.id, '17');
    options.error();
    assert.deepEqual(events.at(-1), ['alert', 'Unable to load the profile. Reopen it and try again.']);
});
