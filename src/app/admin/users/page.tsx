'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Plus, Shield, CheckCircle, XCircle } from 'lucide-react'

const ACCESS_LEVEL_NAMES: Record<number, string> = {
  0: 'Public',
  1: 'Musician',
  2: 'Ministry Leader',
  3: 'Media Team',
  4: 'Finance Admin',
  5: 'Branch Admin',
  6: 'Global Admin',
  7: 'Super Admin',
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 bg-primary-dark" />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold">User Management</h1>
            <p className="text-gray-500 text-sm mt-1">{users.length} users registered</p>
          </div>
          <Link href="/admin/users/new" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Create User
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Users size={40} className="mb-3 opacity-30" />
              <p>No users yet</p>
              <Link href="/admin/users/new" className="mt-3 btn-primary text-sm">Create First User</Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">User</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 hidden md:table-cell">Roles</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 hidden lg:table-cell">Last Login</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                          {user.name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-gray-400 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {user.user_roles?.map((role: any) => (
                          <span key={role.access_level} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            <Shield size={10} />
                            {ACCESS_LEVEL_NAMES[role.access_level] || `Level ${role.access_level}`}
                            {role.branches?.name ? ` (${role.branches.name})` : ''}
                          </span>
                        )) || <span className="text-gray-400 text-xs">No roles</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-500">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                          <CheckCircle size={14} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-semibold">
                          <XCircle size={14} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/users/${user.id}`} className="text-primary hover:underline text-sm font-medium">
                        Edit
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
