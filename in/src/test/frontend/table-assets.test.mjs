import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const resources = new URL('../../main/resources/', import.meta.url);
const readTemplate = name => readFileSync(new URL('templates/' + name + '.html', resources), 'utf8');
const localScripts = html => Array.from(html.matchAll(/th:src="@\{\/([^}"?]+)/g), match => match[1]);

test('the table fragment loads one local Excel export stack after shared jQuery', () => {
    const footer = readTemplate('fragments/footer');
    const dashboardScripts = localScripts(footer.split('th:fragment="dashboard-scripts"')[1].split('</div>')[0]);
    const fragment = footer.split('th:fragment="table-scripts"')[1].split('</div>')[0];
    const scripts = localScripts(fragment);
    const exportStack = [
        'vendor/jszip/dist/jszip.min.js',
        'vendor/datatables.net/js/dataTables.min.js',
        'vendor/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'vendor/datatables.net-buttons/js/dataTables.buttons.min.js',
        'vendor/datatables.net-buttons-bs4/js/buttons.bootstrap4.min.js',
        'vendor/datatables.net-buttons/js/buttons.html5.min.js'
    ];

    assert.equal(dashboardScripts.filter(script => script === 'vendor/jquery/dist/jquery.min.js').length, 1);
    assert.ok(!dashboardScripts.some(script => exportStack.includes(script) || script === 'logics/gridColumns.js'));
    assert.deepEqual(scripts.filter(script => /vendor\/(?:datatables\.net|jszip)/.test(script)), exportStack);
    for (const script of exportStack) {
        assert.ok(existsSync(new URL('static/' + script, resources)), script);
    }
    assert.doesNotMatch(fragment, /<script src="https?:\/\//);
    assert.equal(scripts.some(script => /moment/i.test(script)), false);
});

test('each active grid loads the shared table stack before its own script', () => {
    for (const [page, app] of [
        ['dashboard', 'viewTask'], ['viewTask', 'viewTask'], ['reports', 'reports'],
        ['viewProfile', 'viewProfile'], ['viewBillingClient', 'viewBillingClient']
    ]) {
        const html = readTemplate(page);
        const shared = html.indexOf('fragments/footer :: dashboard-scripts');
        const table = html.indexOf('fragments/footer :: table-scripts');
        const columns = html.indexOf('logics/gridColumns.js');
        const pageScript = html.indexOf('logics/' + app + '.js');

        assert.ok(shared >= 0 && shared < table && table < pageScript, page);
        assert.equal((html.match(/fragments\/footer :: table-scripts/g) || []).length, 1, page);
        if (page === 'reports') {
            assert.equal(columns, -1);
        } else {
            assert.ok(table < columns && columns < pageScript, page);
        }
    }
});

test('pages without active grids omit the table stack', () => {
    for (const page of ['createTask', 'myProfile', 'auditList/viewAuditList', 'dscAudit/viewDscAudit']) {
        const html = readTemplate(page);
        assert.ok(!html.includes('fragments/footer :: table-scripts'), page);
        assert.ok(!localScripts(html).includes('logics/gridColumns.js'), page);
    }
});

test('profile and billing pages load the shared list loader before the page script', () => {
    const helper = 'logics/listGrid.js';
    assert.ok(existsSync(new URL('static/' + helper, resources)));
    assert.ok(!localScripts(readTemplate('fragments/footer')).includes(helper));
    for (const page of ['viewProfile', 'viewBillingClient']) {
        const scripts = localScripts(readTemplate(page));
        assert.deepEqual(scripts.slice(-2), [helper, 'logics/' + page + '.js'], page);
    }
});
