import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createContext, runInContext } from 'node:vm';

const scripts = new URL('../../main/resources/static/logics/', import.meta.url);

function loadStatuses(context) {
    runInContext(readFileSync(new URL('statusUtils.js', scripts), 'utf8'), context);
}

test('task dropdowns use the grid status labels and order before role restrictions run', () => {
    const selects = Array.from({ length: 2 }, () => ({
        options: [{ value: '', textContent: 'Select status' }],
        append(option) { this.options.push(option); }
    }));
    let ready;
    const context = createContext({
        document: {
            querySelectorAll(selector) {
                assert.equal(selector, 'select.createTaskFormStatus');
                return selects;
            },
            createElement() { return {}; }
        },
        window: {},
        $: () => ({ ready(handler) { ready = handler; }, on() {}, datepicker() {} }),
        setInterval() {}
    });
    loadStatuses(context);
    runInContext(readFileSync(new URL('common.js', scripts), 'utf8'), context);
    context.topNavUserName = () => {};
    context.showTaskbyTypeHandler = () => {};
    let rolesApplied = false;
    context.roleBaseAccess = () => {
        assert.equal(selects[0].options.find(option => option.value === 'Done').textContent, 'Completed');
        rolesApplied = true;
    };
    ready();
    assert.equal(rolesApplied, true);
    context.populateTaskStatusOptions();

    const expectedCodes = [
        '', 'UrgentProcess', 'InProcess', 'CAReview', 'ReadyToCheck', 'ReadyToUpload',
        'OnSubmission', 'DiscussionWithSatishJi', 'StuckClient', 'WorkOnClientEnd',
        'TPPending', 'ShortWork', 'FollowUp', 'Done', 'FutureWork'
    ];
    for (const select of selects) {
        assert.deepEqual(select.options.map(option => option.value), expectedCodes);
        select.options.slice(1).forEach((option, index) => {
            assert.equal(option.textContent, context.getStatusLabel(option.value));
            assert.equal(context.getStatusSortOrder(option.value), index + 1);
            assert.equal(context.getRowClassFromStatusLabel(option.textContent), option.value);
        });
    }
});

test('legacy and unknown status values retain their grid behavior', () => {
    const context = createContext({});
    loadStatuses(context);
    assert.equal(context.getStatusLabel('In Process'), 'Processing');
    assert.equal(context.getStatusSortOrder('In Process'), 2);
    assert.equal(context.getStatusLabel('Unexpected status'), 'Unexpected status');
    assert.equal(context.getStatusSortOrder('Unexpected status'), 999);
    assert.equal(context.getStatusLabel('constructor'), 'constructor');
    assert.equal(context.getRowClassFromStatusLabel('Unexpected status'), null);
});
