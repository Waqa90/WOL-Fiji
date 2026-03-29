'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DollarSign, Plus, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react'

export default function FinancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    fetch('/api/finance')
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const income = entries.filter(e => e.entry_type === 'income').reduce((sum, e) => sum + Number(e.amount), 0)
  const expense = entries.filter(e => e.entry_type === 'expense').reduce((sum, e) => sum + Number(e.amount), 0)
  const net = income - expense

  const filtered = activeTab === 'all' ? entries : entries.filter(e => e.entry_type === activeTab)

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 bg-primary-dark" />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold">Finance</h1>
            <p className="text-gray-500 text-sm mt-1">Income & expense tracking</p>
          </div>
          <Link href="/admin/finance/new" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            New Entry
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Total Income</p>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">${income.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Total Expenses</p>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown size={16} className="text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">${expense.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Net</p>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ArrowUpDown size={16} className="text-blue-600" />
              </div>
            </div>
            <p className={`text-2xl font-bold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>${net.toFixed(2)}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'income', 'expense'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize text-sm transition-colors ${
                activeTab === tab ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <DollarSign size={40} className="mb-3 opacity-30" />
              <p>No finance entries yet</p>
              <Link href="/admin/finance/new" className="mt-3 btn-primary text-sm">Add First Entry</Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 hidden md:table-cell">Branch</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600 hidden lg:table-cell">Description</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        entry.entry_type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {entry.entry_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{entry.category}</td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                      {entry.branches?.name || 'General'}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-500 truncate max-w-xs">
                      {entry.description || '—'}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      entry.entry_type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.entry_type === 'income' ? '+' : '-'}${Number(entry.amount).toFixed(2)}
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
