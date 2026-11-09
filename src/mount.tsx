import { StrictMode, type ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

/** Hydrate the pre-rendered HTML when present; fall back to a normal client render (dev server). */
export function mount(node: ReactNode) {
  const el = document.getElementById('root')!
  const tree = <StrictMode>{node}</StrictMode>
  if (el.hasChildNodes()) hydrateRoot(el, tree)
  else createRoot(el).render(tree)
}
