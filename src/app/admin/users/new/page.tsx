'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react'
import { BRANCHES } from '@/lib/constants'

const ROLE_OPTIONS = [
  { level: 1, label: 'Musician' },
  { level: 2, label: 'Ministry Leader' },
  { level: 3, label: 'Media Team' },
  { level: 4, label: 'Finance Admin' },
  { level: 5, label: 'Branch Admin', requiresBranch: true },
  { level: 6, label: 'Global Admin' },
  { level: 7, label: 'Super Admin' },
]

export default function NewUserPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<{ level: number; branchId: string }[]>([])
  const [branches, setBranches] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
    fetch('/api/branches').then(r => r.json()).then(setBranches).catch(() => {})
  }, [status, router])

  const toggleRole = (level: number) => {
    setSelectedRoles(prev =>
      prev.find(r => r.level === level)
        ? prev.filter(r => r.level !== level)
        : [...prev, { level, branchId: '' }]
    )
  }

  const setBranchForRole = (level: number, branchId: string) => {
    setSelectedRoles(prev => prev.map(r => r.level === level ? { ...r, branchId } : r))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const body = {
      email: formData.get('email'),
      name: formData.get('name'),
      password: formData.get('password'),
      roles: selectedRoles.map(r => ({ access_level: r.level, branch_id: r.branchId || null })),
    }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      router.push('/admin/users')
    } else {
      const err = await res.json()
      setError(err.error || 'Failed to create user')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 bg-primary-dark" />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/users" className="text-gray-500 hover:text-primary"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-heading font-bold">Create New User</h1>
            <p className="text-gray-500 text-sm">User will receive a temporary password to set on first login</p>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="max-w-xl">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="font-heading font-bold text-lg border-b pb-3">Account Details</h2>
            <div>
              <label className="label-text">Full Name *</label>
              <input name="name" required className="input-field" placeholder="Full name" />
            </div>
            <div>
              <label className="label-text">Email Address *</label>
              <input type="email" name="email" required className="input-field" placeholder="email@example.com" />
            </div>
            <div>
              <label className="label-text">Temporary Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={8}
                  className="input-field pr-12"
                  placeholder="Minimum 8 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">User will be prompted to change this on first login.</p>
            </div>

            <h2 className="font-heading font-bold text-lg border-b pb-3 pt-2">Assign Roles</h2>
            <div className="space-y-3">
              {ROLE_OPTIONS.map(opt => {
                const isSelected = selectedRoles.some(r => r.level === opt.level)
                return (
                  <div key={opt.level}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRole(opt.level)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="font-medium text-sm">{opt.label}</span>
                    </label>
                    {isSelected && opt.requiresBranch && (
                      <select
                        className="input-field mt-2 ml-7 !py-2 text-sm"
                        onChange={e => setBranchForRole(opt.level, e.target.value)}
                      >
                        <option value="">Select branch...</option>
                        {branches.map((b: any) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <Link href="/admin/users" className="btn-outline">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  )
}
