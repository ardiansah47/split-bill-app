import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AnimatedRoutes } from '@/components/AnimatedRoutes'
import { Toaster } from '@/components/ui/sonner'

// Dismiss splash screen after React mounts
function dismissSplash() {
  const splash = document.getElementById('splash')
  if (splash) {
    splash.classList.add('hide')
    splash.addEventListener('transitionend', () => splash.remove(), { once: true })
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/split-bill-app">
      <AnimatedRoutes />
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  </StrictMode>,
)

// Wait for minimum splash duration (progress bar animation), then dismiss
setTimeout(dismissSplash, 1500)
