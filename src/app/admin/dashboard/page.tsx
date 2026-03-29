'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Users, DollarSign, BookOpen, Settings,
  LogOut, Bell, ChevronRight, BarChart3, MapPin
} from 'lucide-react'
import { BRANCHES, ACCESS_LEVELS } from '@/lib/constants'

function Sidebar() {
  const { data: session } = useSession()
  const roles: any[] = (session?.user as any)?.roles || []
  const maxLevel = roles.length > 0 ? Math.max(...roles.map((r: any) => r.access_level)) : 0

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3, minLevel: 1 },
    { href: '/admin/members', label: 'Members', icon: Users, minLevel: 5 },
    { href: '/admin/finance', label: 'Finance', icon: DollarSign, minLevel: 4 },
    { href: '/admin/users', label: 'User Management', icon: Settings, minLevel: 7 },
    { href: '/admin/audit-log', label: 'Audit Log', icon: BookOpen, minLevel: 7 },
  ].filter(item => maxLevel >= item.minLevel)

  return (
    <aside className="w-64 bg-primary-dark text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white font-heading font-bold text-lg">W</span>
          </div>
          <div>
            <p className="font-heading font-bold text-sm">Word of Life</p>
            <p className="text-xs text-accent">Admin Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-accent/30 rounded-full flex items-center justify-center text-sm font-bold">
            {session?.user?.name?.[0] || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const roles: any[] = (session?.user as any)?.roles || []
  const maxLevel = roles.length > 0 ? Math.max(...roles.map((r: any) => r.access_level)) : 0

  const stats = [
    { label: 'Total Members', value: '—', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'This Month Income', value: '—', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Active Branches', value: '5', icon: MapPin, color: 'bg-purple-100 text-purple-600' },
    { label: 'New Members', value: '—', icon: Users, color: 'bg-orange-100 text-orange-600' },
  ]

  const quickLinks = [
    { label: 'Add Member', href: '/admin/members/new', show: maxLevel >= 5 },
    { label: 'Finance Entry', href: '/admin/finance/new', show: maxLevel >= 4 },
    { label: 'Create User', href: '/admin/users/new', show: maxLevel >= 7 },
    { label: 'View Audit Log', href: '/admin/audit-log', show: maxLevel >= 7 },
    { label: 'View All Members', href: '/admin/members', show: maxLevel >= 5 },
    { label: 'Finance Reports', href: '/admin/finance', show: maxLevel >= 4 },
  ].filter(l => l.show)

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold">
              Welcome back, {session.user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('en-FJ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Bell size={22} className="text-gray-400 cursor-pointer hover:text-primary" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        {quickLinks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="font-heading font-bold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-4 py-3 rounded-lg bg-neutral-50 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium"
                >
                  {link.label}
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Branches Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg mb-4">Branches Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {BRANCHES.map((branch) => (
              <div key={branch.name} className="text-center p-4 rounded-lg bg-neutral-50">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin size={18} className="text-primary" />
                </div>
                <p className="font-semibold text-sm">{branch.name}</p>
                <p className="text-xs text-gray-500 mt-1">{branch.serviceTime}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
