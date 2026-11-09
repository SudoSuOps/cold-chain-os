import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WhyPage from './WhyPage.tsx'
import './styles.css'
import './compute.css'
import './why.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WhyPage />
  </StrictMode>,
)
