import { useMemo, useRef, useState } from 'react'
import { Footer, Header } from './SiteChrome.tsx'
import { ISSUES_URL, REPO_URL } from './links.ts'

/**
 * Local-only evidence-intake prototype.
 * It reads ONLY file names, sizes and types from the browser's file picker. It never reads file
 * contents, never stores anything, and makes no network requests (see public/_headers: connect-src 'none').
 */

type DocType =
  | 'om' | 'rent_roll' | 'leases' | 'utility' | 'tariff' | 'equipment' | 'service'
  | 'operating' | 'inventory' | 'insurance' | 'engineering' | 'lender' | 'other'

interface Item { type: Exclude<DocType, 'other'>; label: string; need: 'core' | 'if-applicable'; ask: string; match: RegExp }

const CHECKLIST: Item[] = [
  { type: 'om', label: 'Offering memorandum', need: 'core', ask: 'Request the offering memorandum, including any addenda.', match: /\b(om|offering|memorandum|teaser|brochure)\b/i },
  { type: 'rent_roll', label: 'Rent roll', need: 'core', ask: 'Request a current rent roll with lease dates, rents and recoveries.', match: /rent[\s_-]*roll/i },
  { type: 'leases', label: 'Leases and amendments', need: 'core', ask: 'Request full leases and amendments. Confirm who bears electricity, repairs and capital costs.', match: /lease|amendment|estoppel/i },
  { type: 'utility', label: 'Utility bills (12–24 months)', need: 'core', ask: 'Request 12–24 months of electric bills showing kWh, billing demand (kW) and every charge line.', match: /utilit|electric|power|kwh|bill|fpl|duke|dominion|energy/i },
  { type: 'tariff', label: 'Utility tariff and service capacity', need: 'core', ask: 'Identify the serving utility and rate schedule; request service capacity and any upgrade correspondence.', match: /tariff|rate[\s_-]*schedule|service[\s_-]*capacity/i },
  { type: 'equipment', label: 'Equipment schedule and nameplate data', need: 'core', ask: 'Request an equipment schedule with nameplate data, refrigerant type and installation dates.', match: /equipment|nameplate|schedule|compressor|condenser/i },
  { type: 'service', label: 'Refrigeration service records', need: 'core', ask: 'Request refrigeration service and maintenance records, including invoices for major repairs or replacements.', match: /service|maintenance|repair|invoice|work[\s_-]*order/i },
  { type: 'operating', label: 'Operating statements (T-12 and prior years)', need: 'core', ask: 'Request trailing-12 and prior-year operating statements with expense detail.', match: /t[\s_-]?12|operating|p&l|profit|financials?|income/i },
  { type: 'insurance', label: 'Insurance and loss history', need: 'core', ask: 'Request current insurance certificates and loss runs.', match: /insurance|loss[\s_-]*run|coi\b/i },
  { type: 'engineering', label: 'Property condition or engineering report', need: 'core', ask: 'Request any property condition, roof, slab or refrigeration engineering reports.', match: /pca|condition|engineering|inspection|roof|slab/i },
  { type: 'inventory', label: 'Inventory and throughput records', need: 'if-applicable', ask: 'If an operating business is in scope: request pallets in and out, dwell, occupancy and dock records for matching periods.', match: /inventory|throughput|wms|pallet|dwell|dock/i },
  { type: 'lender', label: 'Lender package or term sheet', need: 'if-applicable', ask: 'If financing is involved: request the lender package or term sheet so assumptions can be compared.', match: /lender|term[\s_-]*sheet|loan|debt/i },
]
const TYPE_OPTIONS: [DocType, string][] = [...CHECKLIST.map((c) => [c.type, c.label] as [DocType, string]), ['other', 'Other / not sure']]

