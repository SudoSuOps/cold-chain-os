import { Footer, Header } from './SiteChrome.tsx'
import { ExampleA, ExampleB } from './WhyExamples.tsx'
import { ISSUES_URL, REPO_URL } from './links.ts'
import { Tag } from './Tag.tsx'
import sourcesData from '../docs/sources.json'

const CHAIN = [
  'Producer or harvest',
  'Processing and packing',
  'Pre-cooling or freezing, where required',
  'Temperature-controlled storage',
  'Refrigerated transport',
  'Distribution and fulfillment',
  'Retail, food service, healthcare, or the final user',
]
const DEPS = [
  'Electricity and utility capacity',
  'Refrigeration service and equipment',
  'Packaging and handling',
  'Labor and dock scheduling',
  'Inventory systems',
  'Insurance',
  'Property ownership and leasing',
  'Finance',
  'Traceability and applicable regulation',
]
const CONNECT: [string, string][] = [
  ['Property and lease evidence', 'What the building is, who pays for what, and for how long.'],
  ['Power and utility evidence', 'Bills, tariffs, demand and service capacity.'],
  ['Equipment and service evidence', 'Schedules, nameplates, service history.'],
  ['Inventory and throughput evidence', 'Flow, dwell and utilization.'],
]
const POWER_INPUTS = [
  'kWh consumption', 'Peak billing demand', 'Demand charges and possible ratchets', 'Time-of-use periods',
  'Riders and fixed charges', 'Utility service capacity and upgrade requirements', 'Product temperature and incoming product condition',
  'Outdoor climate', 'Door activity and infiltration', 'Insulation and envelope condition', 'Equipment efficiency and maintenance',
  'Defrost cycles', 'Backup power', 'Utilization',
]

type Src = (typeof sourcesData.sources)[number]
const byId = (id: string) => sourcesData.sources.find((s) => s.id === id) as Src

function Cite({ id }: { id: string }) {
  const s = byId(id)
  return <a className="cite" href={`#src-${id}`} aria-label={`Source: ${s.publisher}`}>[{s.publisher.split(',')[0].replace('U.S. ', '')}]</a>
}

