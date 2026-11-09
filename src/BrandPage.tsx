import { Footer, Header } from './SiteChrome.tsx'
import Icon, { ICONS, type IconName } from './Icon.tsx'
import { ISSUES_URL, REPO_URL } from './links.ts'

const L = '/brand/logo/coldchainos-'
const LOGOS = [
  { name: 'Horizontal signature', file: 'horizontal', note: 'Primary. Minimum 120 px wide.', dark: true },
  { name: 'Horizontal signature', file: 'horizontal', note: 'On light grounds.', dark: false },
  { name: 'Stacked signature', file: 'stacked', note: 'Square-ish spaces. Minimum 88 px wide.', dark: true },
  { name: 'Wordmark', file: 'wordmark', note: 'Wordmark only. Minimum 96 px wide.', dark: true },
  { name: 'Mark', file: 'mark', note: 'Full detail at 40 px and above.', dark: true },
  { name: 'Mark', file: 'mark', note: 'On light grounds.', dark: false },
]

const COLORS: [string, string, string][] = [
  ['Midnight navy', '#06142A', 'Page background'],
  ['Surface', '#0D1F3A', 'Cards and elevated panels'],
  ['Deep charcoal', '#1B2129', 'Neutral dark surface'],
  ['Ice blue', '#8FCFF5', 'Primary accent'],
  ['Glacier blue', '#1B66B9', 'Secondary, light-ground accent'],
  ['Frost white', '#EEF4FA', 'Text on dark'],
  ['Platinum', '#B8C2CC', 'Metal accents, input borders'],
  ['Muted text', '#9AAABD', 'Secondary text on dark'],
]

const ICON_LABELS: Record<IconName, string> = {
  'cold-storage-facility': 'Cold storage facility',
  refrigeration: 'Refrigeration',
  energy: 'Energy',
  evidence: 'Evidence',
  underwriting: 'Underwriting',
  dataset: 'Dataset',
  'local-compute': 'Local compute',
  community: 'Community',
}

export default function BrandPage() {
  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <section className="cr-hero" aria-labelledby="b-h">
          <div className="wrap">
            <p className="eyebrow">Brand · Identity kit v1.0</p>
            <h1 id="b-h">The pencil, the Bull, the mark.</h1>
            <p className="lede">
              How coldchainOS looks and sounds: signatures, colour, type, icons and voice. Use the files unmodified
              to refer to the project.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="logos-h">
          <div className="wrap">
            <p className="kicker">Signatures</p>
            <h2 id="logos-h">Two elements: the Bull for stories, the mark for everything small.</h2>
            <ul className="tiles">
              {LOGOS.map((l) => {
                const file = `${L}${l.file}-${l.dark ? 'on-dark' : 'on-light'}.svg`
                return (
                  <li key={file} className={`tile ${l.dark ? 'tile--dark' : 'tile--light'}`}>
                    <div className="tile__art">
                      <img src={file} alt={`coldchainOS ${l.name.toLowerCase()}, ${l.dark ? 'on dark' : 'on light'}`} />
                    </div>
                    <div className="tile__cap">
                      <b>{l.name}</b>
                      <span>{l.note}</span>
                      <a href={file} download>SVG</a>
                    </div>
                  </li>
                )
              })}
            </ul>
            <ul className="rules">
              <li>Always spell it <b>coldchainOS</b>: lowercase “coldchain”, uppercase “OS”, one word.</li>
              <li>Don’t stretch, rotate, recolour the horns, add glow, or place the mark over busy imagery.</li>
              <li>Below 40 px use the favicon geometry, not the detailed mark.</li>
            </ul>
          </div>
        </section>

        <section className="section section--alt" aria-labelledby="bull-h">
          <div className="wrap brand-bull">
            <img
              src="/brand/hero/coldchainos-bull-avatar-1024.webp"
              alt="The coldchainOS Bull: charcoal fur, crystalline ice-blue horns, platinum aviators and an ice-blue suit"
              width="320"
              height="320"
            />
            <div>
              <p className="kicker">The Bull</p>
              <h2>Storytelling, not decoration.</h2>
              <p className="section__intro">
                The Bull carries the large, narrative moments: heroes and social. The mark distils his horns and
                aviators into flat geometry for navigation, favicons and small spaces. Use the supplied files; don’t
                redraw, mirror or crop the horns.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="color-h">
          <div className="wrap">
            <p className="kicker">Colour</p>
            <h2 id="color-h">Midnight ground, ice-blue signal, platinum restraint.</h2>
            <ul className="swatches">
              {COLORS.map(([n, hex, use]) => (
                <li key={hex}>
                  <span className="sw" style={{ background: hex }} aria-hidden="true" />
                  <b>{n}</b>
                  <code>{hex}</code>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--alt" aria-labelledby="type-h">
          <div className="wrap type">
            <div>
              <p className="kicker">Type</p>
              <h2 id="type-h">Archivo for display. Inter for everything you read or measure.</h2>
              <p className="section__intro">
                Both are open-licensed (SIL OFL 1.1) and self-hosted. Numbers use Inter with tabular figures so
                columns align, always with units and the operation that produced them.
              </p>
            </div>
            <div className="specimen card">
              <p className="specimen__display">Does the cold chain pencil?</p>
              <p className="specimen__body">Evidence in. Assumptions visible. Math you can check.</p>
              <p className="specimen__num">7,200 kWh × $0.12/kWh = $864</p>
              <p className="art-cap">Illustrative example, not measured data.</p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="icons-h">
          <div className="wrap">
            <p className="kicker">Icons</p>
            <h2 id="icons-h">Eight original icons. One stroke weight.</h2>
            <ul className="icon-grid">
              {(Object.keys(ICONS) as IconName[]).map((n) => (
                <li key={n}>
                  <Icon name={n} />
                  <span>{ICON_LABELS[n]}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--alt" aria-labelledby="voice-h">
          <div className="wrap type">
            <div>
              <p className="kicker">Voice</p>
              <h2 id="voice-h">Experienced. Direct. Evidence-led.</h2>
              <p className="section__intro">Every statement is one of three kinds, and we say which.</p>
            </div>
            <ul className="facts">
              <li><b>Measured.</b> Observed or reported, with source and date.</li>
              <li><b>Illustrative.</b> An example built to show a calculation. Labelled every time.</li>
              <li><b>Planned.</b> Work we intend to do. “Planned”, never “now supports”.</li>
            </ul>
          </div>
        </section>

        <section className="section" aria-labelledby="use-h">
          <div className="wrap">
            <p className="kicker">Using the brand</p>
            <h2 id="use-h">Reference us freely. Don’t imply endorsement.</h2>
            <p className="section__intro">
              The coldchainOS name, wordmark, mark and Bull artwork belong to the project and are not covered by the
              project’s open-source code licence unless the project states otherwise. Contributors and the press may use
              the unmodified files to refer to coldchainOS. See the{' '}
              <a href="/brand/NOTICE.md">credits and licensing notice</a> for fonts and asset provenance.
            </p>
            <div className="cta-row">
              <a className="btn btn--primary" href={REPO_URL} rel="noopener">Explore the project</a>
              <a className="btn btn--ghost" href={ISSUES_URL} rel="noopener">Ask about brand use</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
