import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createListGridHarness } from './support/list-grid.mjs';

function createProfileGridHarness() {
    return createListGridHarness({
        scriptName: 'viewProfile',
        statusSelector: '#profileGridStatus',
        detailsSelector: '.profile-details',
        requestUrls: { getUsersProfileURL: '/synthetic/profiles' }
    });
}

test('profiles render as literal text after the response and View/Edit stores the profile ID', () => {
    const grid = createProfileGridHarness();
    assert.equal(grid.status, 'Loading profiles...');
    assert.equal(grid.request.url, '/synthetic/profiles');
    assert.equal(grid.request.headers.Authorization, 'synthetic-token');
    assert.equal(grid.tableOptions.length, 0);

    grid.request.success({
        success: 200,
        body: [
            { id: 17, firstName: 'Example <Review>', lastName: 'A & B', accessType: 'Manager', isActive: 1 },
            { id: 18, firstName: 'Second', lastName: 'Profile', accessType: 'TeamMember', isActive: 0 }
        ]
    });

    const cells = grid.rows[0].children;
    assert.equal(cells[0].textContent, 'Example <Review> A & B');
    assert.deepEqual(cells[0].children, []);
    assert.equal(cells[1].textContent, 'Manager');
    assert.equal(cells[2].textContent, 'Active');
    assert.equal(grid.rows[1].children[2].textContent, 'Deactive');
    assert.equal(grid.status, '');
    assert.deepEqual(grid.checks, [200]);
    assert.equal(grid.tableOptions.length, 1);
    assert.equal(grid.tableOptions[0].buttons[0].extend, 'excelHtml5');

    const details = cells[3].children[0];
    assert.equal(details.type, 'button');
    assert.equal(details.textContent, 'View/Edit');
    grid.clickDetails(details);
    assert.deepEqual(grid.navigation, [['profileId', '17'], ['location', 'profile']]);
});

test('an empty profile list initializes the table with an empty result message', () => {
    const grid = createProfileGridHarness();
    grid.request.success({ success: 200, body: [] });

    assert.deepEqual(grid.rows, []);
    assert.equal(grid.tableOptions[0].language.emptyTable, 'No profiles found.');
    assert.equal(grid.status, '');
});

test('failed profile requests show an error and leave the table uninitialized', () => {
    for (const finish of [
        request => request.success({ success: 401 }),
        request => request.success({ success: 200, body: {} }),
        request => request.error()
    ]) {
        const grid = createProfileGridHarness();
        finish(grid.request);
        assert.match(grid.status, /Could not load profiles/);
        assert.deepEqual(grid.rows, []);
        assert.deepEqual(grid.tableOptions, []);
    }
});
