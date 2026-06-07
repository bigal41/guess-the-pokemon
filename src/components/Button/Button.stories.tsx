import type { Meta, StoryObj } from '@storybook/react-vite'
import Button from './Button.tsx'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    text: 'Start game',
    tone: 'primary',
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: {
    text: 'Reset run',
    tone: 'secondary',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
