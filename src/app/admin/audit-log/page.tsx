'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BookOpen, Shield } from 'lucide-react'

const ACTION_COLORS: Record<string, string> = {
  user_created: 'bg-green-100 text-green-700',
  user_updated: 'bg-blue-100 text-blue-700',
  user_deleted: 'bg-red-100 text-red-700',
  member_created: 'bg-green-100 text-green-700',
  member_updated: 'bg-blue-100 text-blue-700',
  finance_entry_created: 'bg-purple-100 text-purple-700',
  finance_entry_updated: 'bg-blue-100 text-blue-700',
  login: 'bg-gray-100 text-gray-600',
}

export default function AuditLogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/audit-log')
      .then(r => r.json())
      .then(data => { setLogs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 bg-primary-dark" />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-primary" size={24} />
          <div>
            <h1 className="text-2xl font-heading font-bold">Audit Log</h1>
            <p className="text-gray-500 text-sm">Immutable record of all admin actions</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-sm text-amber-700">
          <strong>Security Notice:</strong> The audit log is immutable. All entries are permanent and cannot be edited or deleted.
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <BookOpen size={40} className="mb-3 opacity-30" />
              <p>No audit log entries yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Time</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Action</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 hidden md:table-cell">Table</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 hidden lg:table-cell">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600'}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-600 capitalize">
                      {log.table_name || '—'}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-600">
                      {log.changed_by || '—'}
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
