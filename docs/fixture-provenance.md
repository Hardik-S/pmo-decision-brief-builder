# Fixture Provenance

This project uses synthetic PMO notes only. The fixture is intentionally small so reviewers can trace every visible recommendation, risk, and approval gate back to source notes without needing private meeting records.

## Source Notes

| Note ID | Source label | Signal | Purpose in demo |
| --- | --- | --- | --- |
| `note-001` | Sponsor standup | constraint | Establishes the three-week evidence window and budget restraint. |
| `note-002` | Operations interview | benefit | Defines the operating pain: fragmented intake across email, sheets, and screenshots. |
| `note-003` | Security review | risk | Blocks live-record intake until data handling is approved. |
| `note-004` | Delivery retro | dependency | Shows why lightweight dashboard evidence is ready before automation policy work. |

## Decision Rules

- The first recommendation stays fixture-only because the risk note blocks live client records.
- Scoring factors are explicit product judgment, not hidden model output.
- Approval gates make the human owner and next step visible before any production workflow is implied.
- The generated Markdown artifact is committed at `docs/decision-brief.example.md` and covered by a drift test.
- Note IDs must stay non-blank and unique because option scores and approval gates cite those IDs as evidence anchors. The builder rejects unusable IDs before checking citation coverage so a future fixture expansion cannot make a sponsor reference ambiguous.

## Boundaries

- No real client, employee, financial, budget, or project records are included.
- No upload, persistence, email sending, or external tool calls exist in this slice.
- The product demonstrates PMO decision-support structure; it does not replace sponsor approval.
