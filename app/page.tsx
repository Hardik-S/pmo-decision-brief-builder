import { buildDecisionBrief, fixtureNotes, formatBriefMarkdown } from "../lib/brief";

export default function Home() {
  const brief = buildDecisionBrief(fixtureNotes);
  const markdown = formatBriefMarkdown(brief);

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
          <p>recommendation score for the strongest option</p>
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
              </div>
              <code>{option.score}/100</code>
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

      <section className="panel export">
        <div>
          <h2>Decision Brief Preview</h2>
          <p>
            The preview keeps recommendation, alternatives, risks, and open questions together so
            a sponsor can approve direction instead of reading another loose update.
          </p>
        </div>
        <pre>{markdown}</pre>
      </section>
    </main>
  );
}
