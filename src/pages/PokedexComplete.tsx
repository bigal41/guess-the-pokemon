import { Navigate, useNavigate } from 'react-router'
import { useGameSession } from '../context/GameSessionContext'
import { getPackPokemon } from '../lib/game-session'

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(1, Math.round(durationMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes === 0) {
    return `${totalSeconds}s`
  }

  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

function PokedexComplete() {
  const navigate = useNavigate()
  const { getPackProgress, resetSession, session } = useGameSession()

  if (!session) {
    return <Navigate replace to="/home" />
  }

  if (!session.packCompleted) {
    return <Navigate replace to="/guessing-game" />
  }

  const clearedCount = session.clearedPokemonIds.length
  const totalCount = getPackPokemon(session.packId).length
  const packProgress = getPackProgress(session.packId)
  const clearDuration = Date.now() - session.startedAt

  const handleBackHome = () => {
    resetSession()
    navigate('/home')
  }

  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-splash px-3 py-3">
      <div className="flex h-full max-h-[52rem] w-full max-w-xl flex-col items-center justify-center rounded-[2rem] bg-white/92 px-5 py-6 text-center shadow-lg shadow-black/10">
        <p className="font-nunito text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 sm:text-sm">
          Pokedex Complete
        </p>
        <h1 className="mt-4 max-w-xs font-nunito text-3xl font-black uppercase text-slate-900 sm:text-5xl">
          Generation cleared
        </h1>
        <p className="mt-4 font-nunito text-sm font-semibold uppercase tracking-[0.16em] text-pkmn-red sm:text-base">
          {clearedCount} of {totalCount} Pokemon guessed
        </p>
        <p className="mt-4 max-w-md font-nunito text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
          You completed this dex in {session.attempts} attempts and{' '}
          {formatDuration(clearDuration)}. Your best streak this run was{' '}
          {session.bestStreak}.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
            total clears {packProgress.totalClears}
          </span>
          {packProgress.fastestClearMs !== null ? (
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700 sm:text-xs">
              fastest clear {formatDuration(packProgress.fastestClearMs)}
            </span>
          ) : null}
          {packProgress.fewestAttemptsToClear !== null ? (
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700 sm:text-xs">
              fewest attempts {packProgress.fewestAttemptsToClear}
            </span>
          ) : null}
        </div>
        <button
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-6 font-nunito text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
          onClick={handleBackHome}
          type="button"
        >
          back to home
        </button>
      </div>
    </div>
  )
}

export default PokedexComplete
