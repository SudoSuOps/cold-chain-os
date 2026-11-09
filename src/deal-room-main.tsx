import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DealRoomPage from './DealRoomPage.tsx'
import './styles.css'
import './compute.css'
import './datasets.css'
import './why.css'
import './dealroom.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DealRoomPage />
  </StrictMode>,
)
