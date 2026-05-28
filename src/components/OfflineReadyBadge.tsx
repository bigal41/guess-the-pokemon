import { useEffect, useState } from 'react'
import {
  isPackDownloaded,
  subscribeToOfflinePackUpdates,
} from '../lib/offline-packs'

type OfflineReadyBadgeProps = {
  packId: string
}

function OfflineReadyBadge({ packId }: OfflineReadyBadgeProps) {
  const [ready, setReady] = useState(() => isPackDownloaded(packId))

  useEffect(() => {
    const sync = () => {
      setReady(isPackDownloaded(packId))
    }

    sync()

    return subscribeToOfflinePackUpdates(sync)
  }, [packId])

  if (!ready) {
    return null
  }

  return (
    <span className="rounded-full bg-green-100/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-green-700 sm:text-[11px]">
      offline ready
    </span>
  )
}

export default OfflineReadyBadge
