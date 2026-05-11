export type RawNote = {
  id: string;
  source: string;
  text: string;
  signal: "constraint" | "risk" | "benefit" | "dependency";
};

export type DecisionOption = {
  id: string;
  title: string;
  summary: string;
  owner: string;
  benefits: string[];
  risks: string[];
  dependencies: string[];
  score: number;
};

export type RiskMatrixItem = {
  label: string;
  likelihood: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigation: string;
};

export type DecisionBrief = {
  decisionQuestion: string;
  recommendedOption: DecisionOption;
  options: DecisionOption[];
  riskMatrix: RiskMatrixItem[];
  assumptions: string[];
  openQuestions: string[];
  executiveSummary: string;
};

export const fixtureNotes: RawNote[] = [
  {
    id: "note-001",
    source: "Sponsor standup",
    signal: "constraint",
    text: "The pilot needs a visible result inside three weeks, but finance wants no paid system migration before the next steering meeting."
  },
  {
    id: "note-002",
    source: "Operations interview",
    signal: "benefit",
    text: "Team leads mainly need one consistent intake board because current requests arrive through email, sheets, and chat screenshots."
  },
  {
    id: "note-003",
    source: "Security review",
    signal: "risk",
    text: "Uploading real client records into a new tool is not approved; the first release must use synthetic fixtures or redacted copies."
  },
  {
    id: "note-004",
    source: "Delivery retro",
    signal: "dependency",
    text: "The analytics team can support a lightweight dashboard now, while workflow automation needs an additional data owner and approval policy."
  }
];

const options: DecisionOption[] = [
  {
    id: "thin-pilot",
    title: "Ship a thin intake pilot",
    summary: "Stand up a fixture-first dashboard that standardizes requests without moving production records.",
    owner: "PMO analyst plus operations lead",
    benefits: ["Delivers visible progress within three weeks", "Avoids paid migration before steering approval", "Creates evidence for a larger workflow decision"],
    risks: ["Manual handoff remains after the pilot", "Synthetic examples may understate production edge cases"],
    dependencies: ["Synthetic fixture set", "Sponsor-approved success criteria"],
    score: 86
  },
  {
    id: "full-automation",
    title: "Start full workflow automation",
    summary: "Begin a production workflow build with routing, ownership, and escalation rules.",
    owner: "Automation lead",
    benefits: ["Targets the complete operating pain", "Reduces repeated manual triage if approvals land"],
    risks: ["Requires policy decisions that are not ready", "Likely misses the three-week evidence window", "Introduces client-record handling before security approval"],
    dependencies: ["Data owner", "Security approval", "Budget approval"],
    score: 54
  },
  {
    id: "wait-for-migration",
    title: "Wait for platform migration",
    summary: "Defer PMO tooling until finance approves a broader platform move.",
    owner: "Steering committee",
    benefits: ["Avoids throwaway implementation", "Keeps technology choices aligned with budget cycle"],
    risks: ["Leaves current intake fragmentation untouched", "Loses sponsor momentum", "Produces no near-term learning"],
    dependencies: ["Budget decision", "Vendor shortlist"],
    score: 41
  }
];

export function buildDecisionBrief(notes: RawNote[] = fixtureNotes): DecisionBrief {
  const riskMatrix: RiskMatrixItem[] = [
    {
      label: "Production data exposure",
      likelihood: "medium",
      impact: "high",
      mitigation: "Use synthetic fixtures and redacted copies until security approves live records."
    },
    {
      label: "Pilot mistaken for final automation",
      likelihood: "medium",
      impact: "medium",
      mitigation: "Label the first release as decision support and keep manual approval steps explicit."
    },
    {
      label: "Budget decision arrives late",
      likelihood: "high",
      impact: "medium",
      mitigation: "Design the pilot output as portable evidence for the next steering meeting."
    }
  ];

  const recommendedOption = [...options].sort((a, b) => b.score - a.score)[0];

  return {
    decisionQuestion: "How should the PMO create near-term intake visibility without overcommitting to an unapproved platform migration?",
    recommendedOption,
    options,
    riskMatrix,
    assumptions: [
      "The first public slice uses synthetic PMO notes only.",
      "Decision support is the product goal; this is not generic status reporting.",
      "Human sponsors still approve scope, budget, and production data handling."
    ],
    openQuestions: [
      "Which steering metric proves the pilot is worth expanding?",
      "Who owns the production data approval path after the fixture pilot?",
      "Which intake sources are mandatory for the second slice?"
    ],
    executiveSummary: `${recommendedOption.title} because it produces steering-ready evidence quickly while respecting budget and data-handling constraints surfaced across ${notes.length} fixture notes.`
  };
}

export function formatBriefMarkdown(brief: DecisionBrief) {
  const optionLines = brief.options
    .map((option) => `- ${option.title} (${option.score}/100): ${option.summary}`)
    .join("\n");
  const riskLines = brief.riskMatrix
    .map((risk) => `- ${risk.label}: ${risk.likelihood} likelihood, ${risk.impact} impact. ${risk.mitigation}`)
    .join("\n");

  return `# PMO Decision Brief

## Decision Question
${brief.decisionQuestion}

## Recommendation
${brief.executiveSummary}

## Options
${optionLines}

## Risk Matrix
${riskLines}

## Open Questions
${brief.openQuestions.map((question) => `- ${question}`).join("\n")}
`;
}
