import type { ReactNode } from 'react'

type GameScreenShellProps = {
  children: ReactNode
  cardClassName?: string
  contentClassName?: string
  shellClassName?: string
  useCard?: boolean
}

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

function GameScreenShell({
  children,
  cardClassName,
  contentClassName,
  shellClassName,
  useCard = true,
}: GameScreenShellProps) {
  const content = useCard ? (
    <div
      className={joinClasses(
        'flex h-full max-h-[52rem] w-full flex-col rounded-[2rem] bg-neutral-50/92 shadow-lg shadow-black/10',
        cardClassName,
      )}
    >
      {children}
    </div>
  ) : (
    children
  )

  return (
    <div
      className={joinClasses(
        'flex h-dvh items-center justify-center overflow-hidden bg-splash px-3 py-3',
        shellClassName,
      )}
    >
      <div className={joinClasses('w-full', contentClassName)}>{content}</div>
    </div>
  )
}

export default GameScreenShell
