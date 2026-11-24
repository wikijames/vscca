# VSCCA development standards

- Start new work from `development` and open small, reviewable pull requests against it.
- Keep legacy branches available, including `main`, `master`, `vscca2.0`, `vscca2.1-improvments-07-2025`, `refactor-task-js`, and `feature/task-visibility-60-days`. Do not delete, force-push, or rewrite their history. Keep merged working branches unless the maintainer explicitly requests their removal.
- Run `node --test in/src/test/frontend/*.test.mjs` from the repository root for frontend changes. Use synthetic fixtures and import shared setup from `in/src/test/frontend/support/`. Mock AJAX, the DOM, and plugins at their boundaries. Use JUnit 5 and Mockito for Java unit tests and Spring MockMvc for controller contracts.
- Run `.\mvnw.cmd -DexcludedGroups=database verify` from `in` on Windows or `bash ./mvnw -DexcludedGroups=database verify` on Unix with a compatible JDK. Use a temporary checkout when packaging locally because the repository tracks a legacy WAR. Run tests tagged `database` separately against a configured test database. Document blocked checks in the PR.
- Review dependency advisories before upgrading packages and regularly thereafter. Cover resolved Maven dependencies, browser assets copied into the repository, CDN scripts, and the deployed WAR container. Record the version, advisory, applicability, proposed upgrade, and affected functions or workflows.
- Keep dependency upgrades separate from feature refactors and include focused regression coverage for changed behavior. See [the frontend quality plan](docs/frontend-quality-plan.md).
