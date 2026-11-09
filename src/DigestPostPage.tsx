import { Footer, Header } from './SiteChrome.tsx'
import { Tag } from './Tag.tsx'
import { prettyDate, type DigestNav, type DigestPost } from './digestTypes.ts'

export default function DigestPostPage({ post, prev, next }: { post: DigestPost; prev?: DigestNav; next?: DigestNav }) {
  const byId = Object.fromEntries(post.sources.map((s) => [s.id, s]))
  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header page="digest" />
      <main id="main">
        <article>
          <section className="cr-hero" aria-labelledby="post-h">
            <div className="wrap">
              <nav aria-label="Breadcrumb" className="dg-crumb"><a href="/digest/">Digest</a> <span aria-hidden="true">/</span> <span>{prettyDate(post.date)}</span></nav>
              <p className="eyebrow">Digest · <time dateTime={post.published_at}>{prettyDate(post.date)}</time></p>
              <h1 id="post-h">{post.title}</h1>
              <p className="lede">{post.summary}</p>
              <ul className="deps" aria-label="Tags">{post.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </section>

          <section className="section" aria-labelledby="take-h">
            <div className="wrap">
              <div className="card review">
                <p className="kicker" id="take-h">The pencil question</p>
                <p className="dg-takeaway">{post.takeaway}</p>
              </div>
              <ol className="dg-items">
                {post.items.map((it) => (
                  <li key={it.id} id={it.id} className="card dg-item">
                    <header>
                      <Tag kind={it.label} />
                      <h2>{it.headline}</h2>
                    </header>
                    <dl>
                      <div><dt>What happened</dt><dd>{it.what_happened}</dd></div>
                      <div><dt>Why it matters here</dt><dd>{it.why_it_matters}</dd></div>
                      <div><dt>What it does not establish</dt><dd>{it.not_established}</dd></div>
                      <div className="ev__q"><dt>A review question</dt><dd>{it.review_question}</dd></div>
                    </dl>
                    <p className="fineprint">
                      Sources:{' '}
                      {it.source_ids.map((sid, i) => (
                        <span key={sid}>{i > 0 ? ', ' : ''}<a className="cite" href={`#src-${sid}`}>{byId[sid].title}</a></span>
                      ))}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="section section--alt" id="sources" aria-labelledby="dsrc-h">
            <div className="wrap">
              <p className="kicker">Sources</p>
              <h2 id="dsrc-h">Where each claim comes from.</h2>
              <ul className="sources">
                {post.sources.map((s) => (
                  <li key={s.id} id={`src-${s.id}`} className="card">
                    <p className="sources__claim"><a href={s.url} rel="noopener">{s.title}</a></p>
                    <dl>
                      <div><dt>Publisher</dt><dd>{s.publisher}</dd></div>
                      <div><dt>Published</dt><dd>{s.published}</dd></div>
                      <div><dt>Scope</dt><dd>{s.scope}</dd></div>
                      <div><dt>Kind</dt><dd>{s.kind}</dd></div>
                      <div><dt>Limits</dt><dd>{s.qualification}</dd></div>
                      <div><dt>Verification</dt><dd className={s.verification === 'primary' ? '' : 'warn-text'}>{s.verification === 'primary' ? 'Read on the publisher’s page' : `${s.verification === 'secondary_only' ? 'Secondary only' : 'Supplied by the project owner'}: ${s.verification_note}`} (accessed {s.accessed})</dd></div>
                    </dl>
                  </li>
                ))}
              </ul>
              <div className="card" style={{ marginTop: 24 }}>
                <h3>How this digest was made</h3>
                <p>{post.method}</p>
                <p className="fineprint">Not compliance, appraisal, engineering, legal or investment advice. Corrections: <a href="/contact/">contact us</a>.</p>
              </div>
            </div>
          </section>
        </article>

        <nav aria-label="More digests" className="section dg-pager">
          <div className="wrap">
            <div className="dg-pager__row">
              {prev ? <a href={`/digest/${prev.date}/`} rel="prev">← {prettyDate(prev.date)}: {prev.title}</a> : <span />}
              <a href="/digest/">All digests</a>
              {next ? <a href={`/digest/${next.date}/`} rel="next">{prettyDate(next.date)}: {next.title} →</a> : <span />}
            </div>
          </div>
        </nav>
      </main>
      <Footer />
    </div>
  )
}
