interface ButtonProps {
  text: string
  onClick?: () => void
  disabled?: boolean
  tone?: 'primary' | 'secondary'
}

const Button = ({
  text,
  onClick,
  disabled = false,
  tone = 'primary',
}: ButtonProps) => {
  return (
    <button
      className={`mt-4 h-12 w-full rounded-xl px-4 text-sm font-semibold uppercase tracking-[0.16em] shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-50 sm:mt-5 sm:h-14 sm:text-base ${
        tone === 'primary'
          ? 'bg-pkmn-red text-white'
          : 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200'
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  )
}

export default Button
