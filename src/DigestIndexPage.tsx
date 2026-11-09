import { Footer, Header } from './SiteChrome.tsx'
import { prettyDate, type DigestSummary } from './digestTypes.ts'
import { ISSUES_URL, REPO_URL } from './links.ts'

export default function DigestIndexPage({ posts = [] }: { posts?: DigestSummary[] }) {
  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header page="digest" />
      <main id="main">
        <section className="cr-hero" aria-labelledby="dg-h">
          <div className="wrap">
            <p className="eyebrow">Digest</p>
            <h1 id="dg-h">The Digest: dated, sourced, plain.</h1>
            <p className="lede">
              A daily research note on cold storage, energy, refrigeration, security and the last mile. Every item shows
              what a source documents, why it matters here, what it does <em>not</em> establish, and a question for an
              accountable person.
            </p>
            <p className="fineprint">
              <a href="/digest/feed.xml">Atom feed</a> · <a href="/digest/posts.json">posts.json</a> · Not compliance,
              appraisal, engineering, legal or investment advice.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="posts-h">
          <div className="wrap">
            <p className="kicker">Latest</p>
            <h2 id="posts-h">{posts.length === 1 ? '1 digest' : `${posts.length} digests`}</h2>
            <ol className="dg-list">
              {posts.map((p) => (
                <li key={p.date} className="card dg-card">
                  <p className="dg-meta"><time dateTime={p.date}>{prettyDate(p.date)}</time> · {p.items} items · {p.sources} sources</p>
                  <h3><a href={`/digest/${p.date}/`}>{p.title}</a></h3>
                  <p>{p.summary}</p>
                  <p className="dg-take"><b>The pencil question:</b> {p.takeaway}</p>
                  <ul className="deps" aria-label="Tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section--alt" aria-labelledby="how-h">
          <div className="wrap two-col" style={{ marginTop: 0 }}>
            <div>
              <p className="kicker">How it’s made</p>
              <h2 id="how-h">Real sources. Visible limits.</h2>
            </div>
            <ul className="facts">
              <li>Each item cites sources read on the publisher’s own page, with the date the source states.</li>
              <li>Anything we could not read on the primary page is marked secondary-only, and says so.</li>
              <li>Every item states what it does not establish. We don’t invent incidents, victims, losses or savings.</li>
              <li>Posts are research notes, not a live threat or price feed.</li>
            </ul>
          </div>
        </section>

        <section className="final" aria-labelledby="dg-final-h">
          <div className="wrap final__inner">
            <h2 id="dg-final-h">Spot an error or a missing source?</h2>
            <p className="section__intro">Corrections make the Digest worth more. Tell us what the source actually says.</p>
            <div className="cta-row">
              <a className="btn btn--primary" href="/contact/">Contact us</a>
              <a className="btn btn--ghost" href={ISSUES_URL} rel="noopener">Open an issue</a>
              <a className="btn btn--ghost" href={REPO_URL} rel="noopener">Explore the project</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
