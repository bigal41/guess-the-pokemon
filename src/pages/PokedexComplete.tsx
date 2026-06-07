import { Navigate, useNavigate } from 'react-router'
import Badge from '../components/Badge/Badge.tsx'
import GameScreenShell from '../components/GameScreenShell'
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
    <GameScreenShell
      cardClassName="items-center justify-center px-5 py-6 text-center"
      contentClassName="max-w-xl"
    >
      <p className="font-nunito text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:text-sm">
        Pokedex Complete
      </p>
      <h1 className="mt-4 max-w-xs font-nunito text-3xl font-black uppercase text-neutral-900 sm:text-5xl">
        Generation cleared
      </h1>
      <p className="mt-4 font-nunito text-sm font-semibold uppercase tracking-[0.16em] text-primary-600 sm:text-base">
        {clearedCount} of {totalCount} Pokemon guessed
      </p>
      <p className="mt-4 max-w-md font-nunito text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">
        You completed this dex in {session.attempts} attempts and{' '}
        {formatDuration(clearDuration)}. Your best streak this run was{' '}
        {session.bestStreak}.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Badge size="regular" tone="dark">
          total clears {packProgress.totalClears}
        </Badge>
        {packProgress.fastestClearMs !== null ? (
          <Badge size="regular" tone="light">
            fastest clear {formatDuration(packProgress.fastestClearMs)}
          </Badge>
        ) : null}
        {packProgress.fewestAttemptsToClear !== null ? (
          <Badge size="regular" tone="light">
            fewest attempts {packProgress.fewestAttemptsToClear}
          </Badge>
        ) : null}
      </div>
      <button
        className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-secondary-900 px-6 font-nunito text-sm font-black uppercase tracking-[0.18em] text-secondary-50 transition hover:bg-secondary-800"
        onClick={handleBackHome}
        type="button"
      >
        back to home
      </button>
    </GameScreenShell>
  )
}

export default PokedexComplete
