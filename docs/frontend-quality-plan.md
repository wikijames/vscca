# Frontend testing and dependency plan

## Phase 1 Regression coverage

Run the [Node test runner](https://nodejs.org/api/test.html) on a supported Node release (22 or newer) from the repository root.

```powershell
node --test in/src/test/frontend/*.test.mjs
```

The task-grid suite loads the shipped browser scripts and imports `createTaskGridHarness` and `makeTask` from `support/task-grid.mjs`. The harness supplies fresh synthetic AJAX and DataTables substitutes per test. Extend these tests for filters, export configuration, selection, and bulk updates as each feature changes. Use browser smoke tests for actual rendering and plugin integration. Frontend navigation tests cover the dashboard roles and personal task endpoints. JUnit 5 executes the repository visibility queries against synthetic data in an in-memory H2 schema. This covers the cutoff, task assignments, and completed-task exclusions. The current DATETIME comparison includes midnight on day 59 and excludes later times that day. Run the focused repository test with `mvnw.cmd -Dtest=TaskVisibilityRepositoryTest test` from `in`. Verify the queries against the deployed MySQL version separately.

## Phase 2 Dependency findings and focused patches

The 24 November 2026 review covers declared Maven dependencies and selected browser assets. Confirm the resolved Maven tree with `mvnw.cmd dependency:tree` and use an advisory scanner against the resolved graph. Check the actual deployment container and inventory referenced local and CDN assets independently.

| Dependency | Finding and compatibility work |
| --- | --- |
| Apache POI OOXML 4.1.2 | CVE-2025-31672 affects versions before 5.4.0. `ExcelController` opens incoming workbooks with `XSSFWorkbook`. Upgrade to a maintained release and test normal XLSX uploads, parse-error handling, and response behavior with synthetic workbooks. [Apache POI advisory](https://poi.apache.org/) |
| jQuery 3.4.1 | The vendored builds move to 3.8.0, which includes the earlier HTML parsing fixes and the November 2026 selector fix. Staying on the 3.x line fits the current Bootstrap 4 integration. Test Argon, Bootstrap, Select2, and DataTables. Change task rows and other API-backed renderers to insert plain text through DOM APIs where appropriate. [HTML parsing fix](https://blog.jquery.com/2020/04/10/jquery-3-5-0-released/) / [jQuery 3.8.0 release](https://blog.jquery.com/2026/11/17/jquery-4-1-0-and-3-8-0-released-passing-the-torch/) |
| Moment 2.8.4 | Remove Moment and its DataTables adapter. The task grid supplies a calendar-day sort key through DataTables HTML attributes. The old version predates the 2.11.2 ReDoS fix and is outside the affected 2.18.0 to 2.29.3 range of CVE-2022-31129. [Moment changelog](https://github.com/moment/moment/blob/develop/CHANGELOG.md) / [CVE-2022-31129 advisory](https://github.com/moment/moment/security/advisories/GHSA-wc69-rhjr-hc9g) / [DataTables sorting data](https://datatables.net/manual/core/data/orthogonal-data) |
| DataTables 1.10.15, Buttons 1.4.0, and JSZip 3.1.3 | Upgrade to DataTables 2.3.8, Buttons 3.2.6, and JSZip 3.10.2 together. Keep the existing jQuery and Bootstrap 4 integration while moving the grids to the DataTables 2 layout API. DataTables 1.11.3 corrected a text-renderer escaping issue with arrays, and newer JSZip browser distributions include archive-handling hardening. Verify which paths are used and test grid filters, sorting, and generated XLSX files against the locally served assets. [DataTables release notes](https://cdn.datatables.net/1.11.3/) / [JSZip changelog](https://github.com/Stuk/jszip/blob/main/CHANGES.md) |
| Tomcat | Boot manages Tomcat 9.0.48 and this WAR declares Tomcat as provided. Check the deployed container separately. The managed version falls in the affected range for advisories including CVE-2026-55956, which depends on default-servlet security constraints. If the runtime uses an affected version, patch it and verify WAR startup and routing. [Boot managed versions](https://docs.spring.io/spring-boot/docs/2.5.2/reference/html/dependency-versions.html) · [Tomcat advisories](https://tomcat.apache.org/security-9.html) |
| Spring Framework 5.3.8 | The Boot-managed version falls in the range for CVE-2024-38828. Its documented controller parameter pattern was absent in the source review. Resolve and scan the full dependency tree before prioritizing other Spring advisories. [Spring advisory](https://spring.io/security/cve-2024-38828/) |
| MySQL and Oracle JDBC | Compare resolved Connector/J and Oracle JDBC versions with Oracle's advisory matrices and confirm which driver the deployment uses. Test database connections and repository queries after an upgrade. The October 2026 connector advisories require version-by-version matching. [Oracle October 2026 advisories](https://www.oracle.com/security-alerts/cpuoct2026.html) |

## Phase 3 Platform and authentication upgrades

Move Java and Spring Boot in a dedicated migration. A move through Boot 3 requires Java 17 or newer and changes servlet and persistence imports from `javax` to `jakarta`. Verify container compatibility, mappings, Thymeleaf rendering, and database access. Review the JJWT 0.9.1 parser and signing call sites as part of an independent authentication upgrade. Check token issuance, expiry, and rejection with synthetic keys. [Spring migration overview](https://spring.io/blog/2022/01/20/spring-boot-3-0-0-m1-is-now-available/) · [JJWT changelog](https://github.com/jwtk/jjwt/blob/master/CHANGELOG.md)

## Phase 4 Keep the checks running

The GitHub Actions workflow runs the Node suite and Java 8 regression tests on pull requests to `development` and on pushes to that branch. Maven excludes tests tagged `database` so the run uses synthetic data and needs no external database. The existing application context smoke test carries that tag. Add dependency scanning once the browser asset inventory is reproducible. Review applicable advisories when they are published and on a regular schedule. Keep legacy branches available for reference and target ongoing changes to `development`.

## Implementation checklist

Checked items have implementation and regression coverage where applicable.

- [x] Establish development as the default branch and retain legacy branches.
- [x] Refactor task-grid loading, date sorting, text rendering, filtering and bulk status updates.
- [x] Add reusable frontend fixtures, Java Excel and visibility tests, and hosted PR checks.
- [x] Update Apache POI, jQuery, DataTables, Buttons and JSZip, and remove standalone Moment assets.
- [x] Apply text rendering and response-driven table setup to Profiles, Billing Clients and Daybook Reports.

### Frontend

- [x] Use one catalog for task status dropdowns and the grid.
- [ ] Restore the standalone View Tasks assignment selector. Confirm what Responsibility should include before connecting it to an endpoint.
- [ ] Complete Audit List and DSC Audit. Confirm their intended workflows and API contracts, then replace the placeholder or missing scripts.
- [x] Share the list request and loading flow for Profiles and Billing Clients.
- [x] Load the DataTables export scripts and column helpers only on the pages that use them.
- [x] Share Billing Client create and edit save handling and cover success and failure with mocked requests.
- [x] Harden password form rendering, validation and request feedback with mocked coverage.
- [x] Share Profile create and edit save handling and cover permission failures with reusable AJAX mocks.
- [x] Share Task create and edit save handling and cover failed requests with reusable AJAX mocks.
- [x] Render task form dropdown labels through DOM text properties and preserve option values.
- [x] Render Profile access types and work locations as literal dropdown text and preserve submitted values.
- [ ] Review remaining request and session code and scope other frontend assets where appropriate.
- [ ] Review and remove confirmed unused frontend assets.

### Security and verification

- [x] Enforce administrator authorization for account password resets and profile writes involving administrator roles.
- [ ] Add focused synthetic tests for refactors and security fixes. Confirm whether day 59 should include all timestamps before changing the cutoff.
- [ ] Inventory active browser assets, scan the resolved Maven dependency graph, and review authentication and authorization code.
- [ ] Review Java, Spring Boot, and JJWT upgrade options. Use isolated tests for compatibility changes that can be verified locally.
### Deferred

- [ ] Run live browser and native MySQL smoke tests.
- [ ] Verify deployed Tomcat and JDBC versions and apply any runtime patches.
- [ ] Generate WARs, move generated artifacts out of the source tree, and verify deployment.
