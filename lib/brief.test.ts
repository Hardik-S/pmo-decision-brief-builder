import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildDecisionBrief, fixtureNotes, formatBriefMarkdown } from "./brief";

function normalizeMarkdown(text: string) {
  return text.replace(/\r\n/g, "\n").trim();
}

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

  it("rejects source-note sets that cannot support option and gate evidence", () => {
    const incompleteNotes = fixtureNotes.filter((note) => note.id !== "note-003");

    expect(() => buildDecisionBrief(incompleteNotes)).toThrow(
      "Decision brief traceability is incomplete: missing source notes note-003"
    );
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
    const expected = normalizeMarkdown(formatBriefMarkdown(buildDecisionBrief()));
    const artifact = normalizeMarkdown(
      readFileSync(join(process.cwd(), "docs", "decision-brief.example.md"), "utf8")
    );

    expect(artifact).toBe(expected);
  });

  it("keeps reviewer-facing source text free of mojibake", () => {
    const pageSource = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf8");

    expect(pageSource).not.toMatch(/[\u00b7\u00c2\ufffd]/u);
  });
});
