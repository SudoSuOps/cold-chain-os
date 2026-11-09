import { Footer, Header } from './SiteChrome.tsx'
import LastMileCalculator from './LastMileCalculator.tsx'
import { Tag } from './Tag.tsx'
import { ISSUES_URL, REPO_URL } from './links.ts'
import data from '../docs/last-mile-sources.json'

const byId = (id: string) => data.sources.find((s) => s.id === id)!
function Cite({ id }: { id: string }) {
  const s = byId(id)
  return <a className="cite" href={`#src-${id}`} aria-label={`Source: ${s.publisher}`}>[{s.publisher}]</a>
}

const RECIPIENTS: [string, string, string][] = [
  ['Households and working families', 'Groceries and chilled or frozen items that arrive in usable condition, at a time that fits the day.', 'How long does product sit before handoff, and what instructions does the recipient get?'],
  ['Older adults and people with limited mobility', 'Reliable delivery to the door, without carrying or travelling.', 'Is the service actually available, and at what cost, to the people who need it? (Not assumed.)'],
  ['Restaurants, hotels and caterers', 'Predictable receiving windows and product that meets their specifications.', 'Do receiving hours, dock access and order timing line up with the delivery window?'],
  ['Independent grocers and specialty food stores', 'Small, frequent replenishment drops without carrying excess inventory.', 'What does a small drop cost at their order density, and how often do they reorder?'],
  ['Schools and institutional kitchens', 'Scheduled, documented deliveries to a receiving point.', 'Who receives, when, and what handling and storage conditions apply on arrival?'],
  ['Patients receiving temperature-sensitive medication', 'Medication that arrives under the conditions its labeling and procedures require.', 'What does this specific product require, and what records support the handoff? (A separate operational lane.)'],
  ['Clinics and other authorized healthcare recipients', 'Authorized receipt with documented conditions.', 'Who is authorized to receive, and which procedures and rules apply to this product?'],
]
const BUYERS = ['Retailers', 'Distributors', 'Food brands', 'Meal providers', 'Pharmacies', 'Healthcare organizations', 'Delivery operators']

const PRODUCTS: [string, string, string, string[]][] = [
  ['A', 'Fresh proteins', 'Meat, poultry, seafood.', ['Product condition on arrival', 'Segregation from other items', 'Packaging and handling', 'Delivery time', 'Receiving arrangements']],
  ['B', 'Dairy and chilled foods', 'Milk, yogurt, cheese where refrigeration is required, chilled beverages.', ['Product-specific requirements', 'Staging conditions', 'Order density', 'Replenishment frequency']],
  ['C', 'Produce', 'Leafy greens, berries, cut produce and others needing appropriate temperature management.', ['Temperature and humidity', 'Damage in handling', 'Compatibility with other items', 'Not all produce needs the same conditions']],
  ['D', 'Frozen foods and ice cream', 'Frozen meals, proteins, vegetables, ice cream.', ['Frozen-state requirements', 'Packaging performance', 'Door openings', 'Delivery exposure', 'Frozen quality and microbial safety are different issues']],
  ['E', 'Meal kits and prepared chilled meals', 'Mixed-ingredient orders and ready-to-eat items.', ['Mixed ingredients and allergens', 'Packaging', 'Unattended delivery', 'Instructions to recipients']],
  ['F', 'Temperature-sensitive medicines', 'Insulin and certain biologics or vaccines, where relevant.', ['A separate operational lane', 'Conditions depend on the product, manufacturer labeling, validated procedures and applicable rules', 'No single temperature band applies to all']],
]
const EQUIPMENT = ['Insulated totes and packaging', 'Refrigerants or phase-change materials', 'Refrigerated vehicles and compartments', 'Local cold rooms and appropriately designed lockers', 'Temperature loggers and sensors', 'Order, dispatch and routing tools']

