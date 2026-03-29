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
        primary: { DEFAULT: '#0d67a5', light: '#1a7fbf', dark: '#094875' },
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
