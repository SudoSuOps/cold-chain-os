import { Footer, Header } from './SiteChrome.tsx'
import { EcosystemDiagram, EdgeDiagram } from './NewEraDiagrams.tsx'
import { Tag } from './Tag.tsx'
import { ISSUES_URL, REPO_URL } from './links.ts'
import sourcesData from '../docs/new-era-sources.json'
import cases from '../eval/new-era/cases.json'

const byId = (id: string) => sourcesData.sources.find((s) => s.id === id)!
function Cite({ id }: { id: string }) {
  const s = byId(id)
  return <a className="cite" href={`#src-${id}`} aria-label={`Source: ${s.publisher}`}>[{s.publisher.split(' (')[0]}]</a>
}
type Status = 'verified' | 'prototype' | 'planned'
const STATUS: Record<Status, [string, string]> = {
  verified: ['Implemented and verified', 'tag--public'],
  prototype: ['Prototype', 'tag--founder'],
  planned: ['Planned', 'tag--planned'],
}
const St = ({ s }: { s: Status }) => <span className={`tag ${STATUS[s][1]}`}>{STATUS[s][0]}</span>

const APPS: [string, string, string][] = [
  ['Extract equipment details from documents', 'What evidence supports the output?', 'A model can misread a nameplate or invent a field. Every extracted value should point to the passage it came from.'],
  ['Compare conflicting records', 'What happens when data is missing or stale?', 'A comparison is only as good as the records and their dates. Missing evidence should be reported as missing.'],
  ['Explain calculation inputs', 'Can a person check each input against its source?', 'Arithmetic should be deterministic and reproducible; a model can explain it but should not be the calculator.'],
  ['Summarize maintenance history', 'What evidence supports the output?', 'A summary is not a service record. Gaps and conflicts should stay visible.'],
  ['Support inventory planning and exception review', 'Who can approve an action?', 'Output should inform an accountable person. It should not trigger a consequential action by itself.'],
  ['Assist warehouse automation and inspection, where actually deployed', 'What happens during network or power loss? Can people operate safely without the software? Who maintains it and restores its configuration?', 'Continuity, safe manual operation and ownership of maintenance must be settled before reliance.'],
]
const SIX = ['What evidence supports the output?', 'What happens when data is missing or stale?', 'Who can approve an action?', 'What happens during network or power loss?', 'Can people operate safely when software is unavailable?', 'Who maintains the system and restores its configuration?']
const KINDS: [string, string][] = [
  ['Conventional automation', 'Fixed logic and control. Not a language model.'],
  ['Optimization', 'Math that schedules or routes within stated rules.'],
  ['Machine vision', 'Models that read images, such as inspection or pallet detection.'],
  ['Generative AI', 'Models that produce text or code. Useful for drafting; needs evidence checks.'],
]
const OPS: [string, string][] = [
  ['Unknown devices and undocumented remote connections', 'Start with an asset inventory, including cellular modems added by operators, vendors or integrators.'],
  ['Internet-exposed industrial controllers', 'Verify exposure through the owner’s authorized review. Do not assume it either way.'],
  ['Shared or default credentials', 'Replace defaults; avoid shared accounts.'],
  ['Excessive access permissions', 'Least privilege, with project separation.'],
  ['Vendor remote access', 'Monitored and approved, not standing and invisible.'],
  ['Unpatched systems and maintenance constraints', 'Changes need approved procedures that account for reliability and safety. Do not patch or scan live industrial equipment blindly.'],
  ['Ransomware affecting business systems', 'Know which business functions stop, and whether refrigeration continues.'],
  ['Unverified or unrestorable backups', 'Run restoration exercises and record the result.'],
  ['Software supply-chain compromise', 'Know what runs on an appliance and where it came from.'],
  ['False, missing or delayed telemetry', 'A sensor reading is not automatically a verified product-temperature record.'],
  ['Physical theft or compromise of the edge appliance', 'Treat the appliance as a sensitive asset: storage, keys, access.'],
]
const AIRISK: [string, string][] = [
  ['Instructions hidden in retrieved documents', 'Treat document contents as untrusted data, not instructions.'],
  ['Confidential information appearing in outputs', 'Control who can see outputs; keep projects separate.'],
  ['Untrusted tools and excessive agent permissions', 'Give models no more reach than the task needs.'],
  ['Poisoned datasets', 'Know the provenance and rights of every training and evaluation source.'],
  ['Unsupported conclusions', 'Require source links for every claim.'],
  ['Overconfidence under missing evidence', 'Reward appropriate abstention.'],
]
const EXAMPLES: { id: string; documents: string; scope: string; why: string; not: string; q: string }[] = [
  { id: 'cisa-plc-update-jul22', documents: 'A government update warning that Iranian-affiliated actors targeted programmable logic controllers, adding detection guidance for malicious changes in Rockwell PLC code modules and widening the manufacturer scope.', scope: 'Multiple critical-infrastructure sectors, including water and wastewater, energy and government facilities. July 22, 2026.', why: 'Cold-storage plants also rely on PLCs and HMIs. The mitigations (control network access, validate project files, tell service providers) are transferable questions.', not: 'It does not describe a cold-chain incident, give incident counts or name victims.', q: 'Who can reach our PLCs, and when did someone last validate the project files?' },
  { id: 'cisa-wws-plc-jul30', documents: 'A government alert on a significant increase in actors targeting exposed PLCs in the water sector, locking out operators by changing passwords and IP addresses, with boil-water notices and manual operations.', scope: 'U.S. water and wastewater systems. July 30, 2026.', why: 'It shows how a loss of control access forces manual operation, and flags undocumented cellular modems.', not: 'It is a water-sector lesson, not a cold-chain attack, and it gives no counts or attribution.', q: 'If we lost remote access to a controller tomorrow, could people operate safely by hand, and do we have a known clean backup?' },
  { id: 'tgw-lineage-hutchins', documents: 'A vendor announcement of an automation package (shuttle warehouse, conveyors, palletizing) for a refrigerated and frozen distribution center in Texas.', scope: 'One facility under construction; go-live anticipated at the end of 2027. June 9, 2026.', why: 'It shows automation moving into temperature-controlled buildings, which adds equipment, power and software dependencies.', not: 'It is not operational, gives no throughput or energy figures, and does not describe the control software.', q: 'What does each automated stage depend on, and how does the site run when one fails?' },
  { id: 'iea-key-questions-ai', documents: 'An agency report projecting that global data-centre electricity demand roughly doubles by 2030.', scope: 'Global projection to 2030. Verified through press summaries only.', why: 'Compute draws power, and grid capacity is a shared constraint that can matter to any large load, including a cold-storage site.', not: 'It does not show that data centers raise any particular local rate, and it says nothing about one utility’s tariff.', q: 'What do our actual bills and tariff show, and what does a new load do to demand charges?' },
  { id: 'nist-800-82r3', documents: 'NIST’s final guide to operational technology security (Rev. 3, September 2023), with a Rev. 4 initial public draft open for comment through Nov 30, 2026.', scope: 'General OT guidance. Final is Rev. 3; Rev. 4 is a draft.', why: 'It is a neutral reference for OT security that addresses performance, reliability and safety requirements.', not: 'It is not a compliance determination for any site, and the draft is not final.', q: 'Which of these practices has a qualified person confirmed for our environment?' },
]

