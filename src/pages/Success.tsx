import { Navigate, useNavigate } from 'react-router'
import GameScreenShell from '../components/GameScreenShell'
import GameStatsBar from '../components/GameStatsBar/GameStatsBar.tsx'
import PokemonArtPanel from '../components/PokemonArtPanel/PokemonArtPanel.tsx'
import { useGameSession } from '../context/GameSessionContext'

function Success() {
  const navigate = useNavigate()
  const { continueGame, currentPokemon, resetSession, session } =
    useGameSession()

  if (!session || !currentPokemon) {
    return <Navigate replace to="/home" />
  }

  if (session.roundStatus === 'playing') {
    return <Navigate replace to="/guessing-game" />
  }

  const didWin = session.roundStatus === 'won'
  const dexEntry =
    currentPokemon.dexEntry ??
    'Dex entry unavailable until the Pokemon data is regenerated.'
  const dexNumber = currentPokemon.dexNumber ?? currentPokemon.id

  const handleContinue = () => {
    const result = continueGame()

    if (result === 'completed') {
      navigate('/pokedex-complete')
      return
    }

    if (result !== 'continued') {
      return
    }

    navigate('/guessing-game')
  }

  const handleBackHome = () => {
    resetSession()
    navigate('/home')
  }

  return (
    <GameScreenShell
      cardClassName="items-center px-4 py-4 text-center"
      contentClassName="max-w-xl"
    >
      <GameStatsBar
        items={[
          { label: 'result', value: didWin ? 'correct' : 'missed' },
          { label: 'streak', value: session.currentStreak },
          { label: 'best', value: session.bestStreak },
        ]}
      />

      <p className="mt-3 font-nunito text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:mt-4 sm:text-sm">
        {didWin ? 'Pokemon caught' : 'Pokemon missed'}
      </p>

      <PokemonArtPanel
        alt={currentPokemon.displayName}
        imageClassName="drop-shadow-[0_10px_0_rgba(0,0,0,0.12)]"
        panelClassName="bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(255,236,214,0.92)_58%,_rgba(255,203,203,0.92))] sm:h-52"
        src={currentPokemon.image}
      />

      <div className="mt-4 flex flex-col items-center gap-1 sm:mt-6 sm:gap-2">
        <p className="font-nunito text-[11px] font-black uppercase tracking-[0.24em] text-primary-600 sm:text-xs">
          #{dexNumber.toString().padStart(3, '0')}
        </p>
        <h1 className="font-nunito text-2xl font-black uppercase text-neutral-900 sm:text-4xl">
          {currentPokemon.displayName}
        </h1>
      </div>

      <p className="mt-4 max-h-28 max-w-lg overflow-hidden font-nunito text-sm leading-6 text-neutral-700 sm:mt-6 sm:max-h-36 sm:text-base sm:leading-7">
        {dexEntry}
      </p>

      <div className="mt-4 flex flex-1 flex-col items-center justify-end gap-2 sm:mt-6 sm:gap-3">
        <button
          className="inline-flex h-11 items-center justify-center rounded-xl bg-secondary-900 px-6 font-nunito text-xs font-black uppercase tracking-[0.18em] text-secondary-50 transition hover:bg-secondary-800 sm:h-12 sm:text-sm"
          onClick={handleContinue}
          type="button"
        >
          {didWin && session.packCompleted
            ? 'complete pokedex'
            : didWin
              ? 'next pokemon'
              : 'start next run'}
        </button>

        <button
          className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600 sm:text-sm"
          onClick={handleBackHome}
          type="button"
        >
          back to home
        </button>
      </div>
    </GameScreenShell>
  )
}

export default Success
