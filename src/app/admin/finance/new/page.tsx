'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { FINANCE_CATEGORIES } from '@/lib/constants'

export default function NewFinanceEntryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income')
  const [branches, setBranches] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
    fetch('/api/branches').then(r => r.json()).then(setBranches).catch(() => {})
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const body = {
      entry_type: formData.get('entry_type'),
      category: formData.get('category'),
      amount: Number(formData.get('amount')),
      description: formData.get('description'),
      entry_date: formData.get('entry_date'),
      branch_id: formData.get('branch_id') || null,
    }
    const res = await fetch('/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      router.push('/admin/finance')
    } else {
      const err = await res.json()
      setError(err.error || 'Failed to create entry')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 bg-primary-dark" />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/finance" className="text-gray-500 hover:text-primary"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-heading font-bold">New Finance Entry</h1>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="max-w-xl">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            {/* Income/Expense toggle */}
            <div>
              <label className="label-text">Entry Type *</label>
              <div className="flex gap-3">
                {(['income', 'expense'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEntryType(type)}
                    className={`flex-1 py-3 rounded-lg font-semibold capitalize transition-colors ${
                      entryType === type
                        ? type === 'income' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <input type="hidden" name="entry_type" value={entryType} />
            </div>

            <div>
              <label className="label-text">Category *</label>
              <select name="category" required className="input-field">
                {FINANCE_CATEGORIES[entryType].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">Amount (FJD) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                <input type="number" name="amount" step="0.01" min="0.01" required className="input-field pl-8" placeholder="0.00" />
              </div>
            </div>

            <div>
              <label className="label-text">Date *</label>
              <input type="date" name="entry_date" defaultValue={new Date().toISOString().split('T')[0]} required className="input-field" />
            </div>

            <div>
              <label className="label-text">Branch</label>
              <select name="branch_id" className="input-field">
                <option value="">General Fund (All Branches)</option>
                {branches.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">Description</label>
              <textarea name="description" rows={3} className="input-field" placeholder="Optional description..." />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
            <Link href="/admin/finance" className="btn-outline">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  )
}
