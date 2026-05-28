import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import pokeballIcon from '../assets/pokeball-icon.svg'
import Button from '../components/Button'
import GenerationSelect from '../components/GenerationSelect'
import { useGameSession } from '../context/GameSessionContext'
import {
  isPackDownloaded,
  subscribeToOfflinePackUpdates,
} from '../lib/offline-packs'

function Home() {
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )
  const [selectedPackDownloaded, setSelectedPackDownloaded] = useState(false)
  const navigate = useNavigate()
  const { getPackProgress, hasPackRun, resetPackRun, startGame } = useGameSession()
  const selectedPackProgress = selectedPackId
    ? getPackProgress(selectedPackId)
    : null
  const selectedPackHasRun = selectedPackId ? hasPackRun(selectedPackId) : false
  const startButtonText = selectedPackHasRun ? 'resume run' : 'start game'
  const canStartSelectedPack =
    !!selectedPackId && (isOnline || selectedPackDownloaded)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!selectedPackId) {
      setSelectedPackDownloaded(false)
      return
    }

    const sync = () => {
      setSelectedPackDownloaded(isPackDownloaded(selectedPackId))
    }

    sync()
    return subscribeToOfflinePackUpdates(sync)
  }, [selectedPackId])

  const handleStartGame = () => {
    if (!selectedPackId || !canStartSelectedPack) {
      return
    }

    const didStart = startGame(selectedPackId)

    if (!didStart) {
      return
    }

    navigate('/guessing-game')
  }

  const handleResetRun = () => {
    if (!selectedPackId) {
      return
    }

    resetPackRun(selectedPackId)
  }

  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-splash px-4 py-4">
      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <img
          src={pokeballIcon}
          alt="Vite logo"
          className="h-24 w-24 sm:h-28 sm:w-28"
        />
        <h1 className="mt-4 max-w-[11rem] text-center text-balance font-nunito text-3xl leading-none font-black uppercase text-white sm:max-w-none sm:text-4xl">
        guess the pokemon
        </h1>
        <div className="mt-5 w-full rounded-[1.75rem] bg-white/88 p-4 shadow-lg sm:mt-6 sm:p-5">
          <GenerationSelect
            selectedPackId={selectedPackId}
            selectedPackProgress={selectedPackProgress}
            selectedPackHasRun={selectedPackHasRun}
            onSelectPack={setSelectedPackId}
          />
          <Button
            text={startButtonText}
            onClick={handleStartGame}
            disabled={!canStartSelectedPack}
          />
          {selectedPackId && !canStartSelectedPack ? (
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Download this pack or go online to play it
            </p>
          ) : null}
          {selectedPackHasRun ? (
            <Button
              text="reset run"
              onClick={handleResetRun}
              tone="secondary"
            />
          ) : null}
          <Link
            className="mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-pkmn-red sm:mt-4 sm:text-sm"
            to="/offline-packs"
          >
            manage offline packs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
