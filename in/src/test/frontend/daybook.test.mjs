import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createContext, runInContext } from 'node:vm';
import { createElement } from './support/dom.mjs';

function createDaybook() {
    const rows = [];
    const requests = [];
    const inputs = new Map([['#startDate', '1-11-2026'], ['#endDate', '24-11-2026']]);
    const tables = [];
    let disabled = false;
    let activeTable = false;
    let status;
    function jquery(selector) {
        if (typeof selector === 'function') return;
        return {
            val: () => inputs.get(selector),
            prop(name, value) {
                assert.equal(name, 'disabled');
                if (value !== undefined) disabled = value;
                return disabled;
            },
            text(value) { status = value; },
            empty() { rows.length = 0; return this; },
            append(row) { rows.push(row); },
            DataTable(options) {
                if (options) {
                    tables.push(options);
                    activeTable = true;
                }
                return { clear() { return this; }, destroy() { activeTable = false; } };
            }
        };
    }
    jquery.fn = { dataTable: { isDataTable: () => activeTable } };
    jquery.ajax = request => requests.push(request);
    const context = createContext({
        $: jquery,
        document: { createElement },
        postTaskDetailsDayBookURL: '/synthetic/daybook',
        accessToken: 'synthetic',
        checkSession() {}
    });
    for (const name of ['dateUtils', 'reports']) {
        const file = new URL('../../main/resources/static/logics/' + name + '.js', import.meta.url);
        runInContext(readFileSync(file, 'utf8'), context);
    }
    return {
        rows, requests, inputs, tables,
        load: context.loadDaybook,
        get status() { return status; },
        get disabled() { return disabled; }
    };
}

test('daybook validates calendar dates and rejects a reversed range before sending', () => {
    const grid = createDaybook();
    for (const date of ['31-11-2026', '25-11-2026', '']) {
        grid.inputs.set('#startDate', date);
        grid.load();
        assert.equal(grid.requests.length, 0);
        assert.match(grid.status, /valid date range/);
    }
});

test('daybook sends one request and renders literal values for Excel', () => {
    const grid = createDaybook();
    grid.load();
    grid.load();
    assert.equal(grid.requests.length, 1);
    const request = grid.requests[0];
    assert.deepEqual(JSON.parse(request.data), { startDate: '2026-11-01', endDate: '2026-11-24' });
    assert.equal(request.headers.Authorization, 'synthetic');
    assert.equal(grid.disabled, true);
    request.success({ success: 200, body: [{
        projectName: 'Project <Review> & Co', createdAt: '2026-11-04T12:00:00', remarks: null
    }] });
    request.complete();

    const cells = grid.rows[0].children;
    assert.equal(cells.length, 12);
    assert.equal(cells[0].textContent, 'Project <Review> & Co');
    assert.deepEqual(cells[0].children, []);
    assert.equal(cells[8].textContent, '04-11-2026');
    assert.equal(cells[11].textContent, '');
    assert.equal(grid.tables[0].buttons[0], 'excelHtml5');
    assert.equal(grid.disabled, false);
});

test('failed daybook loads retain the prior result and a successful empty load replaces it', () => {
    const grid = createDaybook();
    grid.load();
    grid.requests[0].success({ success: 200, body: [{ projectName: 'Previous result' }] });
    grid.requests[0].complete();

    for (const fail of [request => request.success({ success: 401 }), request => request.error()]) {
        grid.load();
        const request = grid.requests.at(-1);
        fail(request);
        request.complete();
        assert.match(grid.status, /Could not load/);
        assert.equal(grid.rows[0].children[0].textContent, 'Previous result');
        assert.equal(grid.disabled, false);
    }

    grid.load();
    grid.requests.at(-1).success({ success: 200, body: [] });
    grid.requests.at(-1).complete();
    assert.deepEqual(grid.rows, []);
    assert.equal(grid.tables.at(-1).language.emptyTable, 'No daybook entries found.');
});
