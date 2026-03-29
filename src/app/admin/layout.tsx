import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Portal — Word of Life Fiji',
  description: 'Word of Life Fiji Church Management System',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
