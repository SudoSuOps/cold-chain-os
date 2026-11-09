import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BrandPage from './BrandPage.tsx'
import './styles.css'
import './compute.css'
import './brand.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrandPage />
  </StrictMode>,
)
