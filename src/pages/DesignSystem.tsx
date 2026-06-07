import { Link } from 'react-router'

const colorSteps = [
  950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50,
] as const

const paletteFamilies = [
  {
    baseHex: '#F2483D',
    description: 'Warm red for primary actions and active emphasis.',
    name: 'Primary',
    token: 'primary',
  },
  {
    baseHex: '#4F73B8',
    description:
      'Structured blue support family for depth and secondary emphasis.',
    name: 'Secondary',
    token: 'secondary',
  },
  {
    baseHex: '#E78D33',
    description:
      'Gold-peach accent family for rewards, progress, and highlights.',
    name: 'Tertiary',
    token: 'tertiary',
  },
  {
    baseHex: '#8E7F70',
    description:
      'Warm neutral family for surfaces, text, borders, and disabled states.',
    name: 'Neutral',
    token: 'neutral',
  },
] as const

function getSwatchTextClass(step: (typeof colorSteps)[number]) {
  return step >= 700 ? 'text-neutral-50/78' : 'text-neutral-900/68'
}

function DesignSystem() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_var(--color-neutral-50),_var(--color-primary-50)_38%,_white)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-nunito text-xs font-black uppercase tracking-[0.28em] text-secondary-600">
              Design System
            </p>
            <h1 className="mt-3 max-w-3xl font-nunito text-4xl font-black uppercase leading-none text-neutral-950 sm:text-5xl">
              Core palette
            </h1>
            <p className="mt-4 max-w-2xl font-nunito text-sm leading-6 text-neutral-700 sm:text-base">
              Four custom families with consistent 50-950 steps. This page is
              the working visual reference for the app color system.
            </p>
          </div>
          <Link
            className="inline-flex rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 font-nunito text-xs font-bold uppercase tracking-[0.18em] text-neutral-700 shadow-sm transition hover:border-secondary-300 hover:text-secondary-700"
            to="/home"
          >
            back home
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:mt-10">
          {paletteFamilies.map((family) => (
            <section
              className="overflow-hidden rounded-[1.75rem] border border-neutral-100/80 bg-neutral-50/88 shadow-[0_18px_50px_rgba(26,23,20,0.08)] backdrop-blur-sm"
              key={family.token}
            >
              <div
                className="px-5 py-5 text-neutral-50 sm:px-6 sm:py-6"
                style={{
                  background: `linear-gradient(135deg, var(--color-${family.token}-700), var(--color-${family.token}-500) 58%, var(--color-${family.token}-400))`,
                }}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-nunito text-lg font-black uppercase tracking-[0.14em] sm:text-xl">
                    {family.name}
                  </h2>
                  <span className="font-nunito text-sm font-bold uppercase tracking-[0.12em] text-neutral-50/82">
                    {family.baseHex}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl font-nunito text-sm leading-6 text-neutral-50/82">
                  {family.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11">
                {colorSteps.map((step) => (
                  <div
                    className="flex min-h-24 items-start justify-start px-3 py-3 font-nunito text-xs font-black uppercase tracking-[0.12em] sm:min-h-28"
                    key={step}
                    style={{
                      backgroundColor: `var(--color-${family.token}-${step})`,
                    }}
                  >
                    <span className={getSwatchTextClass(step)}>{step}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DesignSystem
