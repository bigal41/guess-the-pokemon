export type PackProgress = {
  completedOnce: boolean
  bestStreak: number
  fastestClearMs: number | null
  fewestAttemptsToClear: number | null
  totalClears: number
}

export type PackRun = {
  clearedPokemonIds: number[]
  currentStreak: number
  attempts: number
  startedAt: number
}

export type GameProgress = Record<string, PackProgress>
export type GameRuns = Record<string, PackRun>

const PROGRESS_STORAGE_KEY = 'guess-the-pokemon-progress'
const RUNS_STORAGE_KEY = 'guess-the-pokemon-runs'

function isBrowser() {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  )
}

export function createDefaultPackProgress(): PackProgress {
  return {
    completedOnce: false,
    bestStreak: 0,
    fastestClearMs: null,
    fewestAttemptsToClear: null,
    totalClears: 0,
  }
}

function normalizePackProgress(value: unknown): PackProgress {
  if (!value || typeof value !== 'object') {
    return createDefaultPackProgress()
  }

  const candidate = value as Record<string, unknown>

  return {
    completedOnce:
      candidate.completedOnce === true || candidate.completed === true,
    bestStreak:
      typeof candidate.bestStreak === 'number' ? candidate.bestStreak : 0,
    fastestClearMs:
      typeof candidate.fastestClearMs === 'number'
        ? candidate.fastestClearMs
        : null,
    fewestAttemptsToClear:
      typeof candidate.fewestAttemptsToClear === 'number'
        ? candidate.fewestAttemptsToClear
        : null,
    totalClears:
      typeof candidate.totalClears === 'number'
        ? candidate.totalClears
        : candidate.completed === true || candidate.completedOnce === true
          ? 1
          : 0,
  }
}

function normalizePackRun(value: unknown): PackRun | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Record<string, unknown>
  const clearedPokemonIds = Array.isArray(candidate.clearedPokemonIds)
    ? candidate.clearedPokemonIds.filter(
        (entry): entry is number => typeof entry === 'number',
      )
    : []
  const attempts =
    typeof candidate.attempts === 'number' && candidate.attempts > 0
      ? candidate.attempts
      : 1
  const currentStreak =
    typeof candidate.currentStreak === 'number' && candidate.currentStreak >= 0
      ? candidate.currentStreak
      : 0
  const startedAt =
    typeof candidate.startedAt === 'number' ? candidate.startedAt : Date.now()

  return {
    clearedPokemonIds,
    currentStreak,
    attempts,
    startedAt,
  }
}

export function loadGameProgress(): GameProgress {
  if (!isBrowser()) {
    return {}
  }

  const storedValue = window.localStorage.getItem(PROGRESS_STORAGE_KEY)

  if (!storedValue) {
    return {}
  }

  try {
    const parsed = JSON.parse(storedValue) as Record<string, unknown>

    return Object.fromEntries(
      Object.entries(parsed).map(([packId, packProgress]) => [
        packId,
        normalizePackProgress(packProgress),
      ]),
    )
  } catch {
    return {}
  }
}

export function saveGameProgress(progress: GameProgress) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress))
}

export function loadGameRuns(): GameRuns {
  if (!isBrowser()) {
    return {}
  }

  const storedValue = window.localStorage.getItem(RUNS_STORAGE_KEY)

  if (!storedValue) {
    return {}
  }

  try {
    const parsed = JSON.parse(storedValue) as Record<string, unknown>

    return Object.fromEntries(
      Object.entries(parsed)
        .map(
          ([packId, packRun]) => [packId, normalizePackRun(packRun)] as const,
        )
        .filter((entry): entry is [string, PackRun] => entry[1] !== null),
    )
  } catch {
    return {}
  }
}

export function saveGameRuns(runs: GameRuns) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(runs))
}
