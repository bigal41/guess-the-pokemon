import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import UpdatePrompt from './components/UpdatePrompt.tsx'
import { GameSessionProvider } from './context/GameSessionContext.tsx'
import './index.css'
import Guessing from './pages/Guessing.tsx'
import Home from './pages/Home.tsx'
import OfflinePacksPage from './pages/OfflinePacksPage.tsx'
import PokedexComplete from './pages/PokedexComplete.tsx'
import Success from './pages/Success.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

function AppShell() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
      return
    }

    let isRefreshing = false
    let intervalId: number | undefined
    const hadControllerAtLoad = !!navigator.serviceWorker.controller

    const handleControllerChange = () => {
      if (isRefreshing) {
        return
      }

      isRefreshing = true
      window.location.reload()
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')

        const promptForUpdate = () => {
          if (hadControllerAtLoad && registration.waiting) {
            setWaitingWorker(registration.waiting)
            setShowUpdatePrompt(true)
          }
        }

        promptForUpdate()

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing

          if (!installingWorker) {
            return
          }

          installingWorker.addEventListener('statechange', () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              promptForUpdate()
            }
          })
        })

        intervalId = window.setInterval(() => {
          void registration.update()
        }, 60 * 60 * 1000)
      } catch {
        setWaitingWorker(null)
      }
    }

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      handleControllerChange,
    )
    void registerServiceWorker()

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId)
      }

      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        handleControllerChange,
      )
    }
  }, [])

  const handleUpdate = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    setShowUpdatePrompt(false)
  }

  return (
    <>
      <Routes>
        <Route index element={<App />} />
        <Route path="home" element={<Home />} />
        <Route path="guessing-game" element={<Guessing />} />
        <Route path="pokedex-complete" element={<PokedexComplete />} />
        <Route path="reveal" element={<Success />} />
        <Route path="offline-packs" element={<OfflinePacksPage />} />
      </Routes>
      <UpdatePrompt
        onDismiss={() => setShowUpdatePrompt(false)}
        onUpdate={handleUpdate}
        visible={showUpdatePrompt}
      />
    </>
  )
}

createRoot(rootElement).render(
  <StrictMode>
    <GameSessionProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </GameSessionProvider>
  </StrictMode>,
)
