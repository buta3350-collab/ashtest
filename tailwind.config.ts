import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black:  '#0d0d10',
        dark:   '#161619',
        dark2:  '#1e1e23',
        mid:    '#2e2e30',
        muted:  '#6e6e73',
        silver: '#c8c8cc',
        red:    '#e30613',
        red2:   '#ff1a27',
      },
      fontFamily: {
        manrope:      ['var(--font-manrope)', 'sans-serif'],
        syncopate:    ['var(--font-syncopate)', 'sans-serif'],
        ethnocentric: ['var(--font-ethnocentric)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
