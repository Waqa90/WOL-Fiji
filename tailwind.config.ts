import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1B3A5C', light: '#2A5A8C', dark: '#0F2440' },
        accent: { DEFAULT: '#C5A55A', light: '#D4BA7A', dark: '#A88B3D' },
        neutral: { 50: '#F8F7F4', 100: '#F0EDE6', 200: '#E0DAC9', 800: '#2D2D2D', 900: '#1A1A1A' },
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
