type GameStatItem = {
  label: string
  value: string | number
}

type GameStatsBarProps = {
  items: GameStatItem[]
}

function GameStatsBar({ items }: GameStatsBarProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3 font-nunito text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
      {items.map((item) => (
        <span key={item.label}>
          {item.label} {item.value}
        </span>
      ))}
    </div>
  )
}

export default GameStatsBar
