import type { Meta, StoryObj } from '@storybook/react-vite'
import abraImage from '../../assets/pokemon/abra.png'
import abraDarkImage from '../../assets/pokemon/abra_dark.png'
import PokemonArtPanel from './PokemonArtPanel.tsx'

const meta = {
  title: 'Components/PokemonArtPanel',
  component: PokemonArtPanel,
  args: {
    alt: 'Abra',
    src: abraImage,
    panelClassName:
      'bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(255,236,214,0.92)_58%,_rgba(255,203,203,0.92))] sm:h-52',
  },
} satisfies Meta<typeof PokemonArtPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Revealed: Story = {}

export const Silhouette: Story = {
  args: {
    alt: 'Silhouetted Pokemon',
    imageClassName:
      'brightness-0 drop-shadow-[0_10px_0_rgba(0,0,0,0.18)] sm:h-44 sm:w-44',
    panelClassName:
      'bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(255,224,224,0.9)_55%,_rgba(255,188,188,0.9))] sm:h-56',
    src: abraDarkImage,
  },
}
