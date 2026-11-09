import { useEffect, useState } from 'react'
import { Footer, Header } from './SiteChrome.tsx'
import { ISSUES_URL, REPO_URL } from './links.ts'

interface Msg { role: string; content: string }
interface Check { line: string; stated: number; recomputed: number; ok: boolean }
interface Rec {
  id: string; category: string; grade: string; prose: boolean; verification_score: number
  gates: Record<string, string>; fingerprint: string; messages: Msg[]
  recheck: Check[] | null; flags: string[]
}
interface Data {
  meta: {
    package: string; generated: string; source_rows: number; cre_rows: number; royal_jelly_rows: number
    source_sha256: string; origin: string; selection: string
    buckets: [string, number][]; categories: [string, number][]
  }
  records: Rec[]
}

const n = new Intl.NumberFormat('en-US')
const usd = (v: number) => (v < 0 ? '-' : '') + '$' + n.format(Math.abs(v))
const title = (r: Rec) => {
  const u = r.messages[1].content
  const name = u.match(/analysis for ([^,]+),/)?.[1] ?? u.match(/^([^,]+?) is a/)?.[1] ?? r.id
  const where = u.match(/ in ([^.\n]+?)\./)?.[1] ?? ''
  const sf = u.match(/([\d,]+) SF/)?.[1]
  return { name, sub: `${sf ? sf + ' SF · ' : ''}${where}` }
}

