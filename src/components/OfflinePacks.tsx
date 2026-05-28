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
      <div className="rounded-2xl bg-white/90 p-6 shadow-lg">
        <p className="text-sm font-semibold uppercase text-slate-600">
          Loading offline packs...
        </p>
      </div>
    )
  }

  return (
    <section className="w-full max-w-3xl rounded-2xl bg-white/90 p-6 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-nunito text-2xl font-bold uppercase text-slate-900">
            Offline Packs
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Download only the generations you want to keep available offline.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
          {downloadedPackIds.length}/{pokemonPacks.length} ready
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
              className="rounded-2xl border border-slate-200 bg-white p-4"
              key={pack.id}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{pack.name}</p>
                    {downloaded ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Offline Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        <WifiOff className="h-3.5 w-3.5" />
                        Not Downloaded
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    #{pack.startId} - #{pack.endId}
                  </p>
                  {isDownloading && progress ? (
                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-pkmn-red transition-all"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase text-slate-600">
                        {progress.completed}/{progress.total} cached (
                        {progress.percent}%)
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  {downloaded ? (
                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold uppercase text-slate-700 transition-colors hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="inline-flex items-center gap-2 rounded-md bg-pkmn-red px-3 py-2 text-sm font-semibold uppercase text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
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
