import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createListGridHarness } from './support/list-grid.mjs';

function createBillingGridHarness() {
    return createListGridHarness({
        scriptName: 'viewBillingClient',
        statusSelector: '#billingGridStatus',
        detailsSelector: '.billing-client-details',
        requestUrls: { getBillingClientsURL: '/synthetic/billing' }
    });
}

test('billing renders literal client fields after the response and View/Edit stores the billing ID', () => {
    const grid = createBillingGridHarness();
    assert.equal(grid.status, 'Loading billing clients...');
    assert.equal(grid.request.url, '/synthetic/billing');
    assert.equal(grid.request.headers.Authorization, 'synthetic-token');
    assert.equal(grid.tableOptions.length, 0);

    grid.request.success({
        success: 200,
        body: [
            { id: 17, client: 'Example <Review> & Co-001-07', isActive: '1' },
            { id: 18, client: 'Second party-004-10', isActive: '0' }
        ]
    });

    const cells = grid.rows[0].children;
    assert.deepEqual(cells.slice(0, 4).map(cell => cell.textContent), ['Example <Review> & Co', '001', '07', 'Active']);
    assert.deepEqual(cells[0].children, []);
    assert.equal(grid.rows[1].children[3].textContent, 'Deactive');
    assert.equal(grid.status, '');
    assert.equal(grid.tableOptions[0].buttons[0].extend, 'excelHtml5');

    const details = cells[4].children[0];
    assert.equal(details.type, 'button');
    assert.equal(details.textContent, 'View/Edit');
    grid.clickDetails(details);
    assert.deepEqual(grid.navigation, [['billingId', '17'], ['location', 'addBillingClient']]);
});

test('missing legacy billing fields display as blank cells', () => {
    const grid = createBillingGridHarness();
    grid.request.success({
        success: 200,
        body: [{ id: 17, client: 'Name only', isActive: 1 }, { id: 18, client: null, isActive: '0' }]
    });

    assert.deepEqual(grid.rows[0].children.slice(0, 3).map(cell => cell.textContent), ['Name only', '', '']);
    assert.deepEqual(grid.rows[1].children.slice(0, 3).map(cell => cell.textContent), ['', '', '']);
});

test('empty and failed billing requests show the corresponding state', () => {
    const empty = createBillingGridHarness();
    empty.request.success({ success: 200, body: [] });
    assert.equal(empty.tableOptions[0].language.emptyTable, 'No billing clients found.');
    assert.equal(empty.status, '');

    for (const finish of [
        request => request.success({ success: 401 }),
        request => request.success({ success: 200, body: {} }),
        request => request.error()
    ]) {
        const failed = createBillingGridHarness();
        finish(failed.request);
        assert.match(failed.status, /Could not load billing clients/);
        assert.deepEqual(failed.rows, []);
        assert.deepEqual(failed.tableOptions, []);
    }
});
