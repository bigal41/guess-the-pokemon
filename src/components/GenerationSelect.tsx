import type { PackProgress } from '../lib/game-progress'
import { pokemonPacks } from '../data/pokemon-packs'
import OfflineReadyBadge from './OfflineReadyBadge'

type GenerationSelectProps = {
  selectedPackId: string | null
  selectedPackProgress: PackProgress | null
  selectedPackHasRun: boolean
  onSelectPack: (packId: string) => void
}

function GenerationSelect({
  selectedPackId,
  selectedPackProgress,
  selectedPackHasRun,
  onSelectPack,
}: GenerationSelectProps) {
  const selectedPack =
    pokemonPacks.find((pack) => pack.id === selectedPackId) ?? null

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-nunito text-sm font-bold uppercase tracking-[0.18em] text-slate-700 sm:text-base">
          Choose Generation
        </h2>
        {selectedPackId ? <OfflineReadyBadge packId={selectedPackId} /> : null}
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Choose generation</span>
        <select
          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 font-nunito text-sm font-bold uppercase tracking-[0.14em] text-slate-900 outline-none transition focus:border-pkmn-red/60 sm:text-base"
          onChange={(event) => onSelectPack(event.target.value)}
          value={selectedPackId ?? ''}
        >
          <option disabled value="">
            Select a generation
          </option>
          {pokemonPacks.map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 rounded-xl border border-white/70 bg-white/55 px-4 py-3 text-left">
        <div className="flex items-center justify-between gap-3">
          <p className="font-nunito text-sm font-bold uppercase tracking-[0.12em] text-slate-900 sm:text-base">
            {selectedPack ? selectedPack.name : 'No generation selected'}
          </p>
          <div className="flex items-center gap-2">
            {selectedPack && selectedPackHasRun ? (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700 sm:text-[11px]">
                in progress
              </span>
            ) : null}
            {selectedPack && selectedPackProgress?.completedOnce ? (
              <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-[11px]">
                completed
              </span>
            ) : null}
          </div>
        </div>
        <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
          {selectedPack
            ? `National Dex #${selectedPack.startId} to #${selectedPack.endId}`
            : 'Pick a generation to start a run'}
        </p>
        {selectedPack ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-sm">
            Best streak {selectedPackProgress?.bestStreak ?? 0}
          </p>
        ) : null}
        {selectedPack && selectedPackProgress?.fewestAttemptsToClear !== null ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-sm">
            Fewest attempts {selectedPackProgress?.fewestAttemptsToClear ?? 0}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default GenerationSelect
