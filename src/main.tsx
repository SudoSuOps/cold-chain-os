import App from './App.tsx'
import { mount } from './mount.tsx'
import { readPageData } from './pageData.ts'
import type { DigestSummary } from './digestTypes.ts'
import './styles.css'

mount(<App latest={readPageData<{ latest?: DigestSummary }>()?.latest} />)
