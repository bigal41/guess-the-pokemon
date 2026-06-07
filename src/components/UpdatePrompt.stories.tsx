import type { Meta, StoryObj } from '@storybook/react-vite'
import UpdatePrompt from './UpdatePrompt'

const meta = {
  title: 'Components/UpdatePrompt',
  component: UpdatePrompt,
  args: {
    onDismiss: () => {},
    onUpdate: () => {},
    visible: true,
  },
  argTypes: {
    onDismiss: { action: 'dismissed' },
    onUpdate: { action: 'updated' },
  },
} satisfies Meta<typeof UpdatePrompt>

export default meta

type Story = StoryObj<typeof meta>

export const Visible: Story = {}
