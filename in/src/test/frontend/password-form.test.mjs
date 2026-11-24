import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { createElement } from './support/dom.mjs';

const script = readFileSync(new URL('../../main/resources/static/logics/password.js', import.meta.url), 'utf8');

function createPasswordForm(userRole) {
    const fields = { '#password': 'synthetic-password', '#confirmPassword': 'synthetic-password', '#userNames': 'user@example.test' };
    const requests = [];
    const events = [];
    const userNames = createElement('select');
    let submit;
    const jquery = selector => ({
        ready: callback => callback(),
        on: (event, callback) => {
            assert.equal(selector, '#changePasswordForm');
            assert.equal(event, 'submit');
            submit = callback;
        },
        val: () => fields[selector],
        prop: (name, value) => events.push([selector, name, value]),
        0: { reset: () => events.push(['reset']) }
    });
    jquery.ajax = options => {
        const request = { options };
        requests.push(request);
        return {
            done(callback) { request.resolve = callback; return this; },
            fail(callback) { request.reject = callback; return this; },
            always(callback) { request.finish = callback; return this; }
        };
    };

    runInNewContext(script, {
        $: jquery,
        document: { createElement, getElementById: () => userNames },
        userRole,
        getUsersURL: '/synthetic/users',
        PostPasswordChangeURL: '/synthetic/admin-password',
        postPasswordChangeSelfURL: '/synthetic/self-password',
        accessToken: 'synthetic-token',
        alert: message => events.push(['alert', message]),
        sessionStorage: { clear: () => events.push(['clear']) },
        window: { set location(path) { events.push(['navigate', path]); } }
    });

    return {
        fields, requests, events, userNames,
        submit() {
            let prevented = false;
            submit({ preventDefault: () => { prevented = true; } });
            assert.ok(prevented);
        }
    };
}

for (const [role, endpoint, destination] of [
    ['Admin', '/synthetic/admin-password', 'adminPanel'],
    ['TeamMember', '/synthetic/self-password', 'dashboard']
]) {
    test(role + ' submits the expected password request and redirects on success', () => {
        const form = createPasswordForm(role);
        assert.equal(form.requests.length, role === 'Admin' ? 1 : 0);
        form.submit();
        const request = form.requests.at(-1);
        assert.equal(request.options.url, endpoint);
        assert.equal(request.options.method, 'POST');
        assert.equal(request.options.headers.Authorization, 'synthetic-token');
        assert.deepEqual(JSON.parse(request.options.data), {
            password: 'synthetic-password',
            ...(role === 'Admin' ? { userName: 'user@example.test' } : {})
        });
        request.resolve({ success: 200 });
        request.finish();
        assert.deepEqual(form.events, [
            ['#save', 'disabled', true], ['reset'], ['alert', 'Password updated successfully.'],
            ['navigate', destination], ['#save', 'disabled', false]
        ]);
    });
}

test('admin user options keep names and email addresses as literal text and values', () => {
    const form = createPasswordForm('Admin');
    const request = form.requests[0];
    assert.equal(request.options.url, '/synthetic/users');
    request.resolve({ success: 200, body: [{ firstName: 'Example <Admin>', lastName: '& Co', emailId: 'user@example.test' }] });
    const [option] = form.userNames.children;
    assert.equal(option.tagName, 'option');
    assert.equal(option.textContent, 'Example <Admin> & Co');
    assert.equal(option.value, 'user@example.test');
    assert.deepEqual(option.children, []);
});

test('the form rejects missing passwords, mismatches and missing admin selection', () => {
    const form = createPasswordForm('Admin');
    form.fields['#confirmPassword'] = 'different';
    form.submit();
    form.fields['#password'] = form.fields['#confirmPassword'] = '';
    form.submit();
    form.fields['#password'] = form.fields['#confirmPassword'] = 'synthetic-password';
    form.fields['#userNames'] = '';
    form.submit();
    assert.equal(form.requests.length, 1);
    assert.deepEqual(form.events, [
        ['alert', 'Enter matching passwords.'],
        ['alert', 'Enter matching passwords.'],
        ['alert', 'Select a user before resetting their password.']
    ]);
});

for (const [label, handler, response, unauthorized] of [
    ['application 401', 'resolve', { success: 401 }, true],
    ['HTTP 401', 'reject', { status: 401 }, true],
    ['missing response', 'resolve', null, false],
    ['network error', 'reject', { status: 0 }, false]
]) {
    test('password form stays open and re-enables Save on ' + label, () => {
        const form = createPasswordForm('TeamMember');
        form.submit();
        const [request] = form.requests;
        request[handler](response);
        request.finish();
        assert.deepEqual(form.events, [
            ['#save', 'disabled', true],
            ...(unauthorized
                ? [['clear'], ['alert', 'Your session is no longer authorized. Sign in again to continue.']]
                : [['alert', 'Unable to update the password.']]),
            ['#save', 'disabled', false]
        ]);
    });
}
