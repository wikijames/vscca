import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../../main/resources/static/logics/common.js', import.meta.url), 'utf8');

function loadTaskView(userRole, view) {
    const requested = [];
    let heading;
    const context = {
        $: () => ({ on() {}, ready() {}, text(value) { heading = value; } }),
        document: {},
        window: { location: { pathname: '/vscca/' + view } },
        userRole,
        populateData: url => requested.push(url),
        getTaskDetailsURL: '/all',
        getTaskDetailsByUserURL: '/assigned',
        getTaskDetailsByUserTodayURL: '/today',
        getTaskDetailsByUserWeekURL: '/week',
        getTaskDetailsByUserByDueDateURL: '/overdue'
    };

    runInNewContext(script, context, { filename: 'common.js' });
    context.showTaskbyTypeHandler();
    return { requested, heading };
}

test('the dashboard requests all tasks for admins and managers', () => {
    for (const role of ['Admin', 'Manager']) {
        assert.deepEqual(loadTaskView(role, 'dashboard'), { requested: ['/all'], heading: 'All Tasks' }, role);
    }
});

test('the dashboard requests assigned tasks for supervisors and team members', () => {
    for (const role of ['Supervisor', 'TeamMember']) {
        assert.deepEqual(loadTaskView(role, 'dashboard'), { requested: ['/assigned'], heading: 'Your Tasks' }, role);
    }
});

test('personal task views use their own endpoints for every dashboard role', () => {
    for (const role of ['Admin', 'Manager', 'Supervisor', 'TeamMember']) {
        for (const [view, endpoint] of [['yourTask', '/assigned'], ['today', '/today'],
            ['week', '/week'], ['overdue', '/overdue']]) {
            assert.deepEqual(loadTaskView(role, 'dashboard/' + view).requested, [endpoint], role + ' ' + view);
        }
    }
});
