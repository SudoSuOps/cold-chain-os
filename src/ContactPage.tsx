import { Footer, Header } from './SiteChrome.tsx'
import ContactForm from './ContactForm.tsx'
import { CONTACT_EMAIL, ISSUES_URL, REPO_URL } from './links.ts'

export default function ContactPage() {
  return (
    <div id="top">
      <a className="skip" href="#main">Skip to content</a>
      <Header page="contact" />
      <main id="main">
        <section className="cr-hero" aria-labelledby="ct-h">
          <div className="wrap">
            <p className="eyebrow">Contact</p>
            <h1 id="ct-h">Bring a real problem. Let’s work the pencil.</h1>
            <p className="lede">
              Operators, brokers, engineers, counsel and builders: if you’ve got a real cold-chain problem, field
              knowledge, a dataset, or a correction, tell us.
            </p>
          </div>
        </section>

        <section className="section" aria-labelledby="form-h">
          <div className="wrap ct-split">
            <div>
              <p className="kicker">Send a message</p>
              <h2 id="form-h">A person reads every message.</h2>
              <ul className="facts">
                <li>We reply from {CONTACT_EMAIL}. We can’t promise a response time.</li>
                <li>You’ll get a short confirmation email.</li>
                <li>For public questions, corrections and ideas, a <a href={ISSUES_URL} rel="noopener">GitHub issue</a> is even better, because the answer helps everyone.</li>
              </ul>
              <div className="card card--planned" style={{ marginTop: 24 }}>
                <h3>Please don’t send confidential material</h3>
                <p>
                  This form is plain email. It is not a secured channel and accepts no attachments. Don’t include client
                  records, documents covered by an NDA, or personal information. Tell us what you have, and we’ll agree
                  on a safe way to handle it.
                </p>
                <p className="fineprint">
                  Your message is delivered by email through Resend, our email provider, to Swarm &amp; Bee LLC. The site
                  itself stores nothing. You can also email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> directly.
                </p>
              </div>
            </div>
            <div className="card ct-card">
              <ContactForm />
            </div>
          </div>
        </section>

        <section className="final" aria-labelledby="ct-final-h">
          <div className="wrap final__inner">
            <h2 id="ct-final-h">Prefer to read first?</h2>
            <p className="section__intro">The project, its sources and its open questions are all public.</p>
            <div className="cta-row">
              <a className="btn btn--primary" href={REPO_URL} rel="noopener">Explore the project</a>
              <a className="btn btn--ghost" href="/why/">Why coldchainOS</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
