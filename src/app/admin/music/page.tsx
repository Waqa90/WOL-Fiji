'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar, Users, Music, Save, AlertCircle } from 'lucide-react'

interface Musician {
  id: string
  name: string
  instrument_specialty: string
}

interface Roster {
  id: string
  schedule_type: 'saturday_practice' | 'sunday_service'
  schedule_date: string
  musicians: string[]
  songs: string[]
  notes: string
}

export default function MusicHomePage() {
  const { data: session } = useSession()
  const [musicians, setMusicians] = useState<Musician[]>([])
  const [saturdayRoster, setSaturdayRoster] = useState<Roster | null>(null)
  const [sundayRoster, setSundayRoster] = useState<Roster | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [saturdayDate, setSaturdayDate] = useState('')
  const [saturdayMusicians, setSaturdayMusicians] = useState<string[]>([])
  const [saturdaySongs, setSaturdaySongs] = useState('')
  const [saturdayNotes, setSaturdayNotes] = useState('')

  const [sundayDate, setSundayDate] = useState('')
  const [sundayMusicians, setSundayMusicians] = useState<string[]>([])
  const [sundaySongs, setSundaySongs] = useState('')
  const [sundayNotes, setSundayNotes] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch musicians
      const musicianRes = await fetch('/api/musicians')
      if (!musicianRes.ok) throw new Error('Failed to fetch musicians')
      const musicianData = await musicianRes.json()
      setMusicians(musicianData)

      // Fetch today's rosters
      const today = new Date().toISOString().split('T')[0]
      const rosterRes = await fetch(`/api/music-roster?branch_id=${(session?.user as any)?.branch_id || ''}`)
      if (!rosterRes.ok) throw new Error('Failed to fetch rosters')
      const rosterData = await rosterRes.json()

      // Find Saturday and Sunday rosters
      const saturday = rosterData.find((r: Roster) => r.schedule_type === 'saturday_practice')
      const sunday = rosterData.find((r: Roster) => r.schedule_type === 'sunday_service')

      if (saturday) {
        setSaturdayRoster(saturday)
        setSaturdayDate(saturday.schedule_date)
        setSaturdayMusicians(saturday.musicians || [])
        setSaturdaySongs((saturday.songs || []).join(', '))
        setSaturdayNotes(saturday.notes || '')
      }

      if (sunday) {
        setSundayRoster(sunday)
        setSundayDate(sunday.schedule_date)
        setSundayMusicians(sunday.musicians || [])
        setSundaySongs((sunday.songs || []).join(', '))
        setSundayNotes(sunday.notes || '')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRoster = async (type: 'saturday_practice' | 'sunday_service') => {
    try {
      setSaving(true)
      setError(null)

      const date = type === 'saturday_practice' ? saturdayDate : sundayDate
      const musicianIds = type === 'saturday_practice' ? saturdayMusicians : sundayMusicians
      const songsStr = type === 'saturday_practice' ? saturdaySongs : sundaySongs
      const notes = type === 'saturday_practice' ? saturdayNotes : sundayNotes
      const roster = type === 'saturday_practice' ? saturdayRoster : sundayRoster

      if (!date) {
        setError('Please select a date')
        return
      }

      const songs = songsStr
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      const payload = {
        id: roster?.id || null,
        schedule_type: type,
        schedule_date: date,
        musicians: musicianIds,
        songs,
        notes: notes || null,
        branch_id: (session?.user as any)?.branch_id,
      }

      const response = await fetch('/api/music-roster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save roster')
      }

      setSuccess(`${type === 'saturday_practice' ? 'Saturday Practice' : 'Sunday Service'} roster updated!`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <Music className="w-8 h-8 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">Music Roster Management</h1>
        <p className="text-gray-600">Manage your Saturday practice and Sunday service rosters</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✓ {success}
        </div>
      )}

      {/* Saturday Practice */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-heading font-bold">Saturday Practice</h2>
          <span className="text-sm text-gray-500 ml-auto">9:30 AM - 1:00 PM</span>
        </div>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="label-text mb-2">Date</label>
            <input
              type="date"
              value={saturdayDate}
              onChange={(e) => setSaturdayDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Musicians */}
          <div>
            <label className="label-text mb-2">Select Musicians</label>
            <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
              {musicians.length === 0 ? (
                <p className="text-gray-500 text-sm">No musicians found</p>
              ) : (
                musicians.map((musician) => (
                  <label key={musician.id} className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={saturdayMusicians.includes(musician.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSaturdayMusicians([...saturdayMusicians, musician.id])
                        } else {
                          setSaturdayMusicians(saturdayMusicians.filter((id) => id !== musician.id))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <p className="font-medium text-sm">{musician.name}</p>
                      <p className="text-xs text-gray-500">{musician.instrument_specialty}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">{saturdayMusicians.length} musicians selected</p>
          </div>

          {/* Songs */}
          <div>
            <label className="label-text mb-2">Songs to Practice (comma-separated)</label>
            <textarea
              value={saturdaySongs}
              onChange={(e) => setSaturdaySongs(e.target.value)}
              placeholder="e.g. Amazing Grace, Jesus Loves Me, How Great Thou Art"
              className="input-field"
              rows={3}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="label-text mb-2">Notes</label>
            <textarea
              value={saturdayNotes}
              onChange={(e) => setSaturdayNotes(e.target.value)}
              placeholder="Additional notes for the practice session..."
              className="input-field"
              rows={2}
            />
          </div>

          <button
            onClick={() => handleSaveRoster('saturday_practice')}
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Saturday Practice'}
          </button>
        </div>
      </div>

      {/* Sunday Service */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-accent">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-heading font-bold">Sunday Service</h2>
          <span className="text-sm text-gray-500 ml-auto">2:00 PM - 5:00 PM</span>
        </div>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="label-text mb-2">Date</label>
            <input
              type="date"
              value={sundayDate}
              onChange={(e) => setSundayDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Musicians */}
          <div>
            <label className="label-text mb-2">Select Musicians</label>
            <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
              {musicians.length === 0 ? (
                <p className="text-gray-500 text-sm">No musicians found</p>
              ) : (
                musicians.map((musician) => (
                  <label key={musician.id} className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={sundayMusicians.includes(musician.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSundayMusicians([...sundayMusicians, musician.id])
                        } else {
                          setSundayMusicians(sundayMusicians.filter((id) => id !== musician.id))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <div>
                      <p className="font-medium text-sm">{musician.name}</p>
                      <p className="text-xs text-gray-500">{musician.instrument_specialty}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">{sundayMusicians.length} musicians selected</p>
          </div>

          {/* Songs */}
          <div>
            <label className="label-text mb-2">Songs for Service (comma-separated)</label>
            <textarea
              value={sundaySongs}
              onChange={(e) => setSundaySongs(e.target.value)}
              placeholder="e.g. Holy Forever, Goodness of God, Hosanna"
              className="input-field"
              rows={3}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="label-text mb-2">Notes</label>
            <textarea
              value={sundayNotes}
              onChange={(e) => setSundayNotes(e.target.value)}
              placeholder="Additional notes for the service..."
              className="input-field"
              rows={2}
            />
          </div>

          <button
            onClick={() => handleSaveRoster('sunday_service')}
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Sunday Service'}
          </button>
        </div>
      </div>
    </div>
  )
}
