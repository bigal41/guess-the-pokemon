type UpdatePromptProps = {
  onDismiss: () => void
  onUpdate: () => void
  visible: boolean
}

function UpdatePrompt({ onDismiss, onUpdate, visible }: UpdatePromptProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-xl">
        <div className="min-w-0 flex-1">
          <p className="font-nunito text-sm font-black uppercase tracking-[0.16em]">
            Update available
          </p>
          <p className="mt-1 text-xs text-slate-200">
            A newer version is ready to install.
          </p>
        </div>
        <button
          className="rounded-lg bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-900"
          onClick={onUpdate}
          type="button"
        >
          update
        </button>
        <button
          className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300"
          onClick={onDismiss}
          type="button"
        >
          later
        </button>
      </div>
    </div>
  )
}

export default UpdatePrompt