export default function NewEraPage() {
  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header page="new-era" />
      <main id="main">
        {/* HERO */}
        <section className="cr-hero" aria-labelledby="ne-h">
          <div className="wrap">
            <p className="eyebrow">New era</p>
            <h1 id="ne-h">The cold chain is becoming a connected machine.</h1>
            <p className="lede thesis">
              Robotics moves the product. Software coordinates the work. Compute processes the evidence. Electricity
              supports the system.
            </p>
            <p className="lede">Understanding the connections means examining the dependencies.</p>
            <p className="status-tag">
              coldchainOS is investigating how physical operations, digital systems, energy and confidential records
              intersect. It is not a deployed cybersecurity platform, an autonomous refrigeration controller, a certified
              engineering service or an incident-response provider.
            </p>
          </div>
        </section>

        {/* ECOSYSTEM */}
        <section className="section" id="ecosystem" aria-labelledby="eco-h">
          <div className="wrap">
            <p className="kicker">The connected ecosystem</p>
            <h2 id="eco-h">Five layers. Information is not control.</h2>
            <div className="ne-split">
              <figure className="ne-fig"><EcosystemDiagram /><figcaption className="art-cap">Solid line: equipment-control authority. Dashed line: information flow. Illustrative, simplified.</figcaption></figure>
              <ul className="ne-layers">
                <li><b>Physical.</b> Products, refrigeration, buildings, docks, vehicles and power.</li>
                <li><b>Automation.</b> Automated storage and retrieval, conveyors, pallet handling, mobile robots and other equipment actually relevant to the operation.</li>
                <li><b>Coordination.</b> Warehouse management and execution, transport management, enterprise systems, scheduling and vendor support.</li>
                <li><b>Evidence.</b> Service records, utility bills, equipment inventories, contracts, authorized sensor records and operating logs.</li>
                <li><b>Intelligence.</b> Document extraction, retrieval, deterministic calculation, model-assisted review and human interpretation.</li>
              </ul>
            </div>
            <ul className="cards cards--3">
              <li className="card"><h3>Software down is not refrigeration down</h3><p>A refrigeration system may continue operating during an enterprise-software outage while receiving, picking or dispatch stops.</p></li>
              <li className="card"><h3>Comms down is not cooling failed</h3><p>A communications outage is not automatically a refrigeration failure. Check the controller and the temperature records.</p></li>
              <li className="card"><h3>A reading is not a record</h3><p>A sensor reading is not automatically a verified product-temperature record.</p></li>
            </ul>
          </div>
        </section>

        {/* AI + ROBOTICS */}
        <section className="section section--alt" id="ai-robotics" aria-labelledby="ai-h">
          <div className="wrap">
            <p className="kicker">AI and robotics</p>
            <h2 id="ai-h">Every benefit comes with a new question.</h2>
            <p className="section__intro">We promise no productivity, labor savings or elimination of errors. Not every robot uses a language model.</p>
            <ul className="deps" aria-label="Kinds of technology">
              {KINDS.map(([k, d]) => <li key={k} title={d}><b>{k}:</b>&nbsp;{d}</li>)}
            </ul>
            <table className="lm-who" style={{ marginTop: 28 }}>
              <caption className="sr">Potential applications, the question each raises, and why</caption>
              <thead><tr><th scope="col">Potential application</th><th scope="col">The question to ask</th><th scope="col">Why</th></tr></thead>
              <tbody>
                {APPS.map(([a, q, w]) => (
                  <tr key={a}><th scope="row">{a}</th><td data-label="The question to ask">{q}</td><td data-label="Why">{w}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="card" style={{ marginTop: 24 }}>
              <h3>The six questions behind every application</h3>
              <ol className="plain">{SIX.map((s) => <li key={s}>{s}</li>)}</ol>
            </div>
          </div>
        </section>

        {/* COMPUTE */}
        <section className="section" id="compute" aria-labelledby="cp-h">
          <div className="wrap">
            <p className="kicker">Compute is physical infrastructure</p>
            <h2 id="cp-h">Models run on electricity, cooling and people.</h2>
            <ul className="cards cards--3">
              <li className="card"><h3>Cloud training</h3><p>Large, occasional jobs on rented hardware.</p></li>
              <li className="card"><h3>Cloud inference</h3><p>Convenient and elastic. Data leaves the building, so permissions matter.</p></li>
              <li className="card"><h3>Local inference</h3><p>Keeps processing in-house where feasible. Still needs power, cooling, storage, updates, replacement planning and administration.</p></li>
            </ul>
            <div className="two-col">
              <div className="card">
                <h3>Bigger is not automatically better</h3>
                <p>For a bounded task, evaluate accuracy, latency, memory, energy and total operating cost, not model size alone.</p>
              </div>
              <div className="card">
                <h3>Energy economics</h3>
                <p>Use the site’s actual bills and tariffs. We do not attribute every utility increase to AI, and we do not assume spare compute or recovered heat produces net savings. See <a href="/why/#power">the power-bill section</a>.</p>
                <p className="fineprint">The IEA projects data-centre electricity demand to roughly double by 2030 <Cite id="iea-key-questions-ai" />. A projection, not a statement about any one tariff.</p>
              </div>
            </div>
          </div>
        </section>

        {/* EDGE */}
        <section className="section section--alt" id="edge" aria-labelledby="edge-h">
          <div className="wrap">
            <p className="kicker">The edge appliance</p>
            <h2 id="edge-h">An owner-controlled appliance. A design goal, not a product.</h2>
            <figure className="ne-fig ne-fig--wide"><EdgeDiagram /><figcaption className="art-cap">Design goal, not implemented. Trust boundaries: OT data arrives by read-only export; nothing flows from the appliance to OT.</figcaption></figure>
            <table className="lm-who">
              <caption className="sr">Intended capabilities and their status</caption>
              <thead><tr><th scope="col">Capability</th><th scope="col">Status</th><th scope="col">What it means today</th></tr></thead>
              <tbody>
                {([
                  ['Store authorized documents', 'planned', 'Not built.'],
                  ['Run suitable local models', 'planned', 'Not built.'],
                  ['Run deterministic calculations offline', 'prototype', 'Browser calculators on this site are tested; they are not an appliance.'],
                  ['Retrieve source passages', 'planned', 'Not built.'],
                  ['Prepare evidence-linked briefs', 'planned', 'Not built.'],
                  ['Continue supported functions without an external model connection', 'planned', 'Not built.'],
                  ['Evaluation schema, 12 draft cases and checks', 'verified', 'Runs in this repository; labels are unreviewed drafts.'],
                ] as [string, Status, string][]).map(([c, s, w]) => (
                  <tr key={c}><th scope="row">{c}</th><td data-label="Status"><St s={s} /></td><td data-label="What it means today">{w}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="two-col">
              <div className="card card--planned">
                <Tag kind="planned" />
                <h3>Architecture goals</h3>
                <ul className="plain">
                  <li>Sit in a managed IT environment.</li>
                  <li>Use approved read-only interfaces or controlled exports for OT data.</li>
                  <li>Do not bridge IT and OT networks by default.</li>
                  <li>Do not directly control refrigeration, PLCs, robots or safety systems.</li>
                  <li>Do not require public inbound access.</li>
                </ul>
              </div>
              <div className="card">
                <h3>Safety stance</h3>
                <p>The appliance must not become a single point of failure for cooling. Safety controls and authorized operating procedures stay independent of language-model availability or output.</p>
                <p className="fineprint">No performance measurements or support promises are published, because none exist.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONFIDENTIALITY */}
        <section className="section" id="confidentiality" aria-labelledby="conf-h">
          <div className="wrap">
            <p className="kicker">Confidentiality and the NDA</p>
            <h2 id="conf-h">Control where the evidence goes.</h2>
            <p className="section__intro">
              Local processing can reduce external transfers. It does not automatically ensure confidentiality,
              cybersecurity, contract compliance or regulatory compliance. We do not claim every cloud upload violates an
              NDA, and we do not claim local deployment makes an agreement irrelevant.
            </p>
            <ul className="deps" aria-label="What to review">
              {['Who may access and process records', 'Whether external processing is permitted', 'Storage, embeddings, logs, temporary files and backups', 'Retention and deletion', 'Vendor telemetry and update traffic', 'Remote support', 'Encryption and key management', 'Access permissions and project separation'].map((d) => <li key={d}>{d}</li>)}
            </ul>
            <p className="fineprint" style={{ marginTop: 20 }}>
              No confidential customer material belongs in a public dataset without authorization and rights. This public
              website accepts no confidential uploads; the <a href="/deal-room/">dev room</a> is a local-only prototype that sends nothing.
            </p>
          </div>
        </section>

        {/* CYBER */}
        <section className="section section--alt" id="security" aria-labelledby="sec-h">
          <div className="wrap">
            <p className="kicker">Cybersecurity: the questions that matter</p>
            <h2 id="sec-h">Ask first. Change carefully.</h2>
            <p className="section__intro">We are not a cybersecurity or incident-response provider. These are review questions for qualified professionals.</p>
            <h3 className="eco-h3">Operational</h3>
            <ul className="cards cards--3">
              {OPS.map(([t, d]) => <li key={t} className="card"><h3>{t}</h3><p>{d}</p></li>)}
            </ul>
            <h3 className="eco-h3">AI-specific</h3>
            <ul className="cards cards--3">
              {AIRISK.map(([t, d]) => <li key={t} className="card"><h3>{t}</h3><p>{d}</p></li>)}
            </ul>
            <ul className="rules">
              <li>Treat document contents as untrusted data, not instructions.</li>
              <li>Keep model outputs separate from executable commands.</li>
              <li>Require explicit authorized review for consequential actions.</li>
              <li>Reference an asset inventory, controlled access, segmentation, monitored remote access, backup restoration exercises and approved maintenance procedures.</li>
              <li>Do not blindly patch or scan live industrial equipment. Changes must account for operating reliability and safety requirements.</li>
            </ul>
          </div>
        </section>

        {/* EVIDENCE */}
        <section className="section" id="evidence" aria-labelledby="ev-h">
          <div className="wrap">
            <p className="kicker">Dated real-world evidence · research snapshot, November 9, 2026</p>
            <h2 id="ev-h">What the record shows, and what it doesn’t.</h2>
            <p className="section__intro">A dated snapshot, not a live feed. Each example shows what it establishes and what it does not.</p>
            <ul className="ev-list">
              {EXAMPLES.map((e) => {
                const s = byId(e.id)
                return (
                  <li key={e.id} className="card ev">
                    <header><Tag kind="public" /><h3>{s.publisher.split(' (')[0]}: {s.published}</h3></header>
                    <dl>
                      <div><dt>What it documents</dt><dd>{e.documents}</dd></div>
                      <div><dt>Sector and scope</dt><dd>{e.scope}</dd></div>
                      <div><dt>Why it matters here</dt><dd>{e.why}</dd></div>
                      <div><dt>What it does not establish</dt><dd>{e.not}</dd></div>
                      <div className="ev__q"><dt>A review question</dt><dd>{e.q}</dd></div>
                    </dl>
                    <p className="fineprint"><Cite id={e.id} /></p>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* DATASETS */}
        <section className="section section--alt" id="datasets" aria-labelledby="ds-h">
          <div className="wrap">
            <p className="kicker">Why we are building datasets</p>
            <h2 id="ds-h">Teach the system to recognize the gap, and prove when it cannot.</h2>
            <ul className="deps" aria-label="Dataset families">
              {['Equipment and document consistency', 'Energy calculations and tariff assumptions', 'Operating dependencies and continuity', 'Confidentiality and access boundaries', 'Security review questions', 'Source reliability and stale evidence', 'Unknowns, contradictions and appropriate abstention'].map((d) => <li key={d}>{d}</li>)}
            </ul>
            <div className="two-col">
              <div className="card">
                <h3>Data rules</h3>
                <ul className="plain">
                  <li>Synthetic examples and appropriately licensed public evidence only.</li>
                  <li>Public availability does not grant redistribution rights.</li>
                  <li>Private client evidence stays separate.</li>
                  <li>A generated label is not verified ground truth. Every case is a draft until reviewed.</li>
                </ul>
              </div>
              <div className="card">
                <h3>What a case contains</h3>
                <p className="fineprint" style={{ margin: 0 }}>case_id · domain · scenario_type · source references and rights · observation date · facts supplied · facts missing · question · expected answer · calculation or rule · acceptable uncertainty · unsupported claims to reject · evidence required · reason to abstain · safe next step · testability · review owner · version. Schema: <code>eval/new-era/schema.json</code>.</p>
              </div>
            </div>

            <h3 className="eco-h3">An evidence-review card</h3>
            <article className="card review" aria-label="Example evidence-review card (synthetic)">
              <p><Tag kind="illustrative" /> <span className="tag tag--hypothesis">Potential issue</span></p>
              <dl>
                <div><dt>Observation</dt><dd>The offering memorandum says “recently upgraded refrigeration.”</dd></div>
                <div><dt>Supporting evidence</dt><dd>A dated invoice for a replacement refrigeration controller.</dd></div>
                <div><dt>Missing information</dt><dd>Anything confirming a compressor replacement; equipment schedule; nameplate data.</dd></div>
                <div><dt>Potential implication</dt><dd>Compressor age and condition may differ from what the memorandum suggests. Not a finding that equipment failed.</dd></div>
                <div><dt>Suggested verification</dt><dd>Request the equipment schedule, nameplate data and service records.</dd></div>
                <div><dt>Responsible professional</dt><dd>A qualified refrigeration engineer.</dd></div>
                <div><dt>Limitations</dt><dd>Synthetic example. Based only on the documents listed. “Potential issue” marks a supported concern; “confirmed finding” would require evidence that establishes it.</dd></div>
              </dl>
            </article>

            <h3 className="eco-h3">Twelve synthetic draft cases</h3>
            <p className="section__intro">All are unreviewed drafts. Ten can be checked mechanically; two need expert review.</p>
            <table className="lm-who cases">
              <caption className="sr">The twelve draft evaluation cases</caption>
              <thead><tr><th scope="col">Case</th><th scope="col">Scenario</th><th scope="col">Checked by</th><th scope="col">Split</th><th scope="col">Label</th></tr></thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.case_id}>
                    <th scope="row">{c.case_id}</th>
                    <td data-label="Scenario">{c.scenario_type.replace(/-/g, ' ')}</td>
                    <td data-label="Checked by">{c.testability === 'mechanical' ? 'Mechanical check' : 'Expert review'}</td>
                    <td data-label="Split">{c.split}</td>
                    <td data-label="Label">Draft, unreviewed</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="two-col">
              <div className="card">
                <h3>Validating the validator</h3>
                <p>Planned measures: arithmetic correctness, source support, missing-information recognition, appropriate abstention, unsupported-claim rate, resistance to document instructions, synthetic confidential-data leakage, and held-out performance.</p>
                <p className="fineprint">No scores are published because none has been measured. An evaluation does not certify operational safety.</p>
              </div>
              <div className="card">
                <h3>Splits that don’t leak</h3>
                <p>Cases are split into train, dev and held-out by source family, so related cases never straddle a split. The repository’s checks fail if they do.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOURCES */}
        <section className="section" id="sources" aria-labelledby="src-h">
          <div className="wrap">
            <p className="kicker">Sources</p>
            <h2 id="src-h">Where every claim comes from.</h2>
            <p className="section__intro">Checked on {sourcesData.checked}. The same list is <code>docs/new-era-sources.json</code>.</p>
            <ul className="sources">
              {sourcesData.sources.map((s) => (
                <li key={s.id} id={`src-${s.id}`} className="card">
                  <p className="sources__claim">{s.claim}</p>
                  <dl>
                    <div><dt>Source</dt><dd>{s.publisher}: <a href={s.url} rel="noopener">{s.title}</a></dd></div>
                    <div><dt>Published</dt><dd>{s.published}</dd></div>
                    <div><dt>Period</dt><dd>{s.event_period}</dd></div>
                    <div><dt>Scope</dt><dd>{s.scope}</dd></div>
                    <div><dt>Kind</dt><dd>{s.kind}</dd></div>
                    <div><dt>Qualification</dt><dd>{s.qualification}</dd></div>
                    <div><dt>Verification</dt><dd className={s.verification.startsWith('SECONDARY') ? 'warn-text' : ''}>{s.verification}</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="final" aria-labelledby="ne-final-h">
          <div className="wrap final__inner">
            <h2 id="ne-final-h">Review the cases. Break the assumptions.</h2>
            <p className="section__intro">Operators, OT engineers, counsel and builders: tell us which cases are wrong, which are missing, and what you would need to trust a tool with your evidence.</p>
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
