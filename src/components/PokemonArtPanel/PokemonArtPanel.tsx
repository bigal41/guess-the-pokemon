type PokemonArtPanelProps = {
  alt: string
  imageClassName?: string
  panelClassName?: string
  src: string
}

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

function PokemonArtPanel({
  alt,
  imageClassName,
  panelClassName,
  src,
}: PokemonArtPanelProps) {
  return (
    <div
      className={joinClasses(
        'mt-3 flex h-40 w-full items-center justify-center rounded-[2rem] px-4 sm:mt-4',
        panelClassName,
      )}
    >
      <img
        alt={alt}
        className={joinClasses(
          'h-32 w-32 object-contain sm:h-40 sm:w-40',
          imageClassName,
        )}
        src={src}
      />
    </div>
  )
}

export default PokemonArtPanel