function Cook({ d }: { d: Data['meta'] }) {
  const max = d.source_rows
  return (
    <div className="cook">
      <div className="cook__src">
        <span>Source export</span>
        <b>{n.format(d.source_rows)}</b>
        <small>rows · sha256 {d.source_sha256.slice(0, 12)}…</small>
      </div>
      <ul className="cook__buckets" aria-label="Where the source rows ended up">
        {d.buckets.map(([k, v]) => (
          <li key={k}>
            <span className="cook__k">{k}</span>
            <span className="cook__bar"><i style={{ width: `${Math.max(0.6, (v / max) * 100)}%` }} /></span>
            <span className="cook__v">{n.format(v)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Chat({ r }: { r: Rec }) {
  const [sys, user, asst] = r.messages
  return (
    <div className="qa">
      <details className="qa__sys">
        <summary>System prompt</summary>
        <p>{sys.content}</p>
      </details>
      <div className="bubble bubble--q">
        <span className="bubble__who">Question</span>
        <p>{user.content}</p>
      </div>
      <div className="bubble bubble--a">
        <span className="bubble__who">Answer</span>
        <pre>{asst.content}</pre>
      </div>
    </div>
  )
}

function Recheck({ r }: { r: Rec }) {
  if (!r.recheck && !r.flags.length) return null
  return (
    <div className="recheck">
      <h4>Re-check <span>recomputed here from the rent roll in the question</span></h4>
      {r.recheck && (
        <table>
          <thead><tr><th>Line</th><th>Stated</th><th>Recomputed</th><th><span className="sr">Result</span></th></tr></thead>
          <tbody>
            {r.recheck.map((c) => (
              <tr key={c.line}>
                <td>{c.line}</td><td>{usd(c.stated)}</td><td>{usd(c.recomputed)}</td>
                <td className={c.ok ? 'ok' : 'bad'}>{c.ok ? '✓ matches' : '✕ differs'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {r.flags.length > 0 && (
        <ul className="flags">
          {r.flags.map((f) => <li key={f}>⚠ {f}</li>)}
        </ul>
      )}
      {r.flags.length > 0 && (
        <p className="recheck__note">
          Revenue lines reproduce, but the answer reports a negative property value. The record still carries a
          verification score of {r.verification_score}. That gap is the kind of thing this project wants to expose.
        </p>
      )}
    </div>
  )
}

export default function DatasetsPage() {
  const [data, setData] = useState<Data | null>(null)
  const [err, setErr] = useState(false)
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState<'qa' | 'json'>('qa')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/data/cre-samples.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setErr(true))
  }, [])

  const rec = data?.records[sel]
  const json = rec ? JSON.stringify(rec, null, 2) : ''
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div id="top" className="cr">
      <a className="skip" href="#main">Skip to content</a>
      <Header page="datasets" />
      <main id="main">
        <section className="cr-hero" aria-labelledby="ds-h">
          <div className="wrap">
            <p className="eyebrow">Datasets · Q&amp;A · JSON · Re-checked</p>
            <h1 id="ds-h">Open records. Open JSON. Check the math.</h1>
            <p className="lede">
              A small published sample from our commercial real estate question-and-answer dataset, shown the way
              we think datasets should be shown: the question, the answer, the raw record, and an independent
              re-check.
            </p>
            <p className="sim-flag" role="note">
              <strong>Read this first.</strong> These records are model-generated training data, not extracted from
              real transactions. Property and tenant names are synthetic. The sample is a curated slice, not the
              whole corpus.
            </p>
          </div>
        </section>

        {err && <section className="section"><div className="wrap"><p>Couldn’t load the sample data. Try reloading.</p></div></section>}
        {!data && !err && <section className="section"><div className="wrap"><p>Loading samples…</p></div></section>}

        {data && rec && (
          <>
            <section className="cr-room" aria-labelledby="cook-h">
              <div className="wrap">
                <p className="kicker">The cook</p>
                <h2 id="cook-h">{n.format(data.meta.source_rows)} rows in. {n.format(data.meta.cre_rows - data.meta.buckets[1][1] - data.meta.buckets[3][1])} kept as CRE training rows.</h2>
                <p className="section__intro">
                  Every row passes through gates before it’s kept. Rows that fail, duplicate another row, or aren’t
                  CRE are split out instead of silently mixed in. Counts below are from the dataset card.
                </p>
                <Cook d={data.meta} />
                <ul className="cats" aria-label="Largest CRE categories">
                  {data.meta.categories.map(([k, v]) => (
                    <li key={k}><span>{k}</span><b>{n.format(v)}</b></li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="section" aria-labelledby="browse-h">
              <div className="wrap">
                <p className="kicker">The samples</p>
                <h2 id="browse-h">Open a record.</h2>
                <p className="section__intro">
                  {data.records.length} cold-storage records from the eval split. Real company names excluded. Switch
                  between the Q&amp;A view and the raw JSON, or download the whole sample.
                </p>

                <div className="browser">
                  <ul className="list" aria-label="Sample records">
                    {data.records.map((r, i) => {
                      const t = title(r)
                      return (
                        <li key={r.id}>
                          <button type="button" aria-current={i === sel} onClick={() => setSel(i)}>
                            <span className="list__name">{t.name}</span>
                            <span className="list__sub">{t.sub}</span>
                            <span className="list__meta">
                              <i>{r.prose ? 'rent roll Q&A' : 'underwriting'}</i>
                              <i>score {r.verification_score}</i>
                              {r.flags.length > 0 && <i className="warn">flagged</i>}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="detail">
                    <div className="detail__bar">
                      <div role="tablist" aria-label="View">
                        {(['qa', 'json'] as const).map((t) => (
                          <button
                            key={t}
                            role="tab"
                            type="button"
                            aria-selected={tab === t}
                            onClick={() => setTab(t)}
                          >
                            {t === 'qa' ? 'Q&A' : 'JSON'}
                          </button>
                        ))}
                      </div>
                      <div className="detail__actions">
                        <button type="button" onClick={copy} className="link-btn">{copied ? 'Copied' : 'Copy record'}</button>
                        <a className="link-btn" href="/data/cre-samples.json" download>Download sample</a>
                      </div>
                    </div>

                    <ul className="gates" aria-label="Quality gates for this record">
                      <li><b>grade</b> {rec.grade}</li>
                      <li><b>score</b> {rec.verification_score}</li>
                      {Object.entries(rec.gates).map(([k, v]) => <li key={k}><b>{k}</b> {v}</li>)}
                    </ul>

                    <div role="tabpanel">
                      {tab === 'qa' ? <Chat r={rec} /> : <pre className="json" tabIndex={0}>{json}</pre>}
                    </div>
                    <Recheck r={rec} />
                  </div>
                </div>
              </div>
            </section>

            <section className="cr-honest" aria-labelledby="prov-h">
              <div className="wrap cr-honest__grid">
                <div>
                  <p className="kicker">Provenance</p>
                  <h2 id="prov-h">What this is, and isn’t.</h2>
                </div>
                <ul className="facts">
                  <li>{data.meta.origin}</li>
                  <li>{data.meta.selection}</li>
                  <li>The re-check recomputes revenue, vacancy loss and effective gross income from the rent roll in each question, and flags negative values. It doesn’t validate every line of every answer.</li>
                  <li>No license has been chosen for these samples yet. Treat them as view-only until one is published in the repository.</li>
                </ul>
              </div>
            </section>
          </>
        )}

        <section className="final" aria-labelledby="ds-final-h">
          <div className="wrap final__inner">
            <h2 id="ds-final-h">Found a bad record? Good. Tell us.</h2>
            <p className="section__intro">Corrections, better checks, and real cold-chain examples all make the data worth more.</p>
            <div className="cta-row">
              <a className="btn btn--primary" href={REPO_URL} rel="noopener">Explore the project</a>
              <a className="btn btn--ghost" href={ISSUES_URL} rel="noopener">Report an issue</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
