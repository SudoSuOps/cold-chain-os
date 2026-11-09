import Calculator from './Calculator.tsx'
import HeroIllustration from './HeroIllustration.tsx'
import { Footer, Header } from './SiteChrome.tsx'
import { ISSUES_URL, REPO_URL } from './links.ts'

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">Open source · Cold chain · Real-world evidence</p>
          <h1 id="hero-h">Does the cold chain pencil?</h1>
          <p className="lede">
            Real estate. Refrigeration. Power. Operating costs.
            <br />
            We’re building open tools to connect the evidence, check the assumptions, and show the math
            behind cold-storage decisions.
          </p>
          <div className="cta-row">
            <a className="btn btn--primary" href={REPO_URL} rel="noopener">Explore the project</a>
            <a className="btn btn--ghost" href={ISSUES_URL} rel="noopener">Bring a real problem</a>
          </div>
          <p className="fineprint">30 years of transaction experience. $8 billion in closed deals. Self-funded. No VC. No token.</p>
        </div>
        <div className="hero__art">
          <HeroIllustration />
        </div>
      </div>
    </section>
  )
}

function Problem() {
  const items = [
    ['01', 'The building', 'Usable space, insulation, layout, loading, and condition.'],
    ['02', 'The machinery', 'Refrigeration capacity, equipment condition, maintenance, and the requirements of the stored product.'],
    ['03', 'The operating math', 'Electricity, demand charges, utilization, downtime, and replacement costs.'],
  ]
  return (
    <section className="section" id="problem" aria-labelledby="problem-h">
      <div className="wrap">
        <p className="kicker">The problem</p>
        <h2 id="problem-h">A cold box is only as strong as its operating assumptions.</h2>
        <p className="section__intro">
          The facts that decide a cold-storage deal rarely live in one place. The lease, the equipment
          records, the utility bills, and the operator’s habits sit in separate documents, each written for
          a different purpose. When they stay disconnected, an optimistic assumption in one can quietly
          override reality in another, and the actual economics stay hidden until it’s expensive to find out.
        </p>
        <ul className="cards cards--3">
          {items.map(([n, t, d]) => (
            <li key={n} className="card">
              <span className="card__n">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Building() {
  const areas = [
    ['Document and evidence intake', 'Bring leases, equipment records, and utility bills into one place so nothing important stays buried.'],
    ['Transparent underwriting calculations', 'Every number traceable to its inputs, so assumptions are visible and the arithmetic can be checked.'],
    ['Domain-specific datasets and evaluations', 'Cold-chain examples and tests that show whether a tool actually handles the real problem.'],
    ['Tools that can run on locally controlled compute', 'Work with sensitive operating data without sending it somewhere you don’t control.'],
  ]
  const steps = ['Collect evidence', 'Identify gaps', 'Check assumptions', 'Review the math']
  return (
    <section className="section section--alt" id="building" aria-labelledby="building-h">
      <div className="wrap">
        <p className="kicker">What we’re building</p>
        <h2 id="building-h">Evidence in. Assumptions visible. Math you can check.</h2>
        <p className="status-tag">Project direction — in development, not a list of released features.</p>
        <ul className="cards cards--2">
          {areas.map(([t, d]) => (
            <li key={t} className="card">
              <span className="chip">In development</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
        <ol className="steps" aria-label="Process">
          {steps.map((s, i) => (
            <li key={s}>
              <span className="steps__n">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Example() {
  return (
    <section className="section" id="example" aria-label="Interactive underwriting example">
      <div className="wrap example">
        <div className="example__copy">
          <p className="kicker">A working example</p>
          <h2>Every decision starts with a number you can check.</h2>
          <p className="section__intro">
            This small calculator shows the spirit of the project: simple inputs, visible formulas, and
            nothing hidden. It’s educational, not a full operating-cost model, refrigeration sizing, or a
            savings guarantee.
          </p>
        </div>
        <Calculator />
      </div>
    </section>
  )
}

function FieldLab() {
  return (
    <section className="section section--alt" id="field-lab" aria-labelledby="lab-h">
      <div className="wrap lab">
        <div>
          <p className="kicker">Field lab</p>
          <h2 id="lab-h">Build it. Measure it. Publish what holds up.</h2>
          <p className="status-tag">
            The portable cooler has been acquired. System integration and performance validation are still ahead.
          </p>
          <p className="section__intro">
            We’re investigating where recovered heat could serve a useful load, and measuring the complete
            energy balance before making performance claims.
          </p>
        </div>
        <div className="card lab__card">
          <h3>Founder-reported hardware</h3>
          <ul className="plain">
            <li>An acquired portable 8 × 20-foot Polar King cooler.</li>
            <li>Fiberglass enclosure with insulated walls and floor on a steel chassis.</li>
            <li>A research concept involving two S21 Pro Bitcoin miners and potential useful applications of their waste heat.</li>
          </ul>
          <p className="fineprint">An experiment, secondary to the cold-chain underwriting work.</p>
        </div>
      </div>
    </section>
  )
}

function Founder() {
  return (
    <section className="section" id="participate" aria-labelledby="founder-h">
      <div className="wrap founder">
        <div>
          <p className="kicker">Founder and open-source ethos</p>
          <h2 id="founder-h">Experience worth paying forward.</h2>
          <p className="section__intro">
            “A healthy cold chain helps protect our children’s future.”
          </p>
        </div>
        <div>
          <ul className="facts">
            <li>30 years in commercial real estate transactions, with $8 billion in closed deals.</li>
            <li>Prior leadership of a national industrial team.</li>
            <li>Self-funded, with an open-source direction.</li>
            <li>Built in collaboration with the community.</li>
          </ul>
          <p>
            If our experience can help you solve a real cold-chain problem, bring it to the table. Share
            what you know. Challenge the assumptions. Help us build something useful.
          </p>
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="final" aria-labelledby="final-h">
      <div className="wrap final__inner">
        <h2 id="final-h">Bring a real problem. Let’s work the pencil.</h2>
        <p className="section__intro">
          Useful problems, field knowledge, datasets, and contributions are all welcome.
        </p>
        <div className="cta-row">
          <a className="btn btn--primary" href={REPO_URL} rel="noopener">View the repository</a>
          <a className="btn btn--ghost" href={ISSUES_URL} rel="noopener">Open an issue</a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header home />
      <main id="main">
        <Hero />
        <Problem />
        <Building />
        <Example />
        <FieldLab />
        <Founder />
        <FinalCta />
      </main>
      <Footer home />
    </div>
  )
}
