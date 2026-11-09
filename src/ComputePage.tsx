import { useEffect, useMemo, useState } from 'react'
import { Footer, Header } from './SiteChrome.tsx'
import { ISSUES_URL, REPO_URL } from './links.ts'

const RACKS = 4
const PER_RACK = 8
const TOTAL = RACKS * PER_RACK

const STAGES = [
  ['Intake', 'Leases, utility bills, equipment records'],
  ['Extract', 'Pull the fields and assumptions out'],
  ['Check', 'Flag gaps and inconsistent math'],
  ['Review', 'A person confirms what holds up'],
  ['Publish', 'Versioned, documented dataset'],
] as const

type Verdict = 'pass' | 'gap' | 'reject'
const SAMPLES: { text: string; verdict: Verdict; note: string }[] = [
  { text: 'Utility bill → average load 10 kW, rate $0.12/kWh', verdict: 'pass', note: 'inputs present, math reproduces' },
  { text: 'Pro forma → “refrigeration included in NNN charges”', verdict: 'gap', note: 'no equipment age or service record' },
  { text: 'Listing sheet → “state-of-the-art cold storage”', verdict: 'reject', note: 'claim with no evidence attached' },
  { text: 'Equipment log → compressor service dated, interval stated', verdict: 'pass', note: 'dated, sourced' },
  { text: 'Rent roll → utilization 95%, no seasonal data', verdict: 'gap', note: 'single-point assumption' },
  { text: 'Power bill → demand charge line present, kW unstated', verdict: 'gap', note: 'cannot reconstruct demand' },
  { text: 'Floor plan → usable pallet positions, dims listed', verdict: 'pass', note: 'dimensions consistent' },
  { text: 'Brochure → “energy efficient”', verdict: 'reject', note: 'unquantified' },
]
const VERDICT_LABEL: Record<Verdict, string> = { pass: 'Checks out', gap: 'Gap found', reject: 'Rejected' }

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const initialLoads = () => Array.from({ length: TOTAL }, (_, i) => 30 + ((i * 37) % 60))

