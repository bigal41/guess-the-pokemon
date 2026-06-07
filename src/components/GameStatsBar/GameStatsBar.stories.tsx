import type { Meta, StoryObj } from '@storybook/react-vite'
import GameStatsBar from './GameStatsBar.tsx'

const meta = {
  title: 'Components/GameStatsBar',
  component: GameStatsBar,
  args: {
    items: [
      { label: 'streak', value: 7 },
      { label: 'best', value: 14 },
      { label: 'lives', value: '4/6' },
    ],
  },
} satisfies Meta<typeof GameStatsBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
