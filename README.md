# VSCCA - Ease OFFICE

VSCCA is an internal office workflow application. Teams use it to assign and track tasks, record progress and due dates, maintain staff profiles and billing client records, and view daybook reports.

## What you can do

- Create, assign, and update tasks. The dashboard shows tasks based on the signed-in user's role. Bulk task import accepts an XLSX workbook containing a sheet named `Sheet1`.
- Manage staff profiles, access roles, and passwords. The application uses Admin, Manager, Supervisor, and TeamMember roles.
- Create and edit individual billing client records. Bulk Billing Client import is paused pending requirements.
- View daybook reports and export supported tables to Excel. The standalone View Tasks assignment selector, Audit List, and DSC Audit have open workflow questions.

## Project layout

The application is a Maven WAR built with Java 8 and Spring Boot 2.5.2. It uses Spring MVC and Spring Data JPA on the server, Thymeleaf pages with jQuery and DataTables in the browser, and MySQL for application data.

| Path | Contents |
| --- | --- |
| [`in/pom.xml`](in/pom.xml) | Maven build and Java dependencies |
| [`in/src/main/java/`](in/src/main/java/) | Controllers, services, repositories, and models |
| [`in/src/main/resources/templates/`](in/src/main/resources/templates/) | Thymeleaf pages and shared fragments |
| [`in/src/main/resources/static/logics/`](in/src/main/resources/static/logics/) | Page scripts and shared frontend code |
| [`in/src/test/java/`](in/src/test/java/) | Java regression and database tests |
| [`in/src/test/frontend/`](in/src/test/frontend/) | Node regression tests and reusable mocks |
| [`.github/workflows/verify.yml`](.github/workflows/verify.yml) | PR checks and post-merge WAR build |

## Run locally

Use a JDK compatible with the Java 8 project baseline. Use Node.js 22 or newer for the frontend tests. Maven is available through the wrapper in `in/`.

Set these environment variables in the shell or IDE that launches the application.

| Variable | Value |
| --- | --- |
| `VSCCA_DB_URL` | JDBC URL for a local MySQL development database |
| `VSCCA_DB_USERNAME` | Development database username |
| `VSCCA_DB_PASSWORD` | Development database password |
| `VSCCA_JWT_SIGNING_KEY` | Base64-encoded signing key generated from at least 32 random bytes |

Use a development database with the required schema and a test account. Hibernate is configured to update the schema on startup, so point local runs at a disposable database. Keep credentials, signing keys, and client data out of commits and test fixtures.

From the repository root on Windows PowerShell:

```powershell
cd in
.\mvnw.cmd spring-boot:run
```

On macOS or Linux, run `bash ./mvnw spring-boot:run` from `in/`. With the default local port, open `http://localhost:8080/vscca/`.

## Run the checks

From the repository root:

```text
node --test in/src/test/frontend/*.test.mjs
```

From `in/` on Windows:

```powershell
.\mvnw.cmd -DexcludedGroups=database test
```

On macOS or Linux, run `bash ./mvnw -DexcludedGroups=database test` from `in/`. Run tests tagged `database` separately against a configured test database.

## Contribution standards

- Branch from `development` and open a focused PR back to it. Use descriptive branch and commit names. Preserve legacy branches and their history.
- Keep controller, service, repository, and browser responsibilities distinct. Reuse shared logic and preserve existing API and data contracts unless the PR intentionally changes them.
- Enforce permissions on the server. Render API-provided text with DOM text properties and keep credentials in environment configuration.
- Cover changed behavior with synthetic fixtures. Reuse [frontend mocks](in/src/test/frontend/support/) for AJAX, DOM, and plugin boundaries. Use JUnit 5 and Mockito for Java unit tests and MockMvc for controller contracts.
- List the tests run and any blocked checks in the PR. Keep dependency updates separate from feature refactors. Record the advisory, affected version, applicability, and compatibility checks when updating packages.

See [AGENTS.md](AGENTS.md) for repository standards and the [quality plan](docs/frontend-quality-plan.md) for completed work and open items.

## Build and deploy

PRs targeting `development` run frontend and Java checks. After a merge, GitHub Actions builds `vscca-development-<commit>.war` from the merged commit and retains it under the run's **Artifacts** section for 14 days. Deploy manually using the server's expected WAR name and runtime configuration.

For a local build, run `.\mvnw.cmd -DexcludedGroups=database clean package` on Windows or `bash ./mvnw -DexcludedGroups=database clean package` on macOS or Linux from `in/`. The generated WAR is in `in/target/`. Before deploying it for the first time, check the target Tomcat and Java compatibility and set the database and signing key variables in the server process. See the [deployment notes](docs/frontend-quality-plan.md#war-builds-from-development).
