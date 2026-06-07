import { Link } from 'react-router'
import OfflinePacks from '../components/OfflinePacks'

function OfflinePacksPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-splash px-4 py-10">
      <div className="w-full max-w-3xl">
        <Link
          className="inline-flex text-sm font-semibold uppercase tracking-wide text-neutral-50"
          to="/home"
        >
          back to home
        </Link>
      </div>
      <div className="mt-4 w-full max-w-3xl">
        <OfflinePacks />
      </div>
    </div>
  )
}

export default OfflinePacksPage
