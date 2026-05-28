import type { PokemonPack } from '../data/pokemon-packs'

const OFFLINE_PACKS_STORAGE_KEY = 'pokemon-offline-packs'
const OFFLINE_PACKS_UPDATED_EVENT = 'offline-packs-updated'

export type OfflinePackProgress = {
  completed: number
  total: number
  percent: number
}

export type DownloadedPokemonPack = {
  packId: string
  cacheName: string
  downloadedAt: string
  total: number
}

type DownloadedPackMap = Record<string, DownloadedPokemonPack>

const getCacheName = (packId: string) => `pokemon-pack-${packId}`

const toPokemonImageUrl = (pokemonId: number) => `/pokemon/${pokemonId}.png`

const emitOfflinePacksUpdated = () => {
  window.dispatchEvent(new CustomEvent(OFFLINE_PACKS_UPDATED_EVENT))
}

const readDownloadedPackMap = (): DownloadedPackMap => {
  const rawValue = window.localStorage.getItem(OFFLINE_PACKS_STORAGE_KEY)

  if (!rawValue) {
    return {}
  }

  try {
    const parsed = JSON.parse(rawValue)

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return Object.entries(parsed).reduce<DownloadedPackMap>(
      (accumulator, [key, value]) => {
        if (
          value &&
          typeof value === 'object' &&
          typeof value.packId === 'string' &&
          typeof value.cacheName === 'string' &&
          typeof value.downloadedAt === 'string' &&
          typeof value.total === 'number'
        ) {
          accumulator[key] = value as DownloadedPokemonPack
        }

        return accumulator
      },
      {},
    )
  } catch {
    return {}
  }
}

const writeDownloadedPackMap = (packMap: DownloadedPackMap) => {
  window.localStorage.setItem(
    OFFLINE_PACKS_STORAGE_KEY,
    JSON.stringify(packMap),
  )
  emitOfflinePacksUpdated()
}

const updateProgress = (
  onProgress: ((progress: OfflinePackProgress) => void) | undefined,
  completed: number,
  total: number,
) => {
  onProgress?.({
    completed,
    total,
    percent: total === 0 ? 100 : Math.round((completed / total) * 100),
  })
}

export const isPackDownloaded = (packId: string): boolean =>
  Boolean(readDownloadedPackMap()[packId])

export const getDownloadedPacks = (): DownloadedPokemonPack[] =>
  Object.values(readDownloadedPackMap()).sort((left, right) =>
    left.packId.localeCompare(right.packId),
  )

export const subscribeToOfflinePackUpdates = (
  callback: () => void,
): (() => void) => {
  const handleChange = () => callback()

  window.addEventListener(OFFLINE_PACKS_UPDATED_EVENT, handleChange)
  window.addEventListener('storage', handleChange)

  return () => {
    window.removeEventListener(OFFLINE_PACKS_UPDATED_EVENT, handleChange)
    window.removeEventListener('storage', handleChange)
  }
}

export const downloadPokemonPack = async (
  pack: PokemonPack,
  onProgress?: (progress: OfflinePackProgress) => void,
): Promise<DownloadedPokemonPack> => {
  const total = pack.endId - pack.startId + 1
  const cacheName = getCacheName(pack.id)
  const cache = await caches.open(cacheName)
  let completed = 0

  updateProgress(onProgress, completed, total)

  try {
    for (
      let pokemonId = pack.startId;
      pokemonId <= pack.endId;
      pokemonId += 1
    ) {
      const url = toPokemonImageUrl(pokemonId)
      const cachedResponse = await cache.match(url)

      if (!cachedResponse) {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to download ${url} (${response.status})`)
        }

        await cache.put(url, response.clone())
      }

      completed += 1
      updateProgress(onProgress, completed, total)
    }

    const downloadedPack: DownloadedPokemonPack = {
      packId: pack.id,
      cacheName,
      downloadedAt: new Date().toISOString(),
      total,
    }

    const packMap = readDownloadedPackMap()
    packMap[pack.id] = downloadedPack
    writeDownloadedPackMap(packMap)

    return downloadedPack
  } catch (error) {
    await caches.delete(cacheName)
    throw error
  }
}

export const deletePokemonPack = async (packId: string): Promise<void> => {
  await caches.delete(getCacheName(packId))

  const packMap = readDownloadedPackMap()
  delete packMap[packId]
  writeDownloadedPackMap(packMap)
}
