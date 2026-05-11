import { buildDecisionBrief, fixtureNotes, formatBriefMarkdown } from "../lib/brief";

export default function Home() {
  const brief = buildDecisionBrief(fixtureNotes);
  const markdown = formatBriefMarkdown(brief);
  const topRisk = brief.riskMatrix.find((risk) => risk.impact === "high") ?? brief.riskMatrix[0];

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">PMO decision support</p>
          <h1>PMO Decision Brief Builder</h1>
          <p className="lede">
            Turn messy project notes into options, risk tradeoffs, and a steering-ready
            decision brief without pretending the work is generic status reporting.
          </p>
        </div>
        <div className="scorecard" aria-label="Decision summary">
          <span>{brief.recommendedOption.score}</span>
          <strong>{brief.recommendedOption.title}</strong>
          <p>{topRisk.label} remains the top approval risk.</p>
          <a href="#brief-preview">View sponsor brief</a>
        </div>
      </section>

      <section className="decisionStrip" aria-label="Decision trace">
        <div>
          <span>Decision question</span>
          <p>{brief.decisionQuestion}</p>
        </div>
        <div>
          <span>Signal mix</span>
          <p>
            {brief.signalSummary.constraint} constraint, {brief.signalSummary.benefit} benefit,{" "}
            {brief.signalSummary.risk} risk, {brief.signalSummary.dependency} dependency
          </p>
        </div>
        <div>
          <span>Approval boundary</span>
          <p>Fixture-only pilot; live records stay blocked until security review.</p>
        </div>
      </section>

      <section className="grid">
        <article className="panel">
          <div className="panelHeader">
            <h2>Fixture Notes</h2>
            <span>synthetic intake</span>
          </div>
          <div className="notes">
            {fixtureNotes.map((note) => (
              <div className="note" key={note.id}>
                <div>
                  <strong>{note.source}</strong>
                  <p>{note.text}</p>
                </div>
                <code>{note.signal}</code>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <h2>Recommendation</h2>
            <span>decision support</span>
          </div>
          <div className="recommendation">
            <h3>{brief.recommendedOption.title}</h3>
            <p>{brief.executiveSummary}</p>
            <div className="factorList" aria-label="Scoring factors">
              {brief.recommendedOption.scoringFactors.map((factor) => (
                <div className="factor" key={factor.label}>
                  <strong>+{factor.points}</strong>
                  <span>{factor.label}</span>
                  <code>{factor.noteIds.join(", ")}</code>
                </div>
              ))}
            </div>
            <ul>
              {brief.recommendedOption.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h2>Options Compared</h2>
          <span>not a status report</span>
        </div>
        <div className="options">
          {brief.options.map((option) => (
            <div className="option" key={option.id}>
              <div>
                <strong>{option.title}</strong>
                <p>{option.summary}</p>
                <small>Evidence: {option.evidenceNoteIds.join(", ")}</small>
              </div>
              <code>{option.score}/100</code>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h2>Approval Gates</h2>
          <span>human-owned decisions</span>
        </div>
        <div className="gateGrid">
          {brief.approvalGates.map((gate) => (
            <div className={`gate ${gate.status}`} key={gate.label}>
              <div>
                <strong>{gate.label}</strong>
                <code>{gate.status}</code>
              </div>
              <p>{gate.nextStep}</p>
              <small>
                Owner: {gate.owner} - Evidence: {gate.evidenceNoteIds.join(", ")}
              </small>
            </div>
          ))}
        </div>
      </section>

      <section className="panel matrix">
        <div className="panelHeader">
          <h2>Risk Matrix</h2>
          <span>approval guidance</span>
        </div>
        <div className="riskGrid">
          {brief.riskMatrix.map((risk) => (
            <div className="risk" key={risk.label}>
              <strong>{risk.label}</strong>
              <p>{risk.mitigation}</p>
              <div>
                <code>{risk.likelihood} likelihood</code>
                <code>{risk.impact} impact</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel export" id="brief-preview">
        <div>
          <h2>Decision Brief Preview</h2>
          <p>
            The preview keeps recommendation, alternatives, risks, and open questions together so
            a sponsor can approve direction instead of reading another loose update.
          </p>
          <p className="artifactNote">The same Markdown is committed in docs/decision-brief.example.md for drift checks.</p>
        </div>
        <pre>{markdown}</pre>
      </section>
    </main>
  );
}
