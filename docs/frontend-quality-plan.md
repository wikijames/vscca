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

## Consolidated cleanup and security review

The template script inventory covers the shared login and dashboard fragments, table fragments, and page scripts. Shared scripts include jQuery 3.8.0, Bootstrap 4.4.1 (bundled Popper), Argon 1.2.0, jQuery Scrollbar and Scroll Lock 3.1.3. The shared dashboard footer provides Bootstrap Datepicker 1.9.0 and Select2 4.0.13. Task and audit templates no longer load a second copy of Datepicker. Table and export fragments reference DataTables 2.3.8, Buttons 3.2.6, their Bootstrap adapters and JSZip 3.10.2. Check Bootstrap, Select2 and form plugin compatibility in a browser before upgrading their bundles. Reconcile the scrollbar version and any externally hosted styles during closeout.

The Maven declaration review found Spring Boot 2.5.2, JJWT 0.9.1 and POI 5.5.1. Spring Framework 5.3 has ended open-source support and JJWT 0.9.1 is outside its supported range. POI 5.5.1 already includes the earlier OOXML patch discussed above. Keep the framework and JWT upgrades in their migration scope. CI now reports the resolved Maven dependency tree, including transitive dependencies and scopes, in the Java job log. Use that inventory for advisory triage. A vulnerability scan of the resolved tree is still pending. Vendored browser assets and the deployed container require separate review. [Spring support](https://spring.io/blog/2024/03/01/support-timeline-announcement-for-spring-framework-6-0-x-and-5-3-x/) / [JJWT security policy](https://github.com/jwtk/jjwt/security) / [Apache POI release history](https://poi.apache.org/changes.html)

## WAR builds from development

Pull requests to development run the frontend and Java regression checks. GitHub Actions packages a WAR only after development is updated. Download the artifact named `vscca-development-<commit>` from the successful development run and extract the WAR. GitHub retains it for 14 days. Deploy manually from the commit you intend to release and use the server's existing WAR naming convention if it determines the application context.

Before deploying the first CI-built WAR, set `VSCCA_DB_URL`, `VSCCA_DB_USERNAME`, `VSCCA_DB_PASSWORD`, and `VSCCA_JWT_SIGNING_KEY` in the Tomcat process environment. The signing key must be Base64-encoded and contain at least 32 random bytes before encoding. Rotate any real values previously committed to the repository. Changing the signing key invalidates existing sessions. Verify startup against the target Tomcat and Java versions.

To package locally with a compatible JDK, run `.\mvnw.cmd -DexcludedGroups=database clean package` from `in`. Maven writes the WAR to `in/target/`.

## Implementation checklist

Checked items have implementation and regression coverage where applicable.

- [x] Establish development as the default branch and retain legacy branches.
- [x] Refactor task-grid loading, date sorting, text rendering, filtering and bulk status updates.
- [x] Add reusable frontend fixtures, Java Excel and visibility tests, and hosted PR checks.
- [x] Update Apache POI, jQuery, DataTables, Buttons and JSZip, and remove standalone Moment assets.
- [x] Apply text rendering and response-driven table setup to Profiles, Billing Clients and Daybook Reports.

### Frontend

- [x] Load the bulk task upload script on the pages with the upload control and bind the click handler locally.
- [x] Prevent repeat bulk task submissions while an upload is pending.
- [x] Give bulk task uploads distinct feedback when the session is unauthorized.
- [x] Align task upload file selection and validation feedback with the XLSX importer.
- [x] Report bulk task upload success only after the import is confirmed and retain the selected file on failure.
- [x] Use one catalog for task status dropdowns and the grid.
- [ ] Restore the standalone View Tasks assignment selector. Confirm what Responsibility should include before connecting it to an endpoint.
- [ ] Complete Audit List and DSC Audit. Confirm their intended workflows and API contracts, then replace the placeholder or missing scripts.
- [x] Share the list request and loading flow for Profiles and Billing Clients.
- [x] Load the DataTables export scripts and column helpers only on the pages that use them.
- [x] Share Billing Client create and edit save handling and cover success and failure with mocked requests.
- [x] Harden password form rendering, validation and request feedback with mocked coverage.
- [x] Share Profile create and edit save handling and cover permission failures with reusable AJAX mocks.
- [x] Preserve saved task assignments missing from the current dropdowns.
- [x] Preserve saved task billing clients that are missing from the current picker.
- [x] Refresh the task billing client picker after loading the saved selection.
- [x] Wait for task dropdown requests before loading edit details.
- [x] Validate task detail responses and report failed loads without enabling edits.
- [x] Load Profile edit details after the dropdown options arrive and report load failures.
- [x] Load Billing Client edit details immediately and report failed requests.
- [x] Block Task, Profile and Billing Client edits until their record IDs are available.
- [x] Share Task create and edit save handling and cover failed requests with reusable AJAX mocks.
- [x] Render task form dropdown labels through DOM text properties and preserve option values.
- [x] Review the active task, profile, billing, upload, and sign-in request flows and scope the scripts changed in this phase.
- [x] Remove the hidden Billing Client upload stub that routed spreadsheets to the task importer.
- [x] Remove the unused Excel format stub and duplicate date formatters left by task import code.
- [x] Remove the unused audit upload handlers and their shared file extension helper.
- [ ] Continue the broader vendored asset inventory before removing additional files.

### Security and verification

- [x] Enforce administrator authorization for account password resets and profile writes involving administrator roles.
- [x] Require an active authenticated account for bulk task imports.
- [x] Save one task, status and assignment per import row and preserve sparse spreadsheet columns.
- [x] Reject empty and unreadable task workbooks and require Sheet1 before writing records.
- [x] Return consistent sign-in failures and reuse session validation for logout.
- [x] Require active Admin or Manager authorization for task deletion and use DELETE.
- [x] Add synthetic regression coverage for the implemented refactors and security fixes.
- [x] Reject malformed, expired, and incomplete signed sessions through the shared token validator.
- [x] Record the active browser script inventory and known dependency support gaps.
- [x] Report the resolved Maven dependency tree in CI.
- [ ] Scan the resolved tree and prioritize confirmed findings. CI produced the dependency tree. The external OSV workflow was blocked because it would send resolved package coordinates to a public API, and the current credentials could not read Dependabot alerts.
- [ ] Continue auditing authentication and authorization beyond the flows covered in this phase.
- [ ] Review Java, Spring Boot, and JJWT upgrade options. Use isolated tests for compatibility changes that can be verified locally.
### Deferred

- [ ] Confirm whether day 59 should include all timestamps before changing the existing cutoff.
- [ ] Resume bulk Billing Client import when client requirements are available.

- [ ] Run live browser and native MySQL smoke tests.
- [ ] Verify deployed Tomcat and JDBC versions and apply any runtime patches.
- [x] Verify CI publishes a WAR after a development merge. [First successful WAR run](https://github.com/wikijames/vscca/actions/runs/45556679459).
- [ ] Verify the generated WAR on the deployment server.
