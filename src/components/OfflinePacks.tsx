import {
  CheckCircle2,
  Download,
  LoaderCircle,
  Trash2,
  WifiOff,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { pokemonPacks } from '../data/pokemon-packs'
import {
  deletePokemonPack,
  downloadPokemonPack,
  getDownloadedPacks,
  isPackDownloaded,
  type OfflinePackProgress,
  subscribeToOfflinePackUpdates,
} from '../lib/offline-packs'
import Badge from './Badge/Badge.tsx'

type ActiveOperation =
  | {
      type: 'download'
      packId: string
    }
  | {
      type: 'delete'
      packId: string
    }

function OfflinePacks() {
  const [isLoading, setIsLoading] = useState(true)
  const [downloadedPackIds, setDownloadedPackIds] = useState<string[]>([])
  const [activeOperation, setActiveOperation] =
    useState<ActiveOperation | null>(null)
  const [progressByPackId, setProgressByPackId] = useState<
    Record<string, OfflinePackProgress>
  >({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const sync = () => {
      setDownloadedPackIds(getDownloadedPacks().map((pack) => pack.packId))
    }

    sync()
    setIsLoading(false)

    return subscribeToOfflinePackUpdates(sync)
  }, [])

  const downloadedPackSet = useMemo(
    () => new Set(downloadedPackIds),
    [downloadedPackIds],
  )

  const refreshDownloadedPacks = () => {
    setDownloadedPackIds(getDownloadedPacks().map((pack) => pack.packId))
  }

  const handleDownload = async (packId: string) => {
    const pack = pokemonPacks.find((candidate) => candidate.id === packId)

    if (!pack) {
      return
    }

    setErrorMessage(null)
    setActiveOperation({ type: 'download', packId })

    try {
      await downloadPokemonPack(pack, (progress) => {
        setProgressByPackId((current) => ({
          ...current,
          [packId]: progress,
        }))
      })

      refreshDownloadedPacks()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to download the pack.',
      )
    } finally {
      setActiveOperation(null)
    }
  }

  const handleDelete = async (packId: string) => {
    setErrorMessage(null)
    setActiveOperation({ type: 'delete', packId })

    try {
      await deletePokemonPack(packId)
      setProgressByPackId((current) => {
        const next = { ...current }
        delete next[packId]
        return next
      })
      refreshDownloadedPacks()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to delete the pack.',
      )
    } finally {
      setActiveOperation(null)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-neutral-50/92 p-6 shadow-lg">
        <p className="text-sm font-semibold uppercase text-neutral-600">
          Loading offline packs...
        </p>
      </div>
    )
  }

  return (
    <section className="w-full max-w-3xl rounded-2xl bg-neutral-50/92 p-6 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-nunito text-2xl font-bold uppercase text-neutral-900">
            Offline Packs
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Download only the generations you want to keep available offline.
          </p>
        </div>
        <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase text-neutral-700">
          {downloadedPackIds.length}/{pokemonPacks.length} ready
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700">
          {errorMessage}
        </div>
      ) : null}

      <ul className="mt-6 grid gap-3">
        {pokemonPacks.map((pack) => {
          const downloaded =
            downloadedPackSet.has(pack.id) || isPackDownloaded(pack.id)
          const progress = progressByPackId[pack.id]
          const isDownloading =
            activeOperation?.type === 'download' &&
            activeOperation.packId === pack.id
          const isDeleting =
            activeOperation?.type === 'delete' &&
            activeOperation.packId === pack.id
          const isBusy = activeOperation !== null

          return (
            <li
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
              key={pack.id}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900">{pack.name}</p>
                    {downloaded ? (
                      <Badge
                        icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                        size="regular"
                        tone="success"
                      >
                        Offline Ready
                      </Badge>
                    ) : (
                      <Badge
                        icon={<WifiOff className="h-3.5 w-3.5" />}
                        size="regular"
                        tone="muted"
                      >
                        Not Downloaded
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    #{pack.startId} - #{pack.endId}
                  </p>
                  {isDownloading && progress ? (
                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-neutral-200">
                        <div
                          className="h-2 rounded-full bg-primary-500 transition-all"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase text-neutral-600">
                        {progress.completed}/{progress.total} cached (
                        {progress.percent}%)
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  {downloaded ? (
                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold uppercase text-neutral-700 transition-colors hover:border-primary-400 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isBusy}
                      onClick={() => void handleDelete(pack.id)}
                      type="button"
                    >
                      {isDeleting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </button>
                  ) : (
                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold uppercase text-neutral-50 transition-opacity hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isBusy}
                      onClick={() => void handleDownload(pack.id)}
                      type="button"
                    >
                      {isDownloading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Download
                    </button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default OfflinePacks
