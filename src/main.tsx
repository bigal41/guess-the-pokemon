import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js')
  })
}

createRoot(rootElement).render(
  <StrictMode>
    <GameSessionProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
          <Route path="home" element={<Home />} />
          <Route path="guessing-game" element={<Guessing />} />
          <Route path="pokedex-complete" element={<PokedexComplete />} />
          <Route path="reveal" element={<Success />} />
          <Route path="offline-packs" element={<OfflinePacksPage />} />
        </Routes>
      </BrowserRouter>
    </GameSessionProvider>
  </StrictMode>,
)
