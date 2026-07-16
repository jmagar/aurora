import type { Decorator, Preview } from "@storybook/nextjs-vite"

import "../app/globals.css"

const withAuroraTheme: Decorator = (Story) => (
  <div
    className="dark"
    style={{
      minHeight: "100vh",
      background: "var(--aurora-page-bg)",
      color: "var(--aurora-text-primary)",
      padding: 32,
    }}
  >
    <Story />
  </div>
)

const preview: Preview = {
  decorators: [withAuroraTheme],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "error",
    },
  },
}

export default preview
