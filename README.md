# PMO Decision Brief Builder

PMO Decision Brief Builder is a fixture-first portfolio product that converts messy project notes into options, a risk matrix, and an executive decision brief. The first slice is deterministic on purpose: it demonstrates decision-support product judgment without using private meeting notes or pretending to replace sponsor approval.

## Portfolio Signal

This project shows how raw PMO context can become a crisp decision artifact. It emphasizes traceable note signals, scoring rationale, approval gates, assumptions, open questions, and human approval boundaries instead of another broad reporting dashboard.

## Reviewer Quick Path

1. Open the first viewport and confirm the decision question, recommendation score, top risk, and fixture-only approval boundary are visible.
2. Review the fixture notes and note IDs.
3. Inspect the recommendation scoring factors and confirm each one cites source note IDs.
4. Review the approval gates before the risk matrix; live-record handling should remain blocked.
5. Compare the on-page Markdown preview with `docs/decision-brief.example.md`.

## Stack Rationale

- Next.js App Router keeps the surface easy to deploy on Vercel and leaves room for future server-side brief exports.
- TypeScript makes the option, risk, and brief contracts explicit for reviewers.
- Vitest covers the deterministic brief builder because the ranking and packet structure are the key behavior.
- Fixture-first data keeps the repository public while avoiding real project notes, budgets, client names, or internal business logic.

## Local Setup

```powershell
npm ci
npm run verify
npm run dev
```

## Decisions

- The first slice uses synthetic notes only. There is no upload, persistence, email sending, or connection to private PMO records.
- Options are scored with explicit fixture values so reviewers can inspect the recommendation path.
- The UI separates source notes, recommendation, scoring factors, approval gates, risks, and generated brief preview to keep the workflow decision-oriented.
- The product language avoids generic reporting claims; the artifact is meant to help a sponsor choose a direction.
- The generated sponsor artifact is committed in `docs/decision-brief.example.md` and protected by a drift test.
- The artifact drift test normalizes CRLF and LF line endings before comparing content so Windows checkouts still verify the sponsor brief rather than failing on checkout policy.
- Reviewer-facing UI copy uses ASCII-safe separators so the static source stays readable across Windows, GitHub, and browser rendering paths.
- The brief builder rejects any source-note set that cannot support every option score and approval-gate evidence ID, preventing future fixture edits from producing an untraceable sponsor artifact.

## PMO Workflow Assumptions

- Sponsors need a near-term decision artifact before committing budget to a larger platform migration.
- A thin fixture pilot can be valuable if it documents constraints, rejected options, risks, and open questions.
- Human owners still approve scope, budget, data handling, and production workflow automation.

## File Map

- `app/page.tsx`: decision-support UI and Markdown preview.
- `app/styles.css`: responsive layout and compact reviewer workflow styling.
- `lib/brief.ts`: fixture notes, scoring factors, approval gates, risk matrix, and Markdown formatter.
- `lib/brief.test.ts`: tests for recommendation logic, source-note evidence coverage, artifact completeness, and example drift.
- `docs/fixture-provenance.md`: synthetic source-note rationale and data boundary.
- `docs/HANDOFF.md`: reviewer route, limitations, and next improvements.
- `.github/workflows/verify.yml`: install, test, typecheck, and build gate.

## Verification

- `npm run test` validates the recommended option, source-note traceability, approval gates, Markdown brief structure, and committed artifact drift.
- `npm run typecheck` validates the TypeScript contract without incremental artifacts.
- `npm run build` validates the production Next.js bundle with webpack.
- `npm run verify` runs the full local gate.

## Deployment

Expected production URL: https://pmo-decision-brief-builder.vercel.app

## Limitations

- The product uses synthetic PMO notes only. It does not ingest real meeting notes, client records, budgets, employee data, or confidential project details.
- Scoring factors are explicit fixture-level PMO judgment rather than generalized note parsing.
- There is no upload, persistence, authentication, email sending, or workflow automation in this slice.
- Sponsor approval, security approval, and budget approval remain human-owned gates.
