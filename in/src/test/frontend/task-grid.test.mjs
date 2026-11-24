import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createTaskGridHarness, makeTask } from './support/task-grid.mjs';

test('shows loading and renders task data when the request succeeds', () => {
    const grid = createTaskGridHarness();
    const request = grid.load();

    assert.equal(grid.status, 'Loading tasks...');
    assert.equal(request.options.type, 'GET');
    assert.equal(request.options.url, '/synthetic/tasks');
    assert.equal(request.options.headers.Authorization, 'synthetic-token');

    request.resolve({ success: 200, body: [makeTask()] });

    assert.equal(grid.status, '');
    assert.equal(grid.count, 1);
    assert.deepEqual(grid.sessionChecks, [200]);
    assert.equal(grid.rows.length, 1);
    assert.equal(grid.rows[0].target, '#populateGrid');
    assert.match(grid.rows[0].markup, /Example project/);
    assert.match(grid.rows[0].markup, /24-11-2026/);
    assert.match(grid.rows[0].markup, /data-order="2">Processing/);
});

test('sorts due dates by displayed calendar day and leaves unusable dates blank', () => {
    const grid = createTaskGridHarness();
    grid.load().resolve({
        success: 200,
        body: [
            makeTask({ dueDate: '2026-10-31T23:30:00' }),
            makeTask({ dueDate: '2026-11-01T18:00:00' }),
            makeTask({ dueDate: '2026-11-01T08:00:00' }),
            makeTask({ dueDate: null }),
            makeTask({ dueDate: 'invalid' })
        ]
    });

    assert.match(grid.rows[0].markup, /data-order="20261031">31-10-2026</);
    assert.match(grid.rows[1].markup, /data-order="20261101">01-11-2026</);
    assert.match(grid.rows[2].markup, /data-order="20261101">01-11-2026</);
    for (const row of grid.rows.slice(3)) {
        assert.ok(row.markup.includes('<td data-order="' + Number.MAX_SAFE_INTEGER + '"></td>'));
    }
});

test('replaces previous rows and configures the empty grid message', () => {
    const grid = createTaskGridHarness();
    grid.load().resolve({ success: 200, body: [makeTask()] });
    grid.load().resolve({ success: 200, body: [] });

    assert.equal(grid.status, '');
    assert.equal(grid.count, 0);
    assert.deepEqual(grid.rows, []);
    assert.equal(grid.tableConfigurations.length, 2);
    assert.equal(grid.tableConfigurations.at(-1).language.emptyTable, 'No tasks found.');
});

for (const [name, finish] of [
    ['an API rejection', request => request.resolve({ success: 401 })],
    ['an invalid response body', request => request.resolve({ success: 200, body: {} })],
    ['a network failure', request => request.reject()]
]) {
    test(`shows an error after ${name}`, () => {
        const grid = createTaskGridHarness();
        finish(grid.load());

        assert.match(grid.status, /Could not load tasks/);
        assert.equal(grid.count, '');
        assert.deepEqual(grid.rows, []);
        assert.equal(grid.tableConfigurations.length, 0);
    });
}

test('cancels the previous request and only renders the latest results', () => {
    const grid = createTaskGridHarness();
    const previous = grid.load('/synthetic/previous');
    const latest = grid.load('/synthetic/latest');

    assert.equal(previous.aborted, true);
    assert.equal(grid.status, 'Loading tasks...');

    latest.resolve({ success: 200, body: [makeTask({ projectName: 'Latest project' })] });
    previous.resolve({ success: 200, body: [makeTask({ projectName: 'Previous project' })] });

    assert.equal(grid.rows.length, 1);
    assert.match(grid.rows[0].markup, /Latest project/);
    assert.equal(grid.status, '');
});