export default function WhyPage() {
  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header page="why" />
      <main id="main">
        {/* HERO */}
        <section className="cr-hero" aria-labelledby="w-h">
          <div className="wrap">
            <p className="eyebrow">Why coldchainOS</p>
            <h1 id="w-h">Cold storage is a system. Underwrite the connections.</h1>
            <p className="lede thesis">
              The product has a clock. The building has a power bill. The deal has assumptions. Connect them.
            </p>
            <p className="status-tag">
              An independent, self-funded, open-source project in active development. No venture capital. No token.
              No finished platform, customers, integrations, measured savings or certifications.
            </p>
            <ul className="tagkey" aria-label="How we label statements">
              <li><Tag kind="public" /></li><li><Tag kind="illustrative" /></li><li><Tag kind="founder" /></li><li><Tag kind="planned" /></li>
            </ul>
          </div>
        </section>

        {/* WHY */}
        <section className="section" id="why" aria-labelledby="why-h">
          <div className="wrap">
            <p className="kicker">Why we are building this</p>
            <h2 id="why-h">One facility. Seven jobs. Many documents.</h2>
            <p className="section__intro">
              A cold-storage facility is a building, a refrigeration system, an electrical load, a logistics node, a
              place where valuable, time-sensitive inventory sits, an operating business or a facility supporting one,
              and a capital decision, all at once.
            </p>
            <ul className="cards cards--2">
              {[
                ['An offering memorandum', 'may describe the building.'],
                ['A utility bill', 'describes part of its energy economics, for specific periods.'],
                ['Service records', 'describe equipment history.'],
                ['A lease', 'allocates certain costs and responsibilities.'],
                ['Inventory records', 'describe product movement.'],
                ['A lender', 'evaluates a different package of information.'],
              ].map(([a, b]) => (
                <li key={a} className="card"><h3>{a}</h3><p>{b}</p></li>
              ))}
            </ul>
            <p className="section__intro" style={{ marginTop: 32 }}>
              These records can conflict, omit important details, or describe different periods and operating
              conditions. <strong>The problem:</strong> decisions move forward while critical assumptions remain
              disconnected from their supporting evidence.
            </p>
            <ol className="steps steps--4" aria-label="Our intended contribution">
              {['Make the source visible.', 'Make missing information explicit.', 'Make the calculation reproducible.', 'Keep consequential decisions with accountable people.'].map((s, i) => (
                <li key={s}><span className="steps__n">{i + 1}</span>{s}</li>
              ))}
            </ol>
            <p className="fineprint"><Tag kind="planned" /> We are building tools toward this. They are not a finished platform.</p>
          </div>
        </section>

        {/* ECOSYSTEM */}
        <section className="section section--alt" id="ecosystem" aria-labelledby="eco-h">
          <div className="wrap">
            <p className="kicker">What the cold chain connects</p>
            <h2 id="eco-h">A physical chain, held up by everything around it.</h2>

            <h3 className="eco-h3">The physical chain</h3>
            <ol className="chain" aria-label="Physical cold chain, in order">
              {CHAIN.map((c, i) => (
                <li key={c}><span className="chain__n">{i + 1}</span><span>{c}</span></li>
              ))}
            </ol>

            <h3 className="eco-h3">Cross-cutting dependencies</h3>
            <ul className="deps" aria-label="Dependencies that cut across every stage">
              {DEPS.map((d) => <li key={d}>{d}</li>)}
            </ul>

            <div className="two-col">
              <div className="card">
                <h3>Food and pharmaceutical cold chains</h3>
                <p>
                  Related but distinct. Temperature requirements, validation procedures, regulation and operating
                  practice differ, and are not interchangeable. This site does not treat them as one thing.
                </p>
              </div>
              <div className="card card--planned">
                <Tag kind="planned" />
                <h3>Where we intend to connect evidence</h3>
                <ul className="plain">
                  {CONNECT.map(([t, d]) => <li key={t}><strong>{t}.</strong> {d}</li>)}
                </ul>
                <p className="fineprint">We do not integrate with third-party systems today.</p>
              </div>
            </div>
          </div>
        </section>

        {/* VELOCITY */}
        <section className="section" id="velocity" aria-labelledby="vel-h">
          <div className="wrap">
            <p className="kicker">Market velocity, defined</p>
            <h2 id="vel-h">The product has a clock.</h2>
            <p className="section__intro">“Velocity” means three different things. They are not interchangeable.</p>
            <ul className="cards cards--3">
              <li className="card">
                <h3>Product velocity</h3>
                <p>How quickly inventory moves through a facility.</p>
                <ul className="plain"><li>Pallets received and shipped per day</li><li>Average dwell time</li><li>Inventory turns</li><li>Dock turnaround</li><li>Throughput per available pallet position</li></ul>
              </li>
              <li className="card">
                <h3>Property market velocity</h3>
                <p>How quickly facilities lease or transact.</p>
                <ul className="plain"><li>Days on market</li><li>Leasing absorption</li><li>Sales activity</li><li>Vacancy</li><li>Time from offer to closing</li></ul>
              </li>
              <li className="card">
                <h3>Information velocity</h3>
                <p>How quickly a team can assemble, verify and review decision evidence.</p>
                <ul className="plain"><li>Time to collect required documents</li><li>Time to identify contradictions</li><li>Unresolved questions</li><li>Time to produce a source-linked brief</li></ul>
              </li>
            </ul>
            <ul className="rules">
              <li>High occupancy does not automatically mean high throughput.</li>
              <li>High throughput does not automatically mean high profit.</li>
              <li>Faster review does not mean less diligence.</li>
            </ul>
            <p className="status-tag"><Tag kind="hypothesis" /> Better-organized evidence may reduce avoidable review delays. This is a hypothesis to measure, not a proven result.</p>
          </div>
        </section>

        {/* MARKET VALUE */}
        <section className="section section--alt" id="market" aria-labelledby="mkt-h">
          <div className="wrap">
            <p className="kicker">Market value, without inventing a TAM</p>
            <h2 id="mkt-h">Five different “sizes”. Do not add them together.</h2>
            <ul className="sizes">
              {[
                ['A', 'Value of goods passing through cold chains.'],
                ['B', 'Revenue from temperature-controlled logistics services.'],
                ['C', 'Value of cold-storage real estate.'],
                ['D', 'Spending on equipment, energy, maintenance and software.'],
                ['E', 'The narrower opportunity for our actual tools.'],
              ].map(([k, t]) => (
                <li key={k} data-ours={k === 'E'}><span>{k}</span>{t}</li>
              ))}
            </ul>
            <p className="section__intro">
              These overlap. A–D describe industries; only E describes us, and we have not measured it. The entire food or
              pharmaceutical economy is not our addressable software market, and we publish no market-size number for it.
            </p>
            <div className="two-col">
              <div className="card">
                <Tag kind="public" />
                <h3>One documented figure, with its limits</h3>
                <p>
                  UNEP and FAO’s 2022 report on sustainable food cold chains cites an estimate that <strong>526 million tons</strong> of food
                  production (12% of the global total) was lost <strong>in 2017</strong> due to lack of effective
                  refrigeration. <Cite id="unep-fao-2022" />
                </p>
                <p className="fineprint">A historical, global estimate (UNEP’s Ozone Secretariat attributes it to a 2021 IIR source). Not a 2026 measurement, and not our market.</p>
              </div>
              <div className="card">
                <Tag kind="hypothesis" />
                <h3>If we ever model our own opportunity</h3>
                <p><code className="formula">eligible organizations × plausible annual spend per organization</code></p>
                <p>Every input would be an explicit hypothesis. We have no adoption data, no willingness-to-pay data and no pricing commitment.</p>
              </div>
            </div>
            <h3 className="eco-h3">Practical value we can describe honestly</h3>
            <ul className="facts">
              <li>Earlier identification of missing evidence.</li>
              <li>More consistent review.</li>
              <li>Transparent operating-cost scenarios.</li>
              <li>Clearer separation of property and operating-business economics.</li>
              <li>Better-prepared questions for engineers, operators, lenders and counsel.</li>
            </ul>
            <p className="fineprint">None of these is a measured result.</p>
          </div>
        </section>

        {/* BUILDING */}
        <section className="section" id="building-age" aria-labelledby="ba-h">
          <div className="wrap">
            <p className="kicker">The building</p>
            <h2 id="ba-h">An older cold box has to be made usable again.</h2>
            <p className="section__intro">
              Three dated data points on buildings (two Midwest, one national estimate), from CBRE’s Midwest report (March 2025, market
              characteristics as of Q4 2024). They are not current national vacancy figures.
            </p>
            <ul className="cards cards--3">
              <li className="card">
                <Tag kind="public" />
                <h3>56% built before 1990</h3>
                <p>CBRE estimates Midwest cold-storage space at 39.5 million sq. ft. It says many older facilities become obsolete when the tenant leaves because required renovations are cost prohibitive. <Cite id="cbre-midwest-inventory-age" /></p>
              </li>
              <li className="card">
                <Tag kind="public" />
                <h3>89% build-to-suit</h3>
                <p>Of about 1.5 million sq. ft. delivered in the Midwest since the start of 2023, 11% was speculative and 89% was build-to-suit. <Cite id="cbre-midwest-build-to-suit" /></p>
              </li>
              <li className="card">
                <Tag kind="public" />
                <h3>$240–$350 per sq. ft.</h3>
                <p>CBRE’s national estimate for building new refrigerated warehouse space, and it notes power is increasingly hard to acquire. That is new construction, not renovation cost. <Cite id="cbre-cold-cost-power" /></p>
              </li>
            </ul>
            <p className="section__intro" style={{ marginTop: 32 }}>
              For coldchainOS the takeaway is the cost of making an older facility usable again. Equipment, power and
              renovation evidence belong beside the real estate numbers, and the question becomes:{' '}
              <strong>what does this specific facility need to operate, and does that pencil?</strong>
            </p>
            <div className="two-col">
              <div className="card">
                <Tag kind="public" />
                <h3>Operator scale, for context</h3>
                <p>
                  GCCA’s 2026 Top 25 member operators run 7.76 billion cubic feet, up 6.3% on 2025. Lineage, Americold,
                  NewCold, United States Cold Storage and Emergent Cold Latin America lead. <Cite id="gcca-top25-2026" />
                </p>
                <p className="fineprint">GCCA members only. Not total worldwide capacity and not occupied inventory.</p>
              </div>
              <div className="card">
                <Tag kind="public" />
                <h3>A framework for operating-cost assumptions</h3>
                <p>
                  GCCA’s Cold Chain Index tracks five expense classes: labor, electric power, supplies, repairs and
                  rent. We use that structure to organize assumptions. <Cite id="gcca-cold-chain-index" />
                </p>
                <p className="fineprint">The index’s detailed values are member-only, so we cite none.</p>
              </div>
            </div>
          </div>
        </section>

        {/* EXAMPLES */}
        <section className="section" id="examples" aria-labelledby="ex-h">
          <div className="wrap">
            <p className="kicker">Worked examples</p>
            <h2 id="ex-h">The power bill belongs in the pencil.</h2>
            <p className="section__intro">Three illustrative examples. No real property, tenant or result. Change the inputs and check the math.</p>

            <article className="example-block" aria-labelledby="exa-h">
              <Tag kind="illustrative" />
              <h3 id="exa-h">Example A: an energy assumption changes</h3>
              <p className="section__intro">
                A 100 kW average site load for 8,760 hours a year uses 876,000 kWh. Move the rate from $0.10 to $0.14
                per kWh and the annual energy charge rises by $35,040. At an assumed 7% cap rate, a simplified
                value difference is about $500,571.
              </p>
              <ExampleA />
            </article>

            <article className="example-block" aria-labelledby="exb-h">
              <Tag kind="illustrative" />
              <h3 id="exb-h">Example B: an occupied pallet position tells only part of the story</h3>
              <ExampleB />
            </article>

            <article className="example-block" aria-labelledby="exc-h">
              <Tag kind="illustrative" />
              <h3 id="exc-h">Example C: the OM and the service file disagree</h3>
              <p className="section__intro">A fictional offering memorandum says “recently upgraded refrigeration.” The evidence includes a newer controller invoice but no documentation confirming a compressor replacement.</p>
              <div className="finding" role="group" aria-label="Example finding">
                <div><b>The OM says</b><span>“Recently upgraded refrigeration.”</span></div>
                <div><b>The file shows</b><span>A newer controller invoice.</span></div>
                <div className="finding__out">
                  <b>Output</b>
                  <span>Controller upgrade documented. Compressor replacement unverified. Request equipment schedule, nameplate data, and relevant service records.</span>
                </div>
              </div>
              <p className="fineprint">Missing documentation is not a claim that equipment failed. No real property or dispute is described.</p>
            </article>
          </div>
        </section>

        {/* POWER */}
        <section className="section section--alt" id="power" aria-labelledby="pw-h">
          <div className="wrap">
            <p className="kicker">The energy and operating environment</p>
            <h2 id="pw-h">Energy cost depends on where, when and how.</h2>
            <p className="section__intro">
              Electricity cost depends on location, tariff, time and load. A wholesale power price is not a facility’s
              retail electricity bill, and a national average is not a site-specific quote.
            </p>
            <ul className="deps" aria-label="Inputs that shape a cold-storage energy picture">
              {POWER_INPUTS.map((d) => <li key={d}>{d}</li>)}
            </ul>
            <ul className="facts" style={{ marginTop: 32 }}>
              <li>
                <Tag kind="public" /> EIA estimates U.S. electricity consumption rose 4% in 3Q26 versus 3Q25, with the
                commercial sector (which includes data centers) up 5%, and forecasts commercial demand growing 2.8% in 2027.
                <Cite id="eia-steo-oct26" /> <span className="datestamp">STEO of Oct 6, 2026.</span>
              </li>
              <li>
                <Tag kind="public" /> EIA anticipates 2026 wholesale prices averaging $52/MWh across the 11 hubs it tracks
                (11% above 2025). Wholesale prices are not retail bills. <Cite id="eia-steo-wholesale" />
              </li>
              <li>We do not claim data centers cause every local rate increase. Check your own utility and tariff.</li>
              <li>For a Florida facility, use the actual serving utility, tariff and bills before making any site-specific cost claim.</li>
              <li>Solar, batteries, thermal storage, load shifting and heat recovery are options to evaluate, not automatic savings. Each needs capital cost, useful load, timing, losses and operating constraints on the page.</li>
            </ul>
            <p className="fineprint">A newer EIA outlook was scheduled for Nov 10, 2026; figures here are as of Nov 9, 2026.</p>
          </div>
        </section>

        {/* NDA */}
        <section className="section" id="nda" aria-labelledby="nda-h">
          <div className="wrap">
            <p className="kicker">NDA and data control</p>
            <h2 id="nda-h">The NDA should shape the workflow.</h2>
            <p className="section__intro">
              An NDA is signed. Books, records, leases, customer information and service files arrive. Someone wants an
              AI-generated deal brief. The practical question: <strong>who is authorized to process these records, where
              can they go, and what can be retained?</strong>
            </p>
            <p className="section__intro">
              We do not claim every cloud upload breaches an NDA. Permissions depend on the agreement, the authorization,
              applicable obligations and the service’s processing terms.
            </p>
            <div className="two-col">
              <div className="card card--planned">
                <Tag kind="planned" />
                <h3>Design goals, not implemented</h3>
                <ul className="plain">
                  <li>Owner-controlled storage and local inference where feasible.</li>
                  <li>No external document transfer by default.</li>
                  <li>Explicit approval before any external model or service.</li>
                  <li>Purpose-limited access.</li>
                  <li>Confidential project files kept separate from public datasets.</li>
                  <li>Source-linked findings.</li>
                  <li>Configurable retention and deletion.</li>
                  <li>Human review before a brief is shared.</li>
                </ul>
              </div>
              <div className="card">
                <h3>What local processing does not solve</h3>
                <p>It does not by itself guarantee confidentiality or compliance. Account for logs, temporary files, embeddings, backups, OCR, dependencies, telemetry and remote access.</p>
                <p><strong>Open-source code does not make client documents public.</strong> No private documents, derived text or identifiable client information belongs in a public dataset without appropriate authorization.</p>
                <p className="fineprint">This public site accepts no uploads. See the <a href="/deal-room/">dev room</a> for a local-only prototype that sends nothing anywhere.</p>
              </div>
            </div>
          </div>
        </section>

        {/* RULES */}
        <section className="section section--alt" id="rules" aria-labelledby="rg-h">
          <div className="wrap">
            <p className="kicker">Refrigerants and traceability</p>
            <h2 id="rg-h">Equipment choices and documentation can affect future capital needs.</h2>
            <ul className="facts">
              <li>
                <Tag kind="public" /> EPA’s Technology Transitions tables restrict <em>installation of new systems</em> that
                use certain high-GWP HFCs, with dates that vary by sector. EPA states that components used to repair
                existing systems are not subject to those restrictions. <Cite id="epa-tt-sector" /> EPA issued a final rule
                reconsidering parts of these requirements in May 2026. <Cite id="epa-tt-actions" />
              </li>
              <li>
                <Tag kind="public" /> FDA’s food traceability rule had a compliance date of Jan 20, 2026. FDA proposed
                extending it to July 20, 2028, and Congress directed FDA not to enforce it before that date. <Cite id="fda-fsma-204" />
              </li>
              <li>No blanket claim that older equipment must be replaced now, and coldchainOS does not certify regulatory compliance. Confirm applicable requirements with qualified engineers and counsel.</li>
            </ul>
          </div>
        </section>

        {/* WHY NOW */}
        <section className="section" id="why-now" aria-labelledby="wn-h">
          <div className="wrap">
            <p className="kicker">Why now · as of November 9, 2026</p>
            <h2 id="wn-h">What the record shows today.</h2>
            <ul className="timeline">
              <li>
                <time>Nov 9, 2026</time>
                <div><Tag kind="public" /> EIA’s latest published outlook is the Oct 6, 2026 STEO. It estimates 3Q26 consumption up 4% year over year and forecasts commercial demand up 2.8% in 2027. <Cite id="eia-steo-oct26" /></div>
              </li>
              <li>
                <time>Aug 27, 2026</time>
                <div><Tag kind="public" /> Newmark reported U.S. cold-storage vacancy of 7.7% in the first half of 2026, alongside the sector’s first negative first-half net absorption since 2007. A national figure; it does not describe any single property or market. <Cite id="newmark-1h26" /></div>
              </li>
              <li>
                <time>Apr 29, 2026</time>
                <div><Tag kind="public" /> GCCA’s 2026 Global Top 25 reports its member operators run 7.76 billion cubic feet, up 6.3% on 2025. Members only. <Cite id="gcca-top25-2026" /></div>
              </li>
              <li>
                <time>May 2026</time>
                <div><Tag kind="public" /> EPA final rule reconsidering parts of the HFC Technology Transitions requirements, including cold storage warehouses. <Cite id="epa-tt-actions" /></div>
              </li>
              <li>
                <time>Jan 20, 2026 → July 20, 2028</time>
                <div><Tag kind="public" /> FDA’s food traceability compliance date and the proposed and congressionally directed non-enforcement date. <Cite id="fda-fsma-204" /></div>
              </li>
              <li>
                <time>Mar 31, 2025</time>
                <div><Tag kind="public" /> CBRE’s Midwest cold-storage report: 56% of Midwest space built before 1990, and power increasingly hard to acquire. Regional, with Q4 2024 market data. <Cite id="cbre-midwest-inventory-age" /></div>
              </li>
              <li>
                <time>2017 (reported Nov 2022)</time>
                <div><Tag kind="public" /> UNEP and FAO: an estimated 526 million tons of food production lost in 2017 due to lack of effective refrigeration. A historical figure. <Cite id="unep-fao-2022" /></div>
              </li>
            </ul>
          </div>
        </section>

        {/* FIELD LAB */}
        <section className="section section--alt" id="field-lab" aria-labelledby="fl-h">
          <div className="wrap">
            <p className="kicker">Our field lab</p>
            <h2 id="fl-h">Build it. Measure it. Publish what holds up.</h2>
            <p className="section__intro">
              <Tag kind="founder" /> An 8 × 20-foot portable Polar King cooler has been acquired: fiberglass enclosure,
              insulated walls and floor, steel chassis. A research concept involves two S21 Pro miners and possible useful
              applications of their waste heat. Integration and performance validation are still ahead. The miners do
              not currently cool the enclosure, and low-grade waste heat does not directly run a conventional electric
              refrigeration system. The field lab supports measurement and learning, secondary to the evidence and
              underwriting mission.
            </p>
          </div>
        </section>

        {/* SOURCES */}
        <section className="section" id="sources" aria-labelledby="src-h">
          <div className="wrap">
            <p className="kicker">Sources</p>
            <h2 id="src-h">Where every claim comes from.</h2>
            <p className="section__intro">
              Checked on {sourcesData.checked}. The same list lives in the repository as <code>docs/sources.json</code>.
              Re-check dates and thresholds before relying on them.
            </p>
            <ul className="sources">
              {sourcesData.sources.map((s) => (
                <li key={s.id} id={`src-${s.id}`} className="card">
                  <p className="sources__claim">{s.claim}</p>
                  <dl>
                    <div><dt>Source</dt><dd>{s.publisher}: <a href={s.url} rel="noopener">{s.title}</a></dd></div>
                    <div><dt>Published</dt><dd>{s.published}</dd></div>
                    <div><dt>Data period</dt><dd>{s.data_period}</dd></div>
                    <div><dt>Scope</dt><dd>{s.scope}</dd></div>
                    <div><dt>Kind</dt><dd>{s.kind}</dd></div>
                    <div><dt>Qualification</dt><dd>{s.qualification}</dd></div>
                    <div><dt>Verification</dt><dd className={s.verification.startsWith('SECONDARY') ? 'warn-text' : ''}>{s.verification} (checked {s.date_checked})</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="final" aria-labelledby="w-final-h">
          <div className="wrap final__inner">
            <h2 id="w-final-h">Bring a real problem. Let’s work the pencil.</h2>
            <p className="section__intro">
              Useful problems, field knowledge, datasets and contributions are welcome. 30 years of transaction
              experience, self-funded, no VC, no token. If our experience can help you, bring it to the table.
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
