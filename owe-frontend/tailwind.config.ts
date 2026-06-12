import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#1A1A2E',
      },
    },
  },
  plugins: [],
}

export default config