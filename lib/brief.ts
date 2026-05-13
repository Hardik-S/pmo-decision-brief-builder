export type RawNote = {
  id: string;
  source: string;
  text: string;
  signal: "constraint" | "risk" | "benefit" | "dependency";
};

export type SignalSummary = Record<RawNote["signal"], number>;

export type ScoringFactor = {
  label: string;
  points: number;
  noteIds: string[];
};

export type ApprovalGate = {
  label: string;
  status: "ready" | "needs-owner" | "blocked";
  owner: string;
  evidenceNoteIds: string[];
  nextStep: string;
};

export type DecisionOption = {
  id: string;
  title: string;
  summary: string;
  owner: string;
  benefits: string[];
  risks: string[];
  dependencies: string[];
  evidenceNoteIds: string[];
  scoringFactors: ScoringFactor[];
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
  sourceNotes: RawNote[];
  signalSummary: SignalSummary;
  approvalGates: ApprovalGate[];
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
    evidenceNoteIds: ["note-001", "note-002", "note-003", "note-004"],
    scoringFactors: [
      {
        label: "Near-term delivery",
        points: 28,
        noteIds: ["note-001", "note-004"]
      },
      {
        label: "Budget restraint",
        points: 22,
        noteIds: ["note-001"]
      },
      {
        label: "Data-handling safety",
        points: 20,
        noteIds: ["note-003"]
      },
      {
        label: "Operating pain addressed",
        points: 16,
        noteIds: ["note-002"]
      }
    ],
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
    evidenceNoteIds: ["note-002", "note-003", "note-004"],
    scoringFactors: [
      {
        label: "Operating pain addressed",
        points: 24,
        noteIds: ["note-002"]
      },
      {
        label: "Approval readiness",
        points: 12,
        noteIds: ["note-003", "note-004"]
      },
      {
        label: "Timeline fit",
        points: 18,
        noteIds: ["note-001"]
      }
    ],
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
    evidenceNoteIds: ["note-001", "note-002"],
    scoringFactors: [
      {
        label: "Budget restraint",
        points: 20,
        noteIds: ["note-001"]
      },
      {
        label: "Learning velocity",
        points: 8,
        noteIds: ["note-002"]
      },
      {
        label: "Sponsor momentum",
        points: 13,
        noteIds: ["note-001"]
      }
    ],
    score: 41
  }
];

function summarizeSignals(notes: readonly RawNote[]): SignalSummary {
  return notes.reduce<SignalSummary>(
    (summary, note) => ({
      ...summary,
      [note.signal]: summary[note.signal] + 1
    }),
    { benefit: 0, constraint: 0, dependency: 0, risk: 0 }
  );
}

function cloneOption(option: DecisionOption): DecisionOption {
  return {
    ...option,
    benefits: [...option.benefits],
    risks: [...option.risks],
    dependencies: [...option.dependencies],
    evidenceNoteIds: [...option.evidenceNoteIds],
    scoringFactors: option.scoringFactors.map((factor) => ({
      ...factor,
      noteIds: [...factor.noteIds]
    }))
  };
}

function requireTraceableEvidence(
  sourceNotes: readonly RawNote[],
  decisionOptions: readonly DecisionOption[],
  approvalGates: readonly ApprovalGate[]
) {
  const sourceNoteIds = new Set(sourceNotes.map((note) => note.id));
  const citedNoteIds = new Set<string>();

  decisionOptions.forEach((option) => {
    option.evidenceNoteIds.forEach((noteId) => citedNoteIds.add(noteId));
    option.scoringFactors.forEach((factor) => factor.noteIds.forEach((noteId) => citedNoteIds.add(noteId)));
  });
  approvalGates.forEach((gate) => gate.evidenceNoteIds.forEach((noteId) => citedNoteIds.add(noteId)));

  const missingNoteIds = [...citedNoteIds].filter((noteId) => !sourceNoteIds.has(noteId)).sort();
  if (missingNoteIds.length > 0) {
    throw new Error(`Decision brief traceability is incomplete: missing source notes ${missingNoteIds.join(", ")}`);
  }
}

export function buildDecisionBrief(notes: RawNote[] = fixtureNotes): DecisionBrief {
  const sourceNotes = notes.map((note) => ({ ...note }));
  const signalSummary = summarizeSignals(sourceNotes);
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

  const rankedOptions = options.map(cloneOption).sort((a, b) => b.score - a.score);
  const recommendedOption = rankedOptions[0];
  const approvalGates: ApprovalGate[] = [
    {
      label: "Production data handling",
      status: "blocked",
      owner: "Security reviewer",
      evidenceNoteIds: ["note-003"],
      nextStep: "Approve redacted-copy handling before any live-record intake."
    },
    {
      label: "Pilot success metric",
      status: "needs-owner",
      owner: "Executive sponsor",
      evidenceNoteIds: ["note-001", "note-002"],
      nextStep: "Choose the steering metric that proves the pilot is worth expanding."
    },
    {
      label: "Fixture-only pilot scope",
      status: "ready",
      owner: "PMO analyst",
      evidenceNoteIds: ["note-001", "note-004"],
      nextStep: "Use the synthetic intake board to prepare the steering decision."
    }
  ];

  requireTraceableEvidence(sourceNotes, rankedOptions, approvalGates);

  return {
    decisionQuestion: "How should the PMO create near-term intake visibility without overcommitting to an unapproved platform migration?",
    recommendedOption,
    options: rankedOptions,
    riskMatrix,
    sourceNotes,
    signalSummary,
    approvalGates,
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
    .map((option) => {
      const factorText = option.scoringFactors
        .map((factor) => `${factor.label} +${factor.points} from ${factor.noteIds.join(", ")}`)
        .join("; ");
      return `- ${option.title} (${option.score}/100): ${option.summary} Owner: ${option.owner}. Evidence: ${option.evidenceNoteIds.join(", ")}. Scoring: ${factorText}`;
    })
    .join("\n");
  const riskLines = brief.riskMatrix
    .map((risk) => `- ${risk.label}: ${risk.likelihood} likelihood, ${risk.impact} impact. ${risk.mitigation}`)
    .join("\n");
  const sourceLines = brief.sourceNotes
    .map((note) => `- ${note.id} [${note.signal}] ${note.source}: ${note.text}`)
    .join("\n");
  const approvalLines = brief.approvalGates
    .map((gate) => `- ${gate.status} - ${gate.label}: ${gate.owner}. ${gate.nextStep} Evidence: ${gate.evidenceNoteIds.join(", ")}`)
    .join("\n");

  return `# PMO Decision Brief

## Decision Question
${brief.decisionQuestion}

## Recommendation
${brief.executiveSummary}

## Source Notes
${sourceLines}

## Signal Summary
- Constraint notes: ${brief.signalSummary.constraint}
- Benefit notes: ${brief.signalSummary.benefit}
- Risk notes: ${brief.signalSummary.risk}
- Dependency notes: ${brief.signalSummary.dependency}

## Options
${optionLines}

## Risk Matrix
${riskLines}

## Approval Gates
${approvalLines}

## Assumptions
${brief.assumptions.map((assumption) => `- ${assumption}`).join("\n")}

## Open Questions
${brief.openQuestions.map((question) => `- ${question}`).join("\n")}
`;
}
