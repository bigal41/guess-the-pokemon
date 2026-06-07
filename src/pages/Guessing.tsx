import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import GameScreenShell from '../components/GameScreenShell'
import GameStatsBar from '../components/GameStatsBar/GameStatsBar.tsx'
import PokemonArtPanel from '../components/PokemonArtPanel/PokemonArtPanel.tsx'
import { useGameSession } from '../context/GameSessionContext'

const keyboardRows = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['G', 'H', 'I', 'J', 'K', 'L'],
  ['M', 'N', 'O', 'P', 'Q', 'R'],
  ['S', 'T', 'U', 'V', 'W', 'X'],
  ['Y', 'Z'],
]

const letterPattern = /[A-Z]/

function createPuzzleCharacters(puzzleLabel: string) {
  const occurrences = new Map<string, number>()

  return puzzleLabel.split('').map((character) => {
    const nextCount = (occurrences.get(character) ?? 0) + 1
    occurrences.set(character, nextCount)

    return {
      character,
      key: `${character}-${nextCount}`,
    }
  })
}

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

  const puzzleCharacters = createPuzzleCharacters(puzzleLabel)

  return (
    <GameScreenShell
      cardClassName="items-center px-4 py-4"
      contentClassName="max-w-xl"
    >
      <GameStatsBar
        items={[
          { label: 'streak', value: session.currentStreak },
          { label: 'best', value: session.bestStreak },
          { label: 'lives', value: `${session.remainingLives}/6` },
        ]}
      />

      <p className="mt-3 font-nunito text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 sm:mt-4 sm:text-sm">
        Who&apos;s that Pokemon?
      </p>

      <PokemonArtPanel
        alt="Silhouetted Pokemon"
        imageClassName="brightness-0 drop-shadow-[0_10px_0_rgba(0,0,0,0.18)] sm:h-44 sm:w-44"
        panelClassName="bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(255,224,224,0.9)_55%,_rgba(255,188,188,0.9))] sm:h-56"
        src={currentPokemon.image}
      />

      <div className="mt-4 flex max-w-md flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:mt-6">
        {puzzleCharacters.map(({ character, key }) => {
          const isLetter = letterPattern.test(character)
          const isRevealed =
            !isLetter || session.guessedLetters.includes(character)

          return (
            <span
              className="flex min-w-6 justify-center border-b-4 border-neutral-900 pb-1 font-nunito text-lg font-black uppercase text-neutral-900 sm:min-w-8 sm:pb-2 sm:text-2xl"
              key={key}
            >
              {isRevealed ? character : ''}
            </span>
          )
        })}
      </div>

      <div className="mt-3 flex min-h-5 items-center justify-center font-nunito text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 sm:text-sm">
        {session.wrongLetters.length > 0
          ? `Misses: ${session.wrongLetters.join(' ')}`
          : 'No misses yet'}
      </div>

      <div className="mt-4 flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-2 sm:mt-6 sm:gap-3">
        {keyboardRows.map((row) => (
          <div className="flex justify-center gap-2" key={row.join('')}>
            {row.map((letter) => {
              const wasCorrect = session.guessedLetters.includes(letter)
              const wasWrong = session.wrongLetters.includes(letter)

              return (
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 font-nunito text-lg font-black text-neutral-50 shadow-sm transition hover:scale-[1.03] hover:bg-primary-600 disabled:scale-100 disabled:bg-neutral-200 disabled:text-neutral-400 sm:h-12 sm:w-12 sm:text-xl"
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
        <p className="font-nunito text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600 sm:text-sm">
          Pick letters before you run out of lives
        </p>

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

export default Guessing
