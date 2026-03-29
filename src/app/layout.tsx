import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Word of Life Fiji',
  description: 'Word of Life Christian Church - Fiji Islands. Join us across our 5 branches: Sabeto, Dreketi, Lau, Suva, and Taveuni.',
  keywords: ['church', 'fiji', 'word of life', 'christian', 'worship'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
