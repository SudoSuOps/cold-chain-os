import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NewEraPage from './NewEraPage.tsx'
import './styles.css'
import './compute.css'
import './datasets.css'
import './why.css'
import './lastmile.css'
import './newera.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NewEraPage />
  </StrictMode>,
)
