import pokemonData from '../data/pokemon.json'
import { pokemonPacks } from '../data/pokemon-packs'
import type { Pokemon } from '../types/pokemon'

export const MAX_LIVES = 6

export type RoundStatus = 'playing' | 'won' | 'lost'

export type GameSessionState = {
  packId: string
  pokemonId: number
  guessedLetters: string[]
  wrongLetters: string[]
  remainingLives: number
  roundStatus: RoundStatus
  currentStreak: number
  bestStreak: number
  clearedPokemonIds: number[]
  packCompleted: boolean
  attempts: number
  startedAt: number
}

const letterPattern = /[A-Z]/
const safePuzzlePattern = /^[A-Z0-9 .'-]+$/

const allPokemon = pokemonData as Pokemon[]

export function getPackPokemon(packId: string) {
  const pack = pokemonPacks.find((candidate) => candidate.id === packId)

  if (!pack) {
    return []
  }

  return allPokemon.filter(
    (entry) => entry.id >= pack.startId && entry.id <= pack.endId,
  )
}

export function getPokemonById(pokemonId: number) {
  return allPokemon.find((entry) => entry.id === pokemonId) ?? null
}

export function getRandomPokemon(pool: Pokemon[], currentPokemonId?: number) {
  if (pool.length === 0) {
    return null
  }

  if (pool.length === 1) {
    return pool[0]
  }

  let nextPokemon = pool[Math.floor(Math.random() * pool.length)]

  while (nextPokemon.id === currentPokemonId) {
    nextPokemon = pool[Math.floor(Math.random() * pool.length)]
  }

  return nextPokemon
}

export function getPuzzleLabel(pokemon: Pokemon) {
  const displayLabel = pokemon.displayName.toUpperCase()

  if (safePuzzlePattern.test(displayLabel)) {
    return displayLabel
  }

  return (pokemon.aliases[0] ?? pokemon.displayName).toUpperCase()
}

export function getRequiredLetters(puzzleLabel: string) {
  return [...new Set(puzzleLabel.split('').filter((character) => letterPattern.test(character)))]
}

export function isPuzzleSolved(puzzleLabel: string, guessedLetters: string[]) {
  const requiredLetters = getRequiredLetters(puzzleLabel)

  return (
    requiredLetters.length > 0 &&
    requiredLetters.every((character) => guessedLetters.includes(character))
  )
}

export function createSessionState(
  packId: string,
  pokemonId: number,
  options?: {
    attempts?: number
    bestStreak?: number
    clearedPokemonIds?: number[]
    currentStreak?: number
    packCompleted?: boolean
    startedAt?: number
  },
): GameSessionState {
  return {
    packId,
    pokemonId,
    guessedLetters: [],
    wrongLetters: [],
    remainingLives: MAX_LIVES,
    roundStatus: 'playing',
    currentStreak: options?.currentStreak ?? 0,
    bestStreak: options?.bestStreak ?? 0,
    clearedPokemonIds: options?.clearedPokemonIds ?? [],
    packCompleted: options?.packCompleted ?? false,
    attempts: options?.attempts ?? 1,
    startedAt: options?.startedAt ?? Date.now(),
  }
}
