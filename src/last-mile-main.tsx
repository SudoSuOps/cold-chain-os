import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LastMilePage from './LastMilePage.tsx'
import './styles.css'
import './compute.css'
import './datasets.css'
import './why.css'
import './brand.css'
import './lastmile.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LastMilePage />
  </StrictMode>,
)
