import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 🔧 DEV MODE - Remove em produção
// Carrega mocks somente quando habilitado via VITE_ENABLE_DEV_MODE
import './utils/devMode'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
