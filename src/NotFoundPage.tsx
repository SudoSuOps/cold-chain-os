import { Footer, Header } from './SiteChrome.tsx'
import { ISSUES_URL, REPO_URL } from './links.ts'

export default function NotFoundPage() {
  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <section className="cr-hero" aria-labelledby="nf-h">
          <div className="wrap">
            <p className="eyebrow">404 · Page not found</p>
            <h1 id="nf-h">That page doesn’t pencil.</h1>
            <p className="lede">The page you asked for isn’t here. It may have moved, or the link may be wrong.</p>
            <div className="cta-row">
              <a className="btn btn--primary" href="/">Back to the home page</a>
              <a className="btn btn--ghost" href={ISSUES_URL} rel="noopener">Report a broken link</a>
            </div>
            <p className="fineprint">
              Or explore: <a href="/why/">Why</a> · <a href="/last-mile/">Last mile</a> · <a href="/new-era/">New era</a> ·{' '}
              <a href="/datasets/">Datasets</a> · <a href={REPO_URL} rel="noopener">GitHub</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
