import { useEffect, useState } from 'react'
import {
  isPackDownloaded,
  subscribeToOfflinePackUpdates,
} from '../lib/offline-packs'
import Badge from './Badge/Badge.tsx'

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

  return <Badge tone="success">offline ready</Badge>
}

export default OfflineReadyBadge
