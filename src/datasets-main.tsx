import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DatasetsPage from './DatasetsPage.tsx'
import './styles.css'
import './compute.css'
import './datasets.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DatasetsPage />
  </StrictMode>,
)