interface Entry { key: number; name: string; size: number; mime: string; type: DocType }
const guess = (name: string): DocType => CHECKLIST.find((c) => c.match.test(name))?.type ?? 'other'
const fmt = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`)

export default function DealRoomPage() {
  const [files, setFiles] = useState<Entry[]>([])
  const [copied, setCopied] = useState(false)
  const next = useRef(1)
  const input = useRef<HTMLInputElement>(null)

  const add = (list: FileList | null) => {
    if (!list) return
    const entries = Array.from(list).map((f) => ({ key: next.current++, name: f.name, size: f.size, mime: f.type || 'unknown', type: guess(f.name) }))
    setFiles((p) => [...p, ...entries])
    if (input.current) input.current.value = ''
  }
  const covered = useMemo(() => new Set(files.map((f) => f.type)), [files])
  const missing = CHECKLIST.filter((c) => !covered.has(c.type))
  const gapText = useMemo(() => {
    const core = missing.filter((m) => m.need === 'core')
    const opt = missing.filter((m) => m.need !== 'core')
    const lines = [
      'Open requests (generated locally from file names only; contents were not read)',
      ...core.map((m, i) => `${i + 1}. ${m.label}: ${m.ask}`),
      ...(opt.length ? ['If applicable:', ...opt.map((m) => `- ${m.label}: ${m.ask}`)] : []),
    ]
    return lines.join('\n')
  }, [missing])
  const copy = async () => {
    try { await navigator.clipboard.writeText(gapText); setCopied(true); window.setTimeout(() => setCopied(false), 1500) } catch { /* clipboard unavailable */ }
  }

  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header page="deal-room" />
      <main id="main">
        <section className="cr-hero" aria-labelledby="dr-h">
          <div className="wrap">
            <p className="eyebrow">Dev room · Prototype</p>
            <h1 id="dr-h">Know what’s missing before you ask an AI anything.</h1>
            <p className="lede">
              A local-only evidence checklist for a cold-storage review. Choose the files you have; see which
              documents are covered, which are missing, and get a list of questions to send.
            </p>
            <p className="sim-flag" role="note">
              <strong>Nothing is uploaded.</strong> This page reads only file names, sizes and types in your browser.
              It never reads file contents, stores nothing, and makes no network requests.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="tool-h">
          <div className="wrap">
            <p className="kicker">Evidence checklist</p>
            <h2 id="tool-h">Drop in your files. See the gaps.</h2>

            <div
              className="drop"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files) }}
            >
              <p>Drag files here, or</p>
              <label className="btn btn--primary drop__btn" htmlFor="dr-files">Choose files</label>
              <input id="dr-files" ref={input} className="sr" type="file" multiple onChange={(e) => add(e.target.files)} />
              <p className="fineprint">Only the file name, size and type are read. Contents are never opened.</p>
            </div>

            <div className="dr-grid">
              <div>
                <h3 className="eco-h3" style={{ marginTop: 0 }}>Files ({files.length})</h3>
                {files.length === 0 ? (
                  <p className="fineprint">No files chosen. Try names like “rent roll”, “electric bills” or “service invoices”.</p>
                ) : (
                  <ul className="files">
                    {files.map((f) => (
                      <li key={f.key}>
                        <div className="files__name"><b>{f.name}</b><span>{fmt(f.size)} · {f.mime}</span></div>
                        <label className="sr" htmlFor={`t-${f.key}`}>Document type for {f.name}</label>
                        <select id={`t-${f.key}`} value={f.type} onChange={(e) => setFiles((p) => p.map((x) => (x.key === f.key ? { ...x, type: e.target.value as DocType } : x)))}>
                          {TYPE_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                        <button type="button" className="link-btn" onClick={() => setFiles((p) => p.filter((x) => x.key !== f.key))} aria-label={`Remove ${f.name}`}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
                {files.length > 0 && <button type="button" className="link-btn" style={{ marginTop: 12 }} onClick={() => setFiles([])}>Clear all</button>}
              </div>

              <div>
                <h3 className="eco-h3" style={{ marginTop: 0 }}>Checklist</h3>
                <ul className="check" aria-live="polite">
                  {CHECKLIST.map((c) => {
                    const n = files.filter((f) => f.type === c.type).length
                    return (
                      <li key={c.type} data-state={n ? 'ok' : 'gap'}>
                        <span className="check__mark" aria-hidden="true">{n ? '✓' : '○'}</span>
                        <span>
                          <b>{c.label}</b>
                          <i>{c.need === 'core' ? 'Core' : 'If applicable'}</i>
                        </span>
                        <span className="check__state">{n ? `${n} file${n > 1 ? 's' : ''}` : 'Missing'}</span>
                      </li>
                    )
                  })}
                </ul>
                <p className="fineprint">A file name matching a category does not mean the contents are complete, current or correct.</p>
              </div>
            </div>

            <div className="gaps">
              <div className="gaps__head">
                <h3>Open requests</h3>
                <button type="button" className="link-btn" onClick={copy}>{copied ? 'Copied' : 'Copy list'}</button>
              </div>
              <pre>{gapText}</pre>
            </div>
          </div>
        </section>

        <section className="section section--alt" aria-labelledby="not-h">
          <div className="wrap two-col" style={{ marginTop: 0 }}>
            <div>
              <p className="kicker">Read this</p>
              <h2 id="not-h">This is not a secured deal room.</h2>
              <p className="section__intro">
                A real one would need authenticated storage, per-user access control, audit logging, retention and
                deletion controls, and a hosting decision. None of that exists here. This public site has no
                backend, so there is nowhere to send a confidential file, and we have deliberately not built a fake
                upload form.
              </p>
            </div>
            <div className="card card--planned">
              <h3>What this page does and doesn’t do</h3>
              <ul className="plain">
                <li><strong>Does:</strong> match file names to a checklist and write a list of requests, all in your browser tab.</li>
                <li><strong>Doesn’t:</strong> read contents, run OCR or AI, store files, or send anything anywhere.</li>
                <li><strong>Enforced:</strong> a Content-Security-Policy with <code>connect-src 'none'</code> is set for this page in <code>public/_headers</code>.</li>
                <li><strong>Still your call:</strong> file names can themselves be sensitive. Check your NDA before you use real names.</li>
              </ul>
              <p className="fineprint">Design goals for confidential materials: <a href={`${REPO_URL}/blob/main/docs/nda-data-handling.md`} rel="noopener">docs/nda-data-handling.md</a>.</p>
            </div>
          </div>
        </section>

        <section className="final" aria-labelledby="dr-final-h">
          <div className="wrap final__inner">
            <h2 id="dr-final-h">Want a real deal room? Help us design it.</h2>
            <p className="section__intro">Tell us how your NDAs actually constrain the workflow, and what you’d need to trust a tool with your files.</p>
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
