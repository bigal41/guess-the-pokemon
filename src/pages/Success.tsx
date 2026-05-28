import { Navigate, useNavigate } from 'react-router'
import { useGameSession } from '../context/GameSessionContext'

function Success() {
  const navigate = useNavigate()
  const { continueGame, currentPokemon, resetSession, session } = useGameSession()

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
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-splash px-3 py-3">
      <div className="flex h-full max-h-[52rem] w-full max-w-xl flex-col items-center rounded-[2rem] bg-white/92 px-4 py-4 text-center shadow-lg shadow-black/10">
        <div className="flex w-full items-center justify-between gap-3 font-nunito text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          <span>result {didWin ? 'correct' : 'missed'}</span>
          <span>streak {session.currentStreak}</span>
          <span>best {session.bestStreak}</span>
        </div>

        <p className="mt-3 font-nunito text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 sm:mt-4 sm:text-sm">
          {didWin ? 'Pokemon caught' : 'Pokemon missed'}
        </p>

        <div className="mt-3 flex h-40 w-full items-center justify-center rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(255,236,214,0.92)_58%,_rgba(255,203,203,0.92))] px-4 sm:mt-4 sm:h-52">
          <img
            alt={currentPokemon.displayName}
            className="h-32 w-32 object-contain drop-shadow-[0_10px_0_rgba(0,0,0,0.12)] sm:h-40 sm:w-40"
            src={currentPokemon.image}
          />
        </div>

        <div className="mt-4 flex flex-col items-center gap-1 sm:mt-6 sm:gap-2">
          <p className="font-nunito text-[11px] font-black uppercase tracking-[0.24em] text-pkmn-red sm:text-xs">
            #{dexNumber.toString().padStart(3, '0')}
          </p>
          <h1 className="font-nunito text-2xl font-black uppercase text-slate-900 sm:text-4xl">
            {currentPokemon.displayName}
          </h1>
        </div>

        <p className="mt-4 max-h-28 overflow-hidden max-w-lg font-nunito text-sm leading-6 text-slate-700 sm:mt-6 sm:max-h-36 sm:text-base sm:leading-7">
          {dexEntry}
        </p>

        <div className="mt-4 flex flex-1 flex-col items-center justify-end gap-2 sm:mt-6 sm:gap-3">
          <button
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 font-nunito text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 sm:h-12 sm:text-sm"
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
            className="text-xs font-semibold uppercase tracking-[0.16em] text-pkmn-red sm:text-sm"
            onClick={handleBackHome}
            type="button"
          >
            back to home
          </button>

        </div>
      </div>
    </div>
  )
}

export default Success
