# PMO Decision Brief Builder Handoff

## Reviewer Route

1. Open the app and read the first decision card. It should name the recommended option, top risk, and approval boundary before the detailed panels.
2. Inspect `Fixture Notes` and confirm each source note has an ID and signal.
3. Inspect `Recommendation` and verify the scoring factors point back to note IDs.
4. Inspect `Approval Gates` and confirm live-record handling is blocked until a named human owner approves it.
5. Inspect `Decision Brief Preview` and compare it with `docs/decision-brief.example.md`.

## File Map

- `app/page.tsx`: renders the decision trace, notes, recommendation, approval gates, risk matrix, and Markdown preview.
- `app/styles.css`: responsive layout and reviewer-focused visual hierarchy.
- `lib/brief.ts`: typed fixture notes, scoring factors, approval gates, brief generation, and Markdown formatter.
- `lib/brief.test.ts`: regression tests for recommendation, traceability, Markdown completeness, and committed artifact drift.
- `docs/fixture-provenance.md`: source-note rationale and synthetic-data boundary.
- `docs/decision-brief.example.md`: committed sponsor artifact generated from the fixture.
- `.github/workflows/verify.yml`: GitHub Actions gate for install, tests, typecheck, and build.

## Current Limitations

- The fixture is deterministic and synthetic. It does not ingest real PMO notes.
- Scoring factors are explicit fixture judgment, not a generalized NLP scorer.
- There is no persistence, auth, upload, email sending, or live workflow automation.
- Browser screenshot evidence should be refreshed after every meaningful UI change.

## Next Improvements

- Add scenario switching for another PMO decision type.
- Add a client-side copy action for the Markdown brief.
- Add screenshot or Playwright smoke checks once the product needs richer interaction coverage.
