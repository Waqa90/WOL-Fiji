'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Music, ChevronRight, LogOut } from 'lucide-react'
import { hasRole } from '@/lib/auth'

const INSTRUMENTS = [
  { name: 'Music Home', href: '/admin/music' },
  { name: 'Bass', href: '/admin/music/bass' },
  { name: 'Guitar', href: '/admin/music/guitar' },
  { name: 'Drums', href: '/admin/music/drums' },
  { name: 'Keyboard', href: '/admin/music/keyboard' },
  { name: 'Trumpet', href: '/admin/music/trumpet' },
  { name: 'Flute', href: '/admin/music/flute' },
  { name: 'Singers', href: '/admin/music/singers' },
  { name: 'Sound Engineer', href: '/admin/music/sound-engineer' },
]

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Check if user has musician access (level 1+)
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50">
        <div className="animate-spin">
          <Music className="w-8 h-8 text-primary" />
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session) {
    router.push('/admin')
    return null
  }

  const roles = (session.user as any)?.roles || []
  const hasAccess = hasRole(roles, 1) // Musician level or higher

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50">
        <div className="text-center">
          <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have access to the Music Lab.</p>
          <Link href="/admin/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-neutral-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-primary-dark text-white transition-all duration-300 shadow-lg flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-primary/30 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
            <Music className="w-6 h-6" />
            {sidebarOpen && <span className="font-heading font-bold text-lg">Music Lab</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex p-1 hover:bg-primary rounded transition"
            aria-label="Toggle sidebar"
          >
            <ChevronRight size={18} className={`transition-transform ${!sidebarOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {INSTRUMENTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm hover:bg-primary transition-colors truncate group relative"
              title={item.name}
            >
              <span className={sidebarOpen ? '' : 'text-xs'}>{item.name}</span>
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-primary/30 space-y-3">
          <div className={`text-xs ${sidebarOpen ? '' : 'text-center'}`}>
            <p className="text-gray-300">Logged in as</p>
            <p className="font-semibold truncate">{session.user?.name}</p>
          </div>
          <button
            onClick={() => router.push('/api/auth/signout')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-xs font-semibold"
          >
            <LogOut size={14} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="md:hidden bg-white border-b p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-neutral-100 rounded"
          >
            <Music size={24} className="text-primary" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
