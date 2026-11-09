import DigestPostPage from './DigestPostPage.tsx'
import { mount } from './mount.tsx'
import { readPageData } from './pageData.ts'
import type { DigestNav, DigestPost } from './digestTypes.ts'
import './styles.css'
import './compute.css'
import './datasets.css'
import './why.css'
import './digest.css'

const d = readPageData<{ post: DigestPost; prev?: DigestNav; next?: DigestNav }>()
if (d) mount(<DigestPostPage post={d.post} prev={d.prev} next={d.next} />)
