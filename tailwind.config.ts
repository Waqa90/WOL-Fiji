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
        accent: { DEFAULT: '#F4B860', light: '#F7C878', dark: '#D89E4A' },
        secondary: { DEFAULT: '#FF6B6B', light: '#FF8888', dark: '#E55555' },
        tertiary: { DEFAULT: '#00D4AA', light: '#20E5B8', dark: '#00B899' },
        neutral: { 50: '#F8F7F4', 100: '#F0EDE6', 200: '#E0DAC9', 800: '#2D2D2D', 900: '#1A1A1A' },
        cream: '#FFF9E6',
        paleBlue: '#E3F2FF',
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
