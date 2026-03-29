'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { BRANCHES, FOLLOW_UP_STATUSES } from '@/lib/constants'

export default function NewMemberPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [branches, setBranches] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
    // Fetch branches from DB
    fetch('/api/branches')
      .then(r => r.json())
      .then(data => setBranches(data))
      .catch(() => {})
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const body = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      branch_id: formData.get('branch_id'),
      join_date: formData.get('join_date'),
      gender: formData.get('gender'),
      is_new_member: formData.get('is_new_member') === 'true',
      follow_up_status: formData.get('follow_up_status'),
      notes: formData.get('notes'),
    }

    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      router.push('/admin/members?success=Member added successfully')
    } else {
      const err = await res.json()
      setError(err.error || 'Failed to create member')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 bg-primary-dark" />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/members" className="text-gray-500 hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold">Add New Member</h1>
            <p className="text-gray-500 text-sm">Register a new member in the branch registry</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="font-heading font-bold text-lg border-b pb-3">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">First Name *</label>
                <input name="first_name" required className="input-field" placeholder="First name" />
              </div>
              <div>
                <label className="label-text">Last Name *</label>
                <input name="last_name" required className="input-field" placeholder="Last name" />
              </div>
              <div>
                <label className="label-text">Email</label>
                <input type="email" name="email" className="input-field" placeholder="email@example.com" />
              </div>
              <div>
                <label className="label-text">Phone</label>
                <input name="phone" className="input-field" placeholder="+679 xxx xxxx" />
              </div>
              <div>
                <label className="label-text">Gender</label>
                <select name="gender" className="input-field">
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label-text">Date of Birth</label>
                <input type="date" name="date_of_birth" className="input-field" />
              </div>
            </div>
            <div>
              <label className="label-text">Address</label>
              <textarea name="address" rows={2} className="input-field" placeholder="Physical address" />
            </div>

            <h2 className="font-heading font-bold text-lg border-b pb-3 pt-2">Church Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Branch *</label>
                <select name="branch_id" required className="input-field">
                  <option value="">Select branch...</option>
                  {branches.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Join Date</label>
                <input type="date" name="join_date" defaultValue={new Date().toISOString().split('T')[0]} className="input-field" />
              </div>
              <div>
                <label className="label-text">Member Type</label>
                <select name="is_new_member" className="input-field">
                  <option value="true">New Member</option>
                  <option value="false">Existing Member</option>
                </select>
              </div>
              <div>
                <label className="label-text">Follow-up Status</label>
                <select name="follow_up_status" className="input-field">
                  {FOLLOW_UP_STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label-text">Notes</label>
              <textarea name="notes" rows={3} className="input-field" placeholder="Any additional notes..." />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              {loading ? 'Saving...' : 'Save Member'}
            </button>
            <Link href="/admin/members" className="btn-outline">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  )
}
