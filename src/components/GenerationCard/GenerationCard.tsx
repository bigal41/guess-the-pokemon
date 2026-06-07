import {PackStatus} from "../../constants/pack-status.ts";
import {PackProgress} from "../../lib/game-progress.ts";

type GenerationCardProps = {
  name: string,
  status: PackStatus,
  stats: PackProgress
}
function GenerationCard({name, status, stats}: GenerationCardProps) {
  return (
    <div>{name}{status.toUpperCase()}{stats.bestStreak}</div>
  )
}

export default GenerationCard
