import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { createElement } from './dom.mjs';

export function createListGridHarness({ scriptName, statusSelector, detailsSelector, requestUrls }) {
    const script = readFileSync(new URL(`../../../main/resources/static/logics/${scriptName}.js`, import.meta.url), 'utf8');
    const rows = [];
    const checks = [];
    const navigation = [];
    const tableOptions = [];
    let request;
    let clickHandler;
    let ready;
    let status;

    function jquery(selector) {
        if (typeof selector === 'function') {
            ready = selector;
            return;
        }
        if (selector === statusSelector) {
            return { text(value) { status = value; } };
        }
        if (selector === '#populateGrid') {
            return { append(row) { rows.push(row); } };
        }
        return {
            on(event, selector, handler) {
                assert.equal(event, 'click');
                assert.equal(selector, detailsSelector);
                clickHandler = handler;
            },
            DataTable(options) { tableOptions.push(options); }
        };
    }
    jquery.ajax = options => { request = options; };

    const context = createContext({
        $: jquery,
        document: { createElement },
        window: { set location(path) { navigation.push(['location', path]); } },
        sessionStorage: { setItem(key, value) { navigation.push([key, value]); } },
        ...requestUrls,
        accessToken: 'synthetic-token',
        checkSession: code => checks.push(code),
        formatGridExportHeader() {}
    });
    const helper = readFileSync(new URL('../../../main/resources/static/logics/listGrid.js', import.meta.url), 'utf8');
    runInContext(helper, context, { filename: 'listGrid.js' });
    runInContext(script, context, { filename: scriptName + '.js' });
    ready();

    return {
        rows,
        request,
        checks,
        navigation,
        tableOptions,
        clickDetails(button) { clickHandler.call(button); },
        get status() { return status; }
    };
}
