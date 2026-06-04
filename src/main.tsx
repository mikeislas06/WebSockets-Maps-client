import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SocketsMapApp from './SocketsMapApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketsMapApp />
  </StrictMode>,
)
