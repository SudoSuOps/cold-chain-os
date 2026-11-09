import { useEffect, useState } from 'react'
import Wordmark from './Wordmark.tsx'
import { CONTACT_EMAIL, OWNER, REPO_URL, X_URL } from './links.ts'

const NAV = [
  ['problem', 'The Problem'],
  ['building', 'What We’re Building'],
  ['field-lab', 'Field Lab'],
  ['participate', 'Participate'],
] as const

/** `home` = rendered on the landing page (in-page anchors); otherwise links point back to "/". */
export function Header({ home = false, page }: { home?: boolean; page?: 'compute' | 'datasets' | 'why' | 'deal-room' | 'last-mile' | 'new-era' | 'contact' | 'digest' }) {
  const [open, setOpen] = useState(false)
  const base = home ? '' : '/'
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <Wordmark href={home ? '#top' : '/'} />
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="site-nav" className="nav" data-open={open} aria-label="Primary">
          <ul>
            <li>
              <a href="/why/" aria-current={page === 'why' ? 'page' : undefined} className={page === 'why' ? 'nav__current' : ''}>Why</a>
            </li>
            <li>
              <a href="/digest/" aria-current={page === 'digest' ? 'page' : undefined} className={page === 'digest' ? 'nav__current' : ''}>Digest</a>
            </li>
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a href={`${base}#${id}`} onClick={() => setOpen(false)}>{label}</a>
              </li>
            ))}
            <li>
              <a href="/datasets/" aria-current={page === 'datasets' ? 'page' : undefined} className={page === 'datasets' ? 'nav__current' : ''}>
                Datasets
              </a>
            </li>
            <li>
              <a className="nav__gh" href={REPO_URL} rel="noopener">GitHub ↗</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export function Footer({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__row">
        <a href={home ? '#top' : '/'}>coldchainOS.org</a>
        <a href={REPO_URL} rel="noopener">GitHub</a>
        <a href={X_URL} rel="noopener">X @bestinbull</a>
        <a href="/why/">Why</a>
        <a href="/digest/">Digest</a>
        <a href="/last-mile/">Last mile</a>
        <a href="/new-era/">New era</a>
        <a href="/contact/">Contact</a>
        <a href="/compute/">Compute room</a>
        <a href="/deal-room/">Dev room</a>
        <a href="/brand/">Brand</a>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <span>An independent project in active development. © 2026 {OWNER}</span>
      </div>
    </footer>
  )
}
