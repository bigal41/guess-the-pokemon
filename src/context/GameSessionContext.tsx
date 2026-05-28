import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { GameProgress, GameRuns, PackProgress } from '../lib/game-progress'
import {
  createDefaultPackProgress,
  loadGameProgress,
  loadGameRuns,
  saveGameProgress,
  saveGameRuns,
} from '../lib/game-progress'
import type { Pokemon } from '../types/pokemon'
import {
  createSessionState,
  getPackPokemon,
  getPokemonById,
  getPuzzleLabel,
  getRandomPokemon,
  isPuzzleSolved,
  type GameSessionState,
} from '../lib/game-session'

type ContinueGameResult = 'continued' | 'completed' | 'failed'

type GameSessionContextValue = {
  session: GameSessionState | null
  currentPokemon: Pokemon | null
  puzzleLabel: string
  progressByPack: GameProgress
  startGame: (packId: string) => boolean
  guessLetter: (letter: string) => void
  continueGame: () => ContinueGameResult
  resetSession: () => void
  getPackProgress: (packId: string) => PackProgress
}

const GameSessionContext = createContext<GameSessionContextValue | null>(null)

function GameSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GameSessionState | null>(null)
  const [progressByPack, setProgressByPack] = useState<GameProgress>(() =>
    loadGameProgress(),
  )
  const [runsByPack, setRunsByPack] = useState<GameRuns>(() => loadGameRuns())

  const currentPokemon = session ? getPokemonById(session.pokemonId) : null
  const puzzleLabel = currentPokemon ? getPuzzleLabel(currentPokemon) : ''

  const getPackProgress = useCallback(
    (packId: string) => progressByPack[packId] ?? createDefaultPackProgress(),
    [progressByPack],
  )

  useEffect(() => {
    saveGameProgress(progressByPack)
  }, [progressByPack])

  useEffect(() => {
    saveGameRuns(runsByPack)
  }, [runsByPack])

  const startGame = useCallback(
    (packId: string) => {
      const packPokemon = getPackPokemon(packId)
      const packProgress = progressByPack[packId] ?? createDefaultPackProgress()
      const existingRun = runsByPack[packId]
      const remainingPokemon = existingRun
        ? packPokemon.filter(
            (pokemon) => !existingRun.clearedPokemonIds.includes(pokemon.id),
          )
        : packPokemon
      const shouldStartFreshRun = !!existingRun && remainingPokemon.length === 0
      const nextPokemon = getRandomPokemon(
        shouldStartFreshRun ? packPokemon : remainingPokemon,
      )

      if (!nextPokemon) {
        return false
      }

      const startedAt =
        existingRun && !shouldStartFreshRun ? existingRun.startedAt : Date.now()
      const attempts =
        existingRun && !shouldStartFreshRun ? existingRun.attempts : 1
      const clearedPokemonIds =
        existingRun && !shouldStartFreshRun ? existingRun.clearedPokemonIds : []

      if (!existingRun || shouldStartFreshRun) {
        setRunsByPack((currentRuns) => ({
          ...currentRuns,
          [packId]: {
            clearedPokemonIds,
            attempts,
            startedAt,
          },
        }))
      }

      setSession(
        createSessionState(packId, nextPokemon.id, {
          attempts,
          bestStreak: packProgress.bestStreak,
          clearedPokemonIds,
          startedAt,
        }),
      )

      return true
    },
    [progressByPack, runsByPack],
  )

  const guessLetter = useCallback((letter: string) => {
    setSession((currentSession) => {
      if (!currentSession || currentSession.roundStatus !== 'playing') {
        return currentSession
      }

      if (
        currentSession.guessedLetters.includes(letter) ||
        currentSession.wrongLetters.includes(letter)
      ) {
        return currentSession
      }

      const pokemon = getPokemonById(currentSession.pokemonId)

      if (!pokemon) {
        return currentSession
      }

      const currentPuzzleLabel = getPuzzleLabel(pokemon)
      const isCorrectLetter = currentPuzzleLabel.includes(letter)
      const guessedLetters = isCorrectLetter
        ? [...currentSession.guessedLetters, letter]
        : currentSession.guessedLetters
      const wrongLetters = isCorrectLetter
        ? currentSession.wrongLetters
        : [...currentSession.wrongLetters, letter]
      const remainingLives = isCorrectLetter
        ? currentSession.remainingLives
        : currentSession.remainingLives - 1

      if (isPuzzleSolved(currentPuzzleLabel, guessedLetters)) {
        const currentStreak = currentSession.currentStreak + 1
        const clearedPokemonIds = Array.from(
          new Set([...currentSession.clearedPokemonIds, currentSession.pokemonId]),
        )
        const packPokemon = getPackPokemon(currentSession.packId)
        const packCompleted = clearedPokemonIds.length >= packPokemon.length
        const bestStreak = Math.max(currentSession.bestStreak, currentStreak)

        setProgressByPack((currentProgress) => {
          const existingProgress =
            currentProgress[currentSession.packId] ?? createDefaultPackProgress()
          const clearDurationMs = Date.now() - currentSession.startedAt

          return {
            ...currentProgress,
            [currentSession.packId]: {
              completedOnce: existingProgress.completedOnce || packCompleted,
              bestStreak: Math.max(existingProgress.bestStreak, bestStreak),
              fastestClearMs: packCompleted
                ? existingProgress.fastestClearMs === null
                  ? clearDurationMs
                  : Math.min(existingProgress.fastestClearMs, clearDurationMs)
                : existingProgress.fastestClearMs,
              fewestAttemptsToClear: packCompleted
                ? existingProgress.fewestAttemptsToClear === null
                  ? currentSession.attempts
                  : Math.min(
                      existingProgress.fewestAttemptsToClear,
                      currentSession.attempts,
                    )
                : existingProgress.fewestAttemptsToClear,
              totalClears: packCompleted
                ? existingProgress.totalClears + 1
                : existingProgress.totalClears,
            },
          }
        })

        setRunsByPack((currentRuns) => {
          if (packCompleted) {
            const { [currentSession.packId]: _removedRun, ...remainingRuns } =
              currentRuns
            return remainingRuns
          }

          return {
            ...currentRuns,
            [currentSession.packId]: {
              clearedPokemonIds,
              attempts: currentSession.attempts,
              startedAt: currentSession.startedAt,
            },
          }
        })

        return {
          ...currentSession,
          guessedLetters,
          wrongLetters,
          remainingLives,
          roundStatus: 'won',
          currentStreak,
          bestStreak,
          clearedPokemonIds,
          packCompleted,
        }
      }

      if (remainingLives <= 0) {
        return {
          ...currentSession,
          guessedLetters,
          wrongLetters,
          remainingLives: 0,
          roundStatus: 'lost',
          currentStreak: 0,
        }
      }

      return {
        ...currentSession,
        guessedLetters,
        wrongLetters,
        remainingLives,
      }
    })
  }, [])

  const continueGame = useCallback(() => {
    if (!session) {
      return 'failed'
    }

    if (session.packCompleted) {
      return 'completed'
    }

    let result: ContinueGameResult = 'failed'

    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession
      }

      if (currentSession.packCompleted) {
        result = 'completed'
        return currentSession
      }

      const packPokemon = getPackPokemon(currentSession.packId)
      const remainingPokemon = packPokemon.filter(
        (pokemon) => !currentSession.clearedPokemonIds.includes(pokemon.id),
      )
      const nextPokemon = getRandomPokemon(
        remainingPokemon.length > 0 ? remainingPokemon : packPokemon,
        currentSession.pokemonId,
      )

      if (!nextPokemon) {
        return currentSession
      }

      const nextAttempts = currentSession.attempts + 1

      setRunsByPack((currentRuns) => ({
        ...currentRuns,
        [currentSession.packId]: {
          clearedPokemonIds: currentSession.clearedPokemonIds,
          attempts: nextAttempts,
          startedAt: currentSession.startedAt,
        },
      }))

      result = 'continued'

      return createSessionState(currentSession.packId, nextPokemon.id, {
        attempts: nextAttempts,
        bestStreak: currentSession.bestStreak,
        clearedPokemonIds: currentSession.clearedPokemonIds,
        currentStreak: currentSession.currentStreak,
        startedAt: currentSession.startedAt,
      })
    })

    return result
  }, [session])

  const resetSession = useCallback(() => {
    setSession(null)
  }, [])

  const value = useMemo<GameSessionContextValue>(
    () => ({
      session,
      currentPokemon,
      puzzleLabel,
      progressByPack,
      startGame,
      guessLetter,
      continueGame,
      resetSession,
      getPackProgress,
    }),
    [
      continueGame,
      currentPokemon,
      getPackProgress,
      guessLetter,
      puzzleLabel,
      progressByPack,
      resetSession,
      session,
      startGame,
    ],
  )

  return (
    <GameSessionContext.Provider value={value}>
      {children}
    </GameSessionContext.Provider>
  )
}

function useGameSession() {
  const context = useContext(GameSessionContext)

  if (!context) {
    throw new Error('useGameSession must be used within a GameSessionProvider')
  }

  return context
}

export { GameSessionProvider, useGameSession }
