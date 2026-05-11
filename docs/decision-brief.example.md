# PMO Decision Brief

## Decision Question
How should the PMO create near-term intake visibility without overcommitting to an unapproved platform migration?

## Recommendation
Ship a thin intake pilot because it produces steering-ready evidence quickly while respecting budget and data-handling constraints surfaced across 4 fixture notes.

## Source Notes
- note-001 [constraint] Sponsor standup: The pilot needs a visible result inside three weeks, but finance wants no paid system migration before the next steering meeting.
- note-002 [benefit] Operations interview: Team leads mainly need one consistent intake board because current requests arrive through email, sheets, and chat screenshots.
- note-003 [risk] Security review: Uploading real client records into a new tool is not approved; the first release must use synthetic fixtures or redacted copies.
- note-004 [dependency] Delivery retro: The analytics team can support a lightweight dashboard now, while workflow automation needs an additional data owner and approval policy.

## Signal Summary
- Constraint notes: 1
- Benefit notes: 1
- Risk notes: 1
- Dependency notes: 1

## Options
- Ship a thin intake pilot (86/100): Stand up a fixture-first dashboard that standardizes requests without moving production records. Owner: PMO analyst plus operations lead. Evidence: note-001, note-002, note-003, note-004. Scoring: Near-term delivery +28 from note-001, note-004; Budget restraint +22 from note-001; Data-handling safety +20 from note-003; Operating pain addressed +16 from note-002
- Start full workflow automation (54/100): Begin a production workflow build with routing, ownership, and escalation rules. Owner: Automation lead. Evidence: note-002, note-003, note-004. Scoring: Operating pain addressed +24 from note-002; Approval readiness +12 from note-003, note-004; Timeline fit +18 from note-001
- Wait for platform migration (41/100): Defer PMO tooling until finance approves a broader platform move. Owner: Steering committee. Evidence: note-001, note-002. Scoring: Budget restraint +20 from note-001; Learning velocity +8 from note-002; Sponsor momentum +13 from note-001

## Risk Matrix
- Production data exposure: medium likelihood, high impact. Use synthetic fixtures and redacted copies until security approves live records.
- Pilot mistaken for final automation: medium likelihood, medium impact. Label the first release as decision support and keep manual approval steps explicit.
- Budget decision arrives late: high likelihood, medium impact. Design the pilot output as portable evidence for the next steering meeting.

## Approval Gates
- blocked - Production data handling: Security reviewer. Approve redacted-copy handling before any live-record intake. Evidence: note-003
- needs-owner - Pilot success metric: Executive sponsor. Choose the steering metric that proves the pilot is worth expanding. Evidence: note-001, note-002
- ready - Fixture-only pilot scope: PMO analyst. Use the synthetic intake board to prepare the steering decision. Evidence: note-001, note-004

## Assumptions
- The first public slice uses synthetic PMO notes only.
- Decision support is the product goal; this is not generic status reporting.
- Human sponsors still approve scope, budget, and production data handling.

## Open Questions
- Which steering metric proves the pilot is worth expanding?
- Who owns the production data approval path after the fixture pilot?
- Which intake sources are mandatory for the second slice?
