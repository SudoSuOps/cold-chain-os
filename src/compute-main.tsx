import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ComputePage from './ComputePage.tsx'
import './styles.css'
import './compute.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComputePage />
  </StrictMode>,
)
