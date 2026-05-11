# PMO Decision Brief Builder

PMO Decision Brief Builder is a fixture-first portfolio product that converts messy project notes into options, a risk matrix, and an executive decision brief. The first slice is deterministic on purpose: it demonstrates decision-support product judgment without using private meeting notes or pretending to replace sponsor approval.

## Portfolio Signal

This project shows how raw PMO context can become a crisp decision artifact. It emphasizes tradeoffs, assumptions, open questions, and human approval boundaries instead of another broad reporting dashboard.

## Stack Rationale

- Next.js App Router keeps the surface easy to deploy on Vercel and leaves room for future server-side brief exports.
- TypeScript makes the option, risk, and brief contracts explicit for reviewers.
- Vitest covers the deterministic brief builder because the ranking and packet structure are the key behavior.
- Fixture-first data keeps the repository public while avoiding real project notes, budgets, client names, or internal business logic.

## Local Setup

```powershell
npm install
npm run test
npm run build
npm run dev
```

## Decisions

- The first slice uses synthetic notes only. There is no upload, persistence, email sending, or connection to private PMO records.
- Options are scored with explicit fixture values so reviewers can inspect the recommendation path.
- The UI separates source notes, recommendation, options, risks, and generated brief preview to keep the workflow decision-oriented.
- The product language avoids generic reporting claims; the artifact is meant to help a sponsor choose a direction.

## PMO Workflow Assumptions

- Sponsors need a near-term decision artifact before committing budget to a larger platform migration.
- A thin fixture pilot can be valuable if it documents constraints, rejected options, risks, and open questions.
- Human owners still approve scope, budget, data handling, and production workflow automation.

## Verification

- `npm run test` validates the recommended option and Markdown brief structure.
- `npm run build` validates the production Next.js bundle.

## Deployment

Expected production URL: https://pmo-decision-brief-builder.vercel.app

