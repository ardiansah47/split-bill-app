import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AnimatedRoutes } from '@/components/AnimatedRoutes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/split-bill-app">
      <AnimatedRoutes />
    </BrowserRouter>
  </StrictMode>,
)
