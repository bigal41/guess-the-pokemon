import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import '../src/index.css'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const localStorageEntries =
        (context.parameters.localStorage as Record<string, string | null>) ?? {}

      for (const [key, value] of Object.entries(localStorageEntries)) {
        if (value === null) {
          window.localStorage.removeItem(key)
          continue
        }

        window.localStorage.setItem(key, value)
      }

      return (
        <MemoryRouter>
          <div className="min-h-screen bg-splash p-6">
            <Story />
          </div>
        </MemoryRouter>
      )
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
}

export default preview
