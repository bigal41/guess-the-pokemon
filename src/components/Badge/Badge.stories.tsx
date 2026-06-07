import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckCircle2, WifiOff } from 'lucide-react'
import Badge from './Badge.tsx'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: 'offline ready',
    tone: 'success',
    size: 'compact',
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Success: Story = {}

export const Warning: Story = {
  args: {
    children: 'in progress',
    tone: 'warning',
  },
}

export const Dark: Story = {
  args: {
    children: 'completed',
    tone: 'dark',
  },
}

export const WithIcon: Story = {
  args: {
    children: 'offline ready',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    size: 'regular',
  },
}

export const MutedWithIcon: Story = {
  args: {
    children: 'not downloaded',
    icon: <WifiOff className="h-3.5 w-3.5" />,
    size: 'regular',
    tone: 'muted',
  },
}
