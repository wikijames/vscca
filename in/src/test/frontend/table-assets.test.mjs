import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const resources = new URL('../../main/resources/', import.meta.url);
const readTemplate = name => readFileSync(new URL('templates/' + name + '.html', resources), 'utf8');
const localScripts = html => Array.from(html.matchAll(/th:src="@\{\/([^}"?]+)/g), match => match[1]);

test('the shared dashboard script fragment loads one local Excel export stack in dependency order', () => {
    const fragment = readTemplate('fragments/footer').split('th:fragment="dashboard-scripts"')[1].split('</div>')[0];
    const scripts = localScripts(fragment);
    const exportStack = [
        'vendor/jszip/dist/jszip.min.js',
        'vendor/datatables.net/js/dataTables.min.js',
        'vendor/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'vendor/datatables.net-buttons/js/dataTables.buttons.min.js',
        'vendor/datatables.net-buttons-bs4/js/buttons.bootstrap4.min.js',
        'vendor/datatables.net-buttons/js/buttons.html5.min.js'
    ];

    assert.equal(scripts.filter(script => script === 'vendor/jquery/dist/jquery.min.js').length, 1);
    assert.ok(scripts.indexOf('vendor/jquery/dist/jquery.min.js') < scripts.indexOf(exportStack[0]));
    assert.deepEqual(scripts.filter(script => /vendor\/(?:datatables\.net|jszip)/.test(script)), exportStack);
    for (const script of exportStack) {
        assert.ok(existsSync(new URL('static/' + script, resources)), script);
    }
    assert.doesNotMatch(fragment, /<script src="https?:\/\//);
});

test('table pages inherit the shared stack without loading another DataTables instance', () => {
    for (const page of ['viewTask', 'dashboard', 'reports', 'viewProfile', 'viewBillingClient',
        'auditList/viewAuditList', 'dscAudit/viewDscAudit']) {
        const html = readTemplate(page);
        assert.ok(/fragments\/footer :: dashboard-scripts/.test(html), page);
        assert.equal(localScripts(html).some(script => /vendor\/(?:datatables\.net|jszip)/.test(script)), false, page);
    }
});
