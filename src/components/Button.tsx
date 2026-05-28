interface ButtonProps {
  text: string
  onClick?: () => void
  disabled?: boolean
}

const Button = ({ text, onClick, disabled = false }: ButtonProps) => {
  return (
    <button
      className="mt-4 h-12 w-full rounded-xl bg-pkmn-red px-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-50 sm:mt-5 sm:h-14 sm:text-base"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  )
}

export default Button
