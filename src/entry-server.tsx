import { renderToString } from 'react-dom/server'
import type { ComponentProps, ComponentType } from 'react'
import App from './App.tsx'
import ComputePage from './ComputePage.tsx'
import DatasetsPage from './DatasetsPage.tsx'
import BrandPage from './BrandPage.tsx'
import WhyPage from './WhyPage.tsx'
import DealRoomPage from './DealRoomPage.tsx'
import LastMilePage from './LastMilePage.tsx'
import NewEraPage from './NewEraPage.tsx'
import ContactPage from './ContactPage.tsx'
import DigestIndexPage from './DigestIndexPage.tsx'
import DigestPostPage from './DigestPostPage.tsx'
import NotFoundPage from './NotFoundPage.tsx'

/** Output file (relative to dist/) -> page component. Used only by scripts/prerender.mjs at build time. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pages: Record<string, ComponentType<any>> = {
  'index.html': App,
  'compute/index.html': ComputePage,
  'datasets/index.html': DatasetsPage,
  'brand/index.html': BrandPage,
  'why/index.html': WhyPage,
  'deal-room/index.html': DealRoomPage,
  'last-mile/index.html': LastMilePage,
  'new-era/index.html': NewEraPage,
  'contact/index.html': ContactPage,
  'digest/index.html': DigestIndexPage as ComponentType,
  '404.html': NotFoundPage,
}

export function render(file: string, props: Record<string, unknown> = {}): string {
  const Page = pages[file]
  if (!Page) throw new Error(`no page registered for ${file}`)
  return renderToString(<Page {...props} />)
}

export { DigestPostPage }
export function renderPost(props: ComponentProps<typeof DigestPostPage>): string {
  return renderToString(<DigestPostPage {...props} />)
}
