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
    const cells = grid.rows[0].element.children;
    assert.equal(cells[1].textContent, 'Example project');
    assert.equal(cells[9].textContent, '24-11-2026');
    assert.equal(cells[11].textContent, 'Processing');
    assert.equal(cells[11].dataset.order, '2');
});

test('renders punctuation and angle brackets as literal task text', () => {
    const grid = createTaskGridHarness();
    const projectName = 'Draft <Review> & "sign-off"';
    const partyName = "Example & O'Neil";
    grid.load().resolve({ success: 200, body: [makeTask({ projectName, partyName })] });

    const cells = grid.rows[0].element.children;
    assert.equal(cells[1].textContent, projectName);
    assert.equal(cells[2].textContent, partyName);
    assert.deepEqual(cells[1].children, []);
    assert.deepEqual(cells[2].children, []);
    assert.equal(cells[0].children[0].value, '42');
    const details = cells[3].children[0];
    assert.equal(details.tagName, 'button');
    assert.equal(details.type, 'button');
    assert.equal(details.dataset.taskId, '42');
    assert.equal(details.textContent, 'View/Edit');
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

    const dates = grid.rows.map(row => row.element.children[9]);
    assert.deepEqual(dates.map(cell => cell.textContent), ['31-10-2026', '01-11-2026', '01-11-2026', '', '']);
    assert.deepEqual(dates.map(cell => cell.dataset.order), [
        '20261031', '20261101', '20261101', String(Number.MAX_SAFE_INTEGER), String(Number.MAX_SAFE_INTEGER)
    ]);
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
    assert.equal(grid.rows[0].element.children[1].textContent, 'Latest project');
    assert.equal(grid.status, '');
});

test('column filters match complete literal values and clear when no values are selected', () => {
    const grid = createTaskGridHarness();
    const values = ['Client (North)+', 'West | Central', 'Client [South]'];
    const search = new RegExp(grid.buildColumnSearch(values), 'i');

    for (const value of values) {
        assert.equal(search.test(value), true, value);
    }
    for (const value of ['Client North', 'West', 'Client [South] Annex', '']) {
        assert.equal(search.test(value), false, value);
    }
    assert.equal(grid.buildColumnSearch([]), '');
});
