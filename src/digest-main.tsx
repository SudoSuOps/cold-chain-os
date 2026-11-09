import DigestIndexPage from './DigestIndexPage.tsx'
import { mount } from './mount.tsx'
import { readPageData } from './pageData.ts'
import type { DigestSummary } from './digestTypes.ts'
import './styles.css'
import './compute.css'
import './datasets.css'
import './why.css'
import './digest.css'

mount(<DigestIndexPage posts={readPageData<{ posts: DigestSummary[] }>()?.posts} />)
