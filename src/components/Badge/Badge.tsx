import type { ReactNode } from 'react'

type BadgeTone = 'success' | 'muted' | 'warning' | 'dark' | 'light'

type BadgeSize = 'compact' | 'regular'

type BadgeProps = {
  children: ReactNode
  icon?: ReactNode
  size?: BadgeSize
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-secondary-100 text-secondary-700',
  muted: 'bg-neutral-100 text-neutral-700',
  warning: 'bg-tertiary-100 text-tertiary-800',
  dark: 'bg-secondary-900 text-secondary-50',
  light: 'bg-neutral-50 text-neutral-700',
}

const sizeClasses: Record<BadgeSize, string> = {
  compact: 'px-2 py-1 text-[10px] tracking-[0.12em] sm:text-[11px]',
  regular: 'px-3 py-1 text-[11px] tracking-[0.12em] sm:text-xs',
}

function Badge({
  children,
  icon,
  size = 'compact',
  tone = 'muted',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase ${sizeClasses[size]} ${toneClasses[tone]}`}
    >
      {icon}
      {children}
    </span>
  )
}

export default Badge
