import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { createElement } from './dom.mjs';

const scripts = ['dateUtils', 'statusUtils', 'gridColumns', 'viewTask'].map(name => {
    const file = new URL(`../../../main/resources/static/logics/${name}.js`, import.meta.url);
    return { name, source: readFileSync(file, 'utf8') };
});

export function makeTask(overrides = {}) {
    return {
        taskId: 42,
        projectName: 'Example project',
        partyName: 'Example client',
        responsibilityName: 'Example owner',
        exceutionName: '',
        consultingName: '',
        intimationName: '',
        taskType: 'Example',
        dueDate: '2026-11-24T12:00:00',
        taskDescription: 'Example task',
        status: 'InProcess',
        ...overrides
    };
}

export function createTaskGridHarness() {
    const messages = new Map();
    const rows = [];
    const requests = [];
    const sessionChecks = [];
    const tableConfigurations = [];
    const properties = new Map();
    const toastMessages = [];
    const modalActions = [];
    let reloads = 0;
    let tableInitialized = false;

    function jquery(selector) {
        if (typeof selector === 'function') {
            return; // These tests call the grid entry point without a browser ready event.
        }

        return {
            length: 1,
            val() {},
            addClass() {},
            removeClass() {},
            prop(name, value) { properties.set(selector + ':' + name, value); },
            show() { properties.set(selector + ':visible', true); },
            hide() { properties.set(selector + ':visible', false); },
            modal(action) { modalActions.push(action); },
            text(value) { messages.set(selector, value); },
            empty() { rows.length = 0; },
            appendTo(target) { rows.push({ target, element: selector }); },
            remove() {},
            DataTable(options) {
                if (options) {
                    tableInitialized = true;
                    tableConfigurations.push(options);
                }
                return {
                    clear() { return this; },
                    destroy() { tableInitialized = false; }
                };
            }
        };
    }

    jquery.fn = {
        dataTable: {
            isDataTable: () => tableInitialized,            util: { escapeRegex: value => value.replace(/[\^$.*+?()[\]{}|\\]/g, match => '\\' + match) }
        }
    };
    jquery.each = (items, visit) => items.forEach((item, index) => visit(index, item));
    jquery.ajax = options => {
        let settled = false;
        let onSuccess = options.success;
        let onFailure = options.error;

        const request = {
            options,
            done(handler) { onSuccess = handler; return this; },
            fail(handler) { onFailure = handler; return this; },
            resolve(data) {
                if (settled) return;
                settled = true;
                onSuccess(data);
                options.complete?.();
            },
            reject(reason = 'error') {
                if (settled) return;
                settled = true;
                onFailure({}, reason);
                options.complete?.();
            },
            abort() {
                if (settled) return;
                this.aborted = true;
                this.reject('abort');
            }
        };

        requests.push(request);
        return request;
    };

    const grid = createContext({
        $: jquery,
        jQuery: jquery,
        document: { createElement },
        accessToken: 'synthetic-token',
        updateTaskStatusURL: '/synthetic/bulk-status',
        checkSession: status => sessionChecks.push(status),
        window: { location: { pathname: '/vscca/viewTaskGrid' } }
    });
    for (const { name, source } of scripts) {
        runInContext(source, grid, { filename: `${name}.js` });
    }
    grid.clearSelection = () => { grid.selectedTaskIds = []; };
    grid.showStatusToast = (message, type) => toastMessages.push({ message, type });
    grid.showTaskbyTypeHandler = () => { reloads++; };

    return {
        load(url = '/synthetic/tasks') {
            grid.populateData(url);
            return requests.at(-1);
        },
        selectTask: grid.addSelectedTaskId,
        submitStatusUpdate(status) {
            grid.bulkUpdateTaskStatus(Array.from(grid.selectedTaskIds), status);
            return requests.at(-1);
        },
        get selectedTaskIds() { return Array.from(grid.selectedTaskIds); },
        get requestCount() { return requests.length; },
        get reloads() { return reloads; },
        properties,
        toastMessages,
        modalActions,
        buildColumnSearch: grid.buildGridColumnSearch,
        get status() { return messages.get('#taskGridStatus'); },
        get count() { return messages.get('#recordCount'); },
        rows,
        sessionChecks,
        tableConfigurations
    };
}
