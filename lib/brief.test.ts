import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildDecisionBrief, fixtureNotes, formatBriefMarkdown } from "./brief";

describe("PMO decision brief builder", () => {
  it("recommends the strongest option from fixture notes", () => {
    const brief = buildDecisionBrief(fixtureNotes);

    expect(brief.recommendedOption.id).toBe("thin-pilot");
    expect(brief.options).toHaveLength(3);
    expect(brief.riskMatrix.some((risk) => risk.label === "Production data exposure")).toBe(true);
  });

  it("formats a decision-support brief with options and risks", () => {
    const markdown = formatBriefMarkdown(buildDecisionBrief());

    expect(markdown).toContain("PMO Decision Brief");
    expect(markdown).toContain("Ship a thin intake pilot");
    expect(markdown).toContain("Risk Matrix");
    expect(markdown).toContain("Open Questions");
  });

  it("keeps a traceable signal summary and approval gates for sponsor review", () => {
    const brief = buildDecisionBrief(fixtureNotes);

    expect(brief.signalSummary).toEqual({
      benefit: 1,
      constraint: 1,
      dependency: 1,
      risk: 1
    });
    expect(brief.recommendedOption.evidenceNoteIds).toEqual([
      "note-001",
      "note-002",
      "note-003",
      "note-004"
    ]);
    expect(brief.recommendedOption.scoringFactors).toContainEqual({
      label: "Near-term delivery",
      points: 28,
      noteIds: ["note-001", "note-004"]
    });
    expect(brief.approvalGates).toContainEqual({
      label: "Production data handling",
      status: "blocked",
      owner: "Security reviewer",
      evidenceNoteIds: ["note-003"],
      nextStep: "Approve redacted-copy handling before any live-record intake."
    });
  });

  it("formats source notes, assumptions, and approval gates into the Markdown artifact", () => {
    const markdown = formatBriefMarkdown(buildDecisionBrief());

    expect(markdown).toContain("## Source Notes");
    expect(markdown).toContain("- note-003 [risk] Security review:");
    expect(markdown).toContain("## Approval Gates");
    expect(markdown).toContain("- blocked - Production data handling");
    expect(markdown).toContain("## Assumptions");
  });

  it("keeps the committed example brief in sync with generated output", () => {
    const expected = formatBriefMarkdown(buildDecisionBrief()).trim();
    const artifact = readFileSync(join(process.cwd(), "docs", "decision-brief.example.md"), "utf8").trim();

    expect(artifact).toBe(expected);
  });
});
