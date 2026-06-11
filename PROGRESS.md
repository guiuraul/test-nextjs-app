# RiskAtlas Progress

Last updated: 2026-06-11

## Goal

Build a private insurance portfolio management system where each user:

- creates an account with an enforced minimum age of 18
- imports CSV data for policies, incidents, and claims
- creates portfolios from filter criteria
- explores each portfolio in a dashboard with totals, trends, and distributions

## What Is Already Done

- A Next.js 16 app is in place with the App Router structure.
- Supabase authentication is wired for:
  - sign up
  - sign in
  - sign out
  - current-user detection on server-rendered pages
- The sign-up flow already validates the birth date and blocks users younger than 18.
- Public landing, sign-in, sign-up, and protected dashboard pages already exist.
- The UI foundation uses Tailwind CSS and shadcn-style primitives.
- The app already has a branded visual direction and a protected dashboard shell.
- The first CSV import foundation has been added:
  - a machine-readable insurance group 39 lookup set
  - a CSV parser for the sample insurance claims file
  - a mapper that derives `_c39`
  - a Drizzle schema for imports, portfolios, and claim records
  - an initial import service that parses and inserts CSV rows
- The first database migration has been generated.
- The initial CSV upload page and portfolio setup page are in place.
- The import page now includes:
  - strict header validation for the reviewer CSV format
  - clear validation errors with details
  - a downloadable CSV template for non-technical users
- Row-level security policies have been prepared for the main user-owned tables.
- The portfolio setup page now uses real dropdown/search controls and shows saved portfolios.
- The dashboard now reads saved portfolios and shows the first analytics cards/charts for the selected portfolio.

## What Is Not Done Yet

- No database schema has been created yet for:
  - users
  - uploads
  - policies
  - incidents
  - claims
  - portfolios
  - portfolio rules / filters
- No row-level security policies have been applied yet in the live database.
- No upload storage flow exists yet for persisting source CSVs.
- No deeper analytics beyond the first totals/charts layer has been built yet.
- No per-user data isolation layer beyond Supabase auth is implemented yet in the live database.

## CSV Format Confirmed

The first supported import format will be the provided `insurance_claims.csv` sample.

- The import should accept the source columns as provided in the sample file.
- `_c39` is present in the header but empty in the source data.
- During import, `_c39` should be derived as a boolean-style flag:
  - `Y` if the vehicle belongs to insurance group 39
  - `N` if it does not
- The group-39 determination will be based on the vehicle `auto_make` and `auto_model`.
- The authoritative reference for the group-39 lookup is:
  - [Page 1](https://www.carinsurancegroups.co.uk/insurance-groups/group-39/)
  - [Page 2](https://www.carinsurancegroups.co.uk/insurance-groups/group-39/page-2/)
  - [Page 3](https://www.carinsurancegroups.co.uk/insurance-groups/group-39/page-3/)
  - [Page 4](https://www.carinsurancegroups.co.uk/insurance-groups/group-39/page-4/)

## Recommended Next Steps

1. Define the data model.
   - Decide the canonical tables and fields for policies, incidents, claims, portfolios, and imports.
   - Confirm which fields are required versus optional.
   - Define how each portfolio is expressed as saved filter criteria.

2. Set up the persistence layer.
   - Add Drizzle ORM.
   - Add the database connection and schema files.
   - Prepare migrations for Supabase Postgres.
   - Add row-level security policies in Supabase.

3. Design the CSV ingestion flow.
   - Decide whether upload happens directly in the UI or via a staged import flow.
   - Define CSV headers and validation rules.
   - Map imported rows to the schema, including the derived `_c39` field.
   - Add file upload UI and storage integration.

4. Build portfolio setup.
   - Create a page for naming portfolios and choosing criteria.
   - Support dropdown/search inputs for state, brand, incident year, gender, and amount threshold.
   - Save the portfolio definition per user.

5. Build the dashboard.
   - Add portfolio selection.
   - Render totals, trends, and distributions.
   - Use chart types appropriate for the selected filters.
   - Wire the selector to URL state and compute filtered analytics.

6. Tighten authorization and isolation.
   - Ensure every query is scoped to the signed-in user.
   - Prevent cross-user visibility in both reads and mutations.

7. Add QA and deployment checks.
   - Validate the flow locally.
   - Confirm Vercel/Supabase environment variables and production readiness.

## Open Questions

- Should imports be synchronous for small files and asynchronous for larger ones?
- Do portfolios store only the filter definition, or also cached aggregates?
- Which fields are mandatory in the first version of the dashboard?
- Should the first dashboard focus on claims, policies, or both together?

## Working Log

- 2026-06-11: Inspected the current repo state and documented the baseline.
- 2026-06-11: Created branch `feature/portfolio-platform-foundation`.
- 2026-06-11: Added this progress tracker to keep the work organized.
- 2026-06-11: Confirmed the first CSV import format and noted the derived `_c39` rule.
- 2026-06-11: Captured the four insurance group 39 reference pages for make/model mapping.
- 2026-06-11: Implemented the first CSV parsing/mapping layer, Drizzle schema, and import service.
- 2026-06-11: Generated the first Drizzle migration and added the CSV import and portfolio setup screens.
- 2026-06-11: Added strict CSV header validation, friendly import errors, and a downloadable template.
- 2026-06-11: Added row-level security SQL, authenticated user-context helpers, and saved portfolio listing.
- 2026-06-11: Added dashboard portfolio selection and the first filtered analytics cards/charts.