export default function LastMilePage() {
  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header page="last-mile" />
      <main id="main">
        {/* HERO */}
        <section className="cr-hero" aria-labelledby="lm-h">
          <div className="wrap">
            <p className="eyebrow">Last mile</p>
            <h1 id="lm-h">The cold chain ends at the handoff.</h1>
            <p className="lede thesis">Connect the product, the local node, the route, and the operating math.</p>
            <p className="lede">
              A warehouse can hold the product. The last mile has to deliver it, on time, in the required condition, at a
              cost the operation can support.
            </p>
            <p className="status-tag">
              coldchainOS does not operate deliveries and has no deployed monitoring, routing or customer integrations.
              This page is context, an educational calculator, and a description of planned work.
            </p>
            <ul className="tagkey" aria-label="How we label statements">
              <li><Tag kind="public" /></li><li><Tag kind="illustrative" /></li><li><Tag kind="founder" /></li><li><Tag kind="planned" /></li>
            </ul>
          </div>
        </section>

        {/* DEFINITION */}
        <section className="section" id="definition" aria-labelledby="def-h">
          <div className="wrap">
            <p className="kicker">What the last mile is</p>
            <h2 id="def-h">The last mile is where the cold chain meets the customer.</h2>
            <p className="section__intro">
              The final delivery leg from a local fulfillment point to the intended recipient. It is not literally one
              mile. A regional distribution center supplying a local hub is generally <strong>middle-mile</strong>; the
              final delivery begins downstream.
            </p>
            <ul className="cards cards--3">
              <li className="card"><h3>Consumer home delivery</h3><p>Grocery store to household. Local chilled fulfillment hub to household. Specialty pharmacy to patient.</p></li>
              <li className="card"><h3>Business-to-business final delivery</h3><p>Food distributor to a restaurant or school kitchen. Medical distribution point to a clinic.</p></li>
              <li className="card"><h3>Click-and-collect</h3><p>The customer completes the final journey, so the handoff and the trip home still matter.</p></li>
            </ul>
            <p className="section__intro" style={{ marginTop: 32 }}>
              Cold-chain performance includes <strong>staging, loading, transport, unloading, handoff</strong>, and any
              period before the recipient places the product into appropriate storage.
            </p>
          </div>
        </section>

        {/* WHO */}
        <section className="section section--alt" id="who" aria-labelledby="who-h">
          <div className="wrap">
            <p className="kicker">Who it serves</p>
            <h2 id="who-h">Recipients are not the same as buyers.</h2>
            <table className="lm-who">
              <caption className="sr">Recipients, their needs, and the evidence or operating question for each</caption>
              <thead><tr><th scope="col">Recipient</th><th scope="col">Need</th><th scope="col">Evidence or operating question</th></tr></thead>
              <tbody>
                {RECIPIENTS.map(([r, n, q]) => (
                  <tr key={r}>
                    <th scope="row">{r}</th>
                    <td data-label="Need">{n}</td>
                    <td data-label="Evidence or operating question">{q}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="two-col">
              <div className="card">
                <h3>Who buys logistics services</h3>
                <ul className="deps" aria-label="Organizations that buy logistics services">{BUYERS.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
              <div className="card">
                <h3>Access is a potential benefit</h3>
                <p>Better local cold-chain access could help. We make no claim about affordability, equitable coverage or rural reach without evidence about the actual service.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="section" id="products" aria-labelledby="prod-h">
          <div className="wrap">
            <p className="kicker">Key product categories</p>
            <h2 id="prod-h">What moves, and what each category asks of the route.</h2>
            <p className="section__intro">Categories, not a ranking. We do not call any of these “top-selling”, because we have no dataset defining geography, period, channel and metric.</p>
            <ul className="cards cards--3">
              {PRODUCTS.map(([k, t, d, qs]) => (
                <li key={k} className="card">
                  <span className="card__n">{k}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                  <ul className="plain">{qs.map((q) => <li key={q}>{q}</li>)}</ul>
                </li>
              ))}
            </ul>
            <h3 className="eco-h3">Enabling equipment categories</h3>
            <ul className="deps" aria-label="Equipment categories">{EQUIPMENT.map((e) => <li key={e}>{e}</li>)}</ul>
            <p className="fineprint">Categories, not vendor endorsements. Packaging cannot make any route acceptable.</p>
          </div>
        </section>

        {/* VELOCITY */}
        <section className="section section--alt" id="velocity" aria-labelledby="vel-h">
          <div className="wrap">
            <p className="kicker">Market velocity, in three parts</p>
            <h2 id="vel-h">Momentum, operations and economics are different things.</h2>
            <ul className="cards cards--3">
              <li className="card">
                <h3>A. Market momentum</h3>
                <p>Is demand growing?</p>
                <ul className="plain"><li>Growth in sales</li><li>Active customers</li><li>Order frequency</li><li>Delivery use</li></ul>
              </li>
              <li className="card">
                <h3>B. Operating velocity</h3>
                <p>How fast does the work actually move?</p>
                <ul className="plain"><li>Orders picked per hour</li><li>Pick complete to dispatch</li><li>Orders per route</li><li>Stops per paid driver hour</li><li>Completed deliveries per route hour</li><li>Miles per completed delivery</li><li>On-time delivery %</li><li>First-attempt completion %</li><li>Dwell in each staging area</li></ul>
              </li>
              <li className="card">
                <h3>C. Economic performance</h3>
                <p>Does it pay?</p>
                <ul className="plain"><li>Cost per completed delivery</li><li>Contribution per order</li><li>Refunds, redeliveries, claims</li><li>Packaging and cooling</li><li>Labor and vehicle</li><li>Energy at the local node</li><li>Peak and off-peak utilization</li></ul>
              </li>
            </ul>
            <ul className="rules">
              <li>Dollar sales growth is not the same as physical order growth.</li>
              <li>Order growth is not the same as profitability.</li>
              <li>More drops per hour do not prove proper temperature control.</li>
              <li>High facility occupancy does not establish fast product movement.</li>
            </ul>
            <p className="fineprint">Every metric needs a defined denominator and a defined time window.</p>
          </div>
        </section>

        {/* MARKET EVIDENCE */}
        <section className="section" id="market" aria-labelledby="mkt-h">
          <div className="wrap">
            <p className="kicker">Current market evidence · as of November 9, 2026</p>
            <h2 id="mkt-h">Demand for delivered groceries is growing. That is not our market.</h2>
            <ul className="timeline">
              <li>
                <time>Oct 15, 2026<br />(3Q26)</time>
                <div>
                  <Tag kind="public" /> Brick Meets Click reported U.S. online grocery sales up <strong>20.7%</strong> year over
                  year in 3Q26. Delivery grew more than 30% and drove about three-quarters of the topline increase. <Cite id="bmc-3q26" />
                </div>
              </li>
              <li>
                <time>Oct 21, 2026<br />(Sept 2026)</time>
                <div>
                  <Tag kind="public" /> For September 2026 alone, Brick Meets Click reported sales up just over 16%, average order
                  frequency up 9.0%, and sub-same-day orders (within three hours) about two-thirds of Delivery orders. <Cite id="bmc-sept26" />
                </div>
              </li>
              <li>
                <time>Dec 9, 2022</time>
                <div>
                  <Tag kind="public" /> FDA highlighted best practices for food safety in third-party delivery, including the
                  “last mile”: packaging, temperature control, contamination and allergen control. These are recommendations,
                  not a universal legal requirement. <Cite id="fda-online-delivery" />
                </div>
              </li>
            </ul>
            <div className="card" style={{ marginTop: 28 }}>
              <h3>Read the numbers carefully</h3>
              <p>
                The Brick Meets Click figures are survey-based estimates of grocery sales across fulfillment methods and
                categories, not only refrigerated home delivery. They are not cold-chain logistics revenue, a software
                market size, or counts of refrigerated shipments. The quarter and the single month are different periods,
                so their growth rates are not comparable. We use them as context for demand, not as a measure of any one
                route or facility.
              </p>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="section section--alt" id="calculator" aria-labelledby="calc-h">
          <div className="wrap">
            <p className="kicker">A working example</p>
            <h2 id="calc-h">What does one failed delivery do to the math?</h2>
            <p className="section__intro">
              Twenty attempts at $170 of selected costs is $8.50 per completed delivery. Two failures, same costs: about
              $9.44. Change the inputs and check it.
            </p>
            <Tag kind="illustrative" />
            <LastMileCalculator />
          </div>
        </section>

        {/* LOCAL INFRASTRUCTURE */}
        <section className="section" id="local" aria-labelledby="loc-h">
          <div className="wrap">
            <p className="kicker">Why local real estate matters</p>
            <h2 id="loc-h">The node and the route have to pencil together.</h2>
            <p className="section__intro">A local node shapes the route. These are the levers:</p>
            <ul className="deps" aria-label="What a local node affects">
              {['Distance to customers', 'Route density', 'Dispatch windows', 'Staging capacity', 'Vehicle access', 'Loading time', 'Refrigeration and electrical requirements', 'Labor access', 'Rent and operating expenses'].map((d) => <li key={d}>{d}</li>)}
            </ul>
            <div className="two-col">
              <div className="card">
                <h3>The tradeoff</h3>
                <ul className="plain">
                  <li>A closer location may reduce travel while increasing occupancy costs.</li>
                  <li>A larger service radius may reach more customers while increasing time and variability.</li>
                  <li>A nearer facility is not automatically more profitable.</li>
                </ul>
              </div>
              <div className="card">
                <Tag kind="hypothesis" />
                <h3>A hypothetical: Jupiter / Palm Beach</h3>
                <p>
                  Imagine a small chilled hub serving part of northern Palm Beach County. Whether it pencils depends on
                  facts we do not have: delivery demand, drive times, vehicle access, permitting suitability, utility
                  capacity and rent. We invent none of them. This is a list of questions, not a finding.
                </p>
                <p className="fineprint"><Tag kind="founder" /> Our acquired 8 × 20-foot portable cooler is field-lab hardware for future investigation. It is not an approved food-distribution or pharmaceutical facility.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTRIBUTION */}
        <section className="section section--alt" id="contribution" aria-labelledby="con-h">
          <div className="wrap">
            <p className="kicker">What coldchainOS contributes</p>
            <h2 id="con-h">Evidence in. Assumptions visible. Math you can check.</h2>
            <Tag kind="planned" />
            <ol className="steps steps--5" aria-label="Intended workflow">
              {['Collect evidence', 'Identify gaps and conflicting assumptions', 'Calculate scenarios', 'Produce a source-linked brief', 'Support accountable human review'].map((s, i) => (
                <li key={s}><span className="steps__n">{i + 1}</span>{s}</li>
              ))}
            </ol>
            <div className="two-col">
              <div className="card">
                <h3>Potential inputs</h3>
                <ul className="plain">{['Order timestamps', 'Dispatch records', 'Receiving confirmations', 'Route summaries', 'Utility bills', 'Equipment records', 'Product-handling requirements', 'Packaging specifications', 'Authorized temperature records'].map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="card">
                <h3>Questions it should help answer</h3>
                <ul className="plain">{['Where does product wait?', 'What changes when order density falls?', 'What does a failed delivery do to unit economics?', 'What evidence supports the claimed operating conditions?', 'Does a proposed site improve the combined facility-and-route economics?'].map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </div>
            <p className="fineprint">
              Customer addresses, patient information, delivery details and confidential contracts stay out of the public
              website and public datasets. Demonstrations use synthetic data. See <a href="/why/#nda">the NDA and data-control approach</a>.
            </p>
          </div>
        </section>

        {/* SOURCES */}
        <section className="section" id="sources" aria-labelledby="src-h">
          <div className="wrap">
            <p className="kicker">Sources</p>
            <h2 id="src-h">Where every claim comes from.</h2>
            <p className="section__intro">Checked on {data.checked}. The same list is <code>docs/last-mile-sources.json</code>.</p>
            <ul className="sources">
              {data.sources.map((s) => (
                <li key={s.id} id={`src-${s.id}`} className="card">
                  <p className="sources__claim">{s.claim}</p>
                  <dl>
                    <div><dt>Source</dt><dd>{s.publisher}: <a href={s.url} rel="noopener">{s.title}</a></dd></div>
                    <div><dt>Published</dt><dd>{s.published}</dd></div>
                    <div><dt>Data period</dt><dd>{s.data_period}</dd></div>
                    <div><dt>Geography</dt><dd>{s.geographic_scope}</dd></div>
                    <div><dt>Measurement</dt><dd>{s.measurement}</dd></div>
                    <div><dt>Limitations</dt><dd>{s.limitations}</dd></div>
                    <div><dt>Checked</dt><dd>{s.date_checked}</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="final" aria-labelledby="lm-final-h">
          <div className="wrap final__inner">
            <h2 id="lm-final-h">Bring a real route. Let’s work the pencil.</h2>
            <p className="section__intro">Operators, dispatchers, receiving teams and local-hub builders: if you’ve run the last mile, your field notes make the model better.</p>
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
