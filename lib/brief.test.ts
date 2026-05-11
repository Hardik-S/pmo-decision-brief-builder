import { describe, expect, it } from "vitest";
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
});
