import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';

const scripts = ['dateUtils', 'statusUtils', 'viewTask'].map(name => {
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

function createElement(tagName) {
    const children = [];
    return {
        tagName,
        children,
        dataset: {},
        append(child) { children.push(child); },
        insertCell() {
            const cell = createElement('td');
            children.push(cell);
            return cell;
        }
    };
}

export function createTaskGridHarness() {
    const messages = new Map();
    const rows = [];
    const requests = [];
    const sessionChecks = [];
    const tableConfigurations = [];
    let tableInitialized = false;

    function jquery(selector) {
        if (typeof selector === 'function') {
            return; // These tests call the grid entry point without a browser ready event.
        }

        return {
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

    jquery.fn = { dataTable: { isDataTable: () => tableInitialized } };
    jquery.each = (items, visit) => items.forEach((item, index) => visit(index, item));
    jquery.ajax = options => {
        let settled = false;
        let onSuccess;
        let onFailure;

        const request = {
            options,
            done(handler) { onSuccess = handler; return this; },
            fail(handler) { onFailure = handler; return this; },
            resolve(data) {
                if (settled) return;
                settled = true;
                onSuccess(data);
            },
            reject(reason = 'error') {
                if (settled) return;
                settled = true;
                onFailure({}, reason);
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
        checkSession: status => sessionChecks.push(status),
        window: { location: { pathname: '/vscca/viewTaskGrid' } }
    });
    for (const { name, source } of scripts) {
        runInContext(source, grid, { filename: `${name}.js` });
    }
    grid.clearSelection = () => {};

    return {
        load(url = '/synthetic/tasks') {
            grid.populateData(url);
            return requests.at(-1);
        },
        get status() { return messages.get('#taskGridStatus'); },
        get count() { return messages.get('#recordCount'); },
        rows,
        sessionChecks,
        tableConfigurations
    };
}