export default function ComputePage() {
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const [running, setRunning] = useState(!reduce)
  const [loads, setLoads] = useState(initialLoads)
  const [queue, setQueue] = useState<number[]>([5, 4, 3, 2, 1])
  const [feed, setFeed] = useState<number[]>([0, 1, 2, 3])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setTick((t) => t + 1)
      setLoads((prev) => prev.map((v) => clamp(v + (Math.random() - 0.5) * 36, 12, 100)))
      setQueue((q) => q.map((v) => clamp(v + Math.round((Math.random() - 0.5) * 3), 1, 9)))
      setFeed((f) => [(f[0] + 1) % SAMPLES.length, ...f.slice(0, 3)])
    }, 1400)
    return () => window.clearInterval(id)
  }, [running])

  const avg = Math.round(loads.reduce((a, b) => a + b, 0) / TOTAL)

  return (
    <div id="top" className="cr">
      <a className="skip" href="#main">Skip to content</a>
      <Header page="compute" />
      <main id="main">
        <section className="cr-hero" aria-labelledby="cr-h">
          <div className="wrap">
            <p className="eyebrow">Compute room · Dataset line · Schematic</p>
            <h1 id="cr-h">Where the evidence gets cooked.</h1>
            <p className="lede">
              The direction: GPUs on hardware we control, turning messy cold-chain documents into datasets
              and evaluations people can inspect. Below is a schematic of that pipeline in motion.
            </p>
            <p className="sim-flag" role="note">
              <strong>Illustrative simulation.</strong> Random motion, example rows. Not live telemetry, not
              our hardware inventory, not measured performance.
            </p>
          </div>
        </section>

        <section className="cr-room" aria-labelledby="room-h">
          <div className="wrap">
            <div className="cr-bar">
              <div>
                <p className="kicker">The compute room</p>
                <h2 id="room-h">{TOTAL} GPUs. Zero marketing.</h2>
              </div>
              <div className="cr-controls">
                <div className="cr-stat" aria-live="off">
                  <span>Simulated avg load</span>
                  <b>{avg}%</b>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost"
                  aria-pressed={!running}
                  onClick={() => setRunning((r) => !r)}
                >
                  {running ? 'Pause simulation' : 'Run simulation'}
                </button>
              </div>
            </div>

            <div className="racks" role="img" aria-label={`Schematic of ${RACKS} racks with ${PER_RACK} GPUs each, animated with random simulated load. Average simulated load ${avg} percent.`}>
              {Array.from({ length: RACKS }, (_, r) => (
                <div className="rack" key={r}>
                  <div className="rack__head">
                    <span>RACK {String(r + 1).padStart(2, '0')}</span>
                    <i className="rack__led" data-on={running} />
                  </div>
                  <div className="rack__gpus">
                    {loads.slice(r * PER_RACK, (r + 1) * PER_RACK).map((v, i) => {
                      const heat = v > 80 ? 'hot' : v > 55 ? 'warm' : 'cool'
                      return (
                        <div className="gpu" data-heat={heat} key={i} style={{ ['--load' as string]: `${v}%` }}>
                          <span className="gpu__id">{String(r * PER_RACK + i + 1).padStart(2, '0')}</span>
                          <span className="gpu__bar"><span /></span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <ul className="legend" aria-hidden="true">
              <li data-heat="cool">idle</li>
              <li data-heat="warm">working</li>
              <li data-heat="hot">cooking</li>
            </ul>
          </div>
        </section>

        <section className="cr-line" aria-labelledby="line-h">
          <div className="wrap">
            <p className="kicker">The dataset line</p>
            <h2 id="line-h">Documents in. Checked records out.</h2>
            <p className="section__intro">
              Each record keeps its source and its verdict. A missing assumption is a result, not a failure to hide.
            </p>

            <ol className="pipe" aria-label="Dataset pipeline stages">
              {STAGES.map(([name, desc], i) => (
                <li key={name}>
                  <span className="pipe__n">{i + 1}</span>
                  <h3>{name}</h3>
                  <p>{desc}</p>
                  <span className="pipe__q" aria-hidden="true">
                    {Array.from({ length: queue[i] }, (_, k) => <i key={k} />)}
                  </span>
                </li>
              ))}
            </ol>

            <div className="stream" aria-label="Example records passing through the pipeline (illustrative)">
              <div className="stream__head">
                <span>records.jsonl</span>
                <span>example rows · tick {tick}</span>
              </div>
              <ul>
                {feed.map((idx, row) => {
                  const s = SAMPLES[idx]
                  return (
                    <li key={`${tick}-${row}`} className="rec" data-verdict={s.verdict} data-new={row === 0 && running}>
                      <span className="rec__text">{s.text}</span>
                      <span className="rec__note">{s.note}</span>
                      <span className="rec__chip">{VERDICT_LABEL[s.verdict]}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </section>

        <section className="cr-honest" aria-labelledby="honest-h">
          <div className="wrap cr-honest__grid">
            <div>
              <p className="kicker">Where this stands</p>
              <h2 id="honest-h">Direction, not a deployed datacenter.</h2>
            </div>
            <ul className="facts">
              <li>The GPU motion on this page is a schematic. A small, real, re-checked sample of the dataset output is on the <a href="/datasets/">Datasets page</a>.</li>
              <li>The motion above is simulated. The rows are made-up examples of what a check looks like.</li>
              <li>We’ll publish real datasets, methods and evaluation results in the open repository as they hold up.</li>
            </ul>
          </div>
        </section>

        <section className="final" aria-labelledby="cr-final-h">
          <div className="wrap final__inner">
            <h2 id="cr-final-h">Got documents, datasets, or compute know-how?</h2>
            <p className="section__intro">
              Real cold-chain records, field knowledge and engineering help make the line worth running.
            </p>
            <div className="cta-row">
              <a className="btn btn--primary" href={REPO_URL} rel="noopener">Explore the project</a>
              <a className="btn btn--ghost" href={ISSUES_URL} rel="noopener">Bring a real problem</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
