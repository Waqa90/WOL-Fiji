'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Plus, Search, Filter, Download, UserCheck } from 'lucide-react'
import { FOLLOW_UP_STATUSES } from '@/lib/constants'

function getStatusBadge(status: string) {
  const found = FOLLOW_UP_STATUSES.find(s => s.value === status)
  const colorMap: Record<string, string> = {
    not_contacted: 'bg-red-100 text-red-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorMap[status] || 'bg-gray-100 text-gray-600'}`}>
      {found?.label || status}
    </span>
  )
}

export default function MembersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    fetch('/api/members')
      .then(r => r.json())
      .then(data => { setMembers(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = members.filter(m => {
    const name = `${m.first_name} ${m.last_name}`.toLowerCase()
    const matchSearch = search === '' || name.includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === '' || m.follow_up_status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar placeholder - in production use shared layout */}
      <aside className="w-64 bg-primary-dark" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold">Member Registry</h1>
            <p className="text-gray-500 text-sm mt-1">{members.length} total members</p>
          </div>
          <Link href="/admin/members/new" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Member
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="input-field pl-9 !py-2"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="input-field !py-2 md:w-48"
          >
            <option value="">All Statuses</option>
            {FOLLOW_UP_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Users size={40} className="mb-3 opacity-30" />
              <p>{search || filterStatus ? 'No members match your filters' : 'No members yet'}</p>
              {!search && !filterStatus && (
                <Link href="/admin/members/new" className="mt-3 btn-primary text-sm">
                  Add First Member
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 hidden md:table-cell">Branch</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 hidden lg:table-cell">Phone</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 hidden md:table-cell">Joined</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">{member.first_name} {member.last_name}</p>
                          <p className="text-gray-400 text-xs">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                      {member.branches?.name || '—'}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-600">
                      {member.phone || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(member.follow_up_status)}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                      {member.join_date ? new Date(member.join_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/members/${member.id}`}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
