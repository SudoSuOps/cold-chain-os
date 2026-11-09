import { useEffect, useState } from 'react'
import Wordmark from './Wordmark.tsx'
import { REPO_URL, X_URL } from './links.ts'

const NAV = [
  ['problem', 'The Problem'],
  ['building', 'What We’re Building'],
  ['field-lab', 'Field Lab'],
  ['participate', 'Participate'],
] as const

/** `home` = rendered on the landing page (in-page anchors); otherwise links point back to "/". */
export function Header({ home = false }: { home?: boolean }) {
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
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a href={`${base}#${id}`} onClick={() => setOpen(false)}>{label}</a>
              </li>
            ))}
            <li>
              <a href="/compute/" aria-current={home ? undefined : 'page'} className={home ? '' : 'nav__current'}>
                Compute Room
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
        <span>An independent project in active development.</span>
      </div>
    </footer>
  )
}
