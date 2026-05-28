import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useGameSession } from '../context/GameSessionContext'

const keyboardRows = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['G', 'H', 'I', 'J', 'K', 'L'],
  ['M', 'N', 'O', 'P', 'Q', 'R'],
  ['S', 'T', 'U', 'V', 'W', 'X'],
  ['Y', 'Z'],
]

const letterPattern = /[A-Z]/

function Guessing() {
  const navigate = useNavigate()
  const { currentPokemon, guessLetter, puzzleLabel, resetSession, session } =
    useGameSession()

  useEffect(() => {
    if (session?.roundStatus === 'won' || session?.roundStatus === 'lost') {
      navigate('/reveal')
    }
  }, [navigate, session?.roundStatus])

  const handleBackHome = () => {
    resetSession()
    navigate('/home')
  }

  if (!session || !currentPokemon) {
    return <Navigate replace to="/home" />
  }

  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-splash px-3 py-3">
      <div className="flex h-full max-h-[52rem] w-full max-w-xl flex-col items-center rounded-[2rem] bg-white/92 px-4 py-4 shadow-lg shadow-black/10">
        <div className="flex w-full items-center justify-between gap-3 font-nunito text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          <span>streak {session.currentStreak}</span>
          <span>best {session.bestStreak}</span>
          <span>lives {session.remainingLives}/6</span>
        </div>

        <p className="mt-3 font-nunito text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 sm:mt-4 sm:text-sm">
          Who&apos;s that Pokemon?
        </p>

        <div className="mt-3 flex h-40 w-full items-center justify-center rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(255,224,224,0.9)_55%,_rgba(255,188,188,0.9))] px-4 sm:mt-4 sm:h-56">
          <img
            alt="Silhouetted Pokemon"
            className="h-32 w-32 object-contain brightness-0 drop-shadow-[0_10px_0_rgba(0,0,0,0.18)] sm:h-44 sm:w-44"
            src={currentPokemon.image}
          />
        </div>

        <div className="mt-4 flex max-w-md flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:mt-6">
          {puzzleLabel.split('').map((character, index) => {
            const isLetter = letterPattern.test(character)
            const isRevealed = !isLetter || session.guessedLetters.includes(character)

            return (
              <span
                className="flex min-w-6 justify-center border-b-4 border-slate-900 pb-1 font-nunito text-lg font-black uppercase text-slate-900 sm:min-w-8 sm:pb-2 sm:text-2xl"
                key={`${character}-${index}`}
              >
                {isRevealed ? character : ''}
              </span>
            )
          })}
        </div>

        <div className="mt-3 flex min-h-5 items-center justify-center font-nunito text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-sm">
          {session.wrongLetters.length > 0
            ? `Misses: ${session.wrongLetters.join(' ')}`
            : 'No misses yet'}
        </div>

        <div className="mt-4 flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-2 sm:mt-6 sm:gap-3">
          {keyboardRows.map((row, rowIndex) => (
            <div className="flex justify-center gap-2" key={`keyboard-row-${rowIndex}`}>
              {row.map((letter) => {
                const wasCorrect = session.guessedLetters.includes(letter)
                const wasWrong = session.wrongLetters.includes(letter)

                return (
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-pkmn-red font-nunito text-lg font-black text-white shadow-sm transition hover:scale-[1.03] disabled:scale-100 disabled:bg-slate-200 disabled:text-slate-400 sm:h-12 sm:w-12 sm:text-xl"
                    disabled={wasCorrect || wasWrong}
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    type="button"
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 text-center sm:mt-6 sm:gap-3">
          <p className="font-nunito text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 sm:text-sm">
            Pick letters before you run out of lives
          </p>

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

export default Guessing
