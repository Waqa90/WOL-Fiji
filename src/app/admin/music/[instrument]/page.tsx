'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Music, Upload, Trash2, AlertCircle, Save } from 'lucide-react'
import { uploadToBlob } from '@/lib/blob'

interface Musician {
  id: string
  name: string
  photo_url?: string
  bio?: string
  instrument_specialty?: string
  video_url?: string
  lyrics_text?: string
}

const INSTRUMENT_MAP: { [key: string]: string } = {
  bass: 'Bass',
  guitar: 'Guitar',
  drums: 'Drums',
  keyboard: 'Keyboard',
  trumpet: 'Trumpet',
  flute: 'Flute',
  singers: 'Singers',
  'sound-engineer': 'Sound Engineer',
}

export default function InstrumentPage() {
  const params = useParams()
  const { data: session } = useSession()
  const instrumentSlug = params.instrument as string
  const instrumentName = INSTRUMENT_MAP[instrumentSlug] || instrumentSlug

  const [musicians, setMusicians] = useState<Musician[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state for editing
  const [formData, setFormData] = useState<{
    [key: string]: { video_url?: string; lyrics_text?: string }
  }>({})

  useEffect(() => {
    fetchMusicians()
  }, [instrumentSlug])

  const fetchMusicians = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/musicians?instrument=${instrumentName}`)
      if (!response.ok) throw new Error('Failed to fetch musicians')

      const data: Musician[] = await response.json()
      setMusicians(data)

      // Initialize form data
      const initialFormData: typeof formData = {}
      data.forEach((m) => {
        initialFormData[m.id] = {
          video_url: m.video_url,
          lyrics_text: m.lyrics_text,
        }
      })
      setFormData(initialFormData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load musicians')
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpload = async (musicianId: string, file: File) => {
    try {
      setUploading(musicianId)
      setError(null)

      if (file.type.split('/')[0] !== 'video') {
        throw new Error('Please select a video file')
      }

      const videoUrl = await uploadToBlob(file, 'musicians/videos')
      setFormData((prev) => ({
        ...prev,
        [musicianId]: { ...prev[musicianId], video_url: videoUrl },
      }))

      setSuccess('Video uploaded successfully')
      setTimeout(() => setSuccess(null), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video')
    } finally {
      setUploading(null)
    }
  }

  const handleLyricsChange = (musicianId: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      [musicianId]: { ...prev[musicianId], lyrics_text: text },
    }))
  }

  const handleSaveMusician = async (musicianId: string) => {
    try {
      setUploading(musicianId)
      setError(null)

      const data = formData[musicianId]
      const response = await fetch('/api/musicians', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: musicianId,
          video_url: data.video_url || null,
          lyrics_text: data.lyrics_text || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }

      setSuccess('Musician updated successfully')
      setEditingId(null)
      setTimeout(() => setSuccess(null), 2000)
      await fetchMusicians()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setUploading(null)
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">{instrumentName} Lab</h1>
        <p className="text-gray-600">Manage practice materials for {instrumentName} players</p>
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

      {/* Musicians Grid */}
      {musicians.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Music className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No {instrumentName} players found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {musicians.map((musician) => {
            const isEditing = editingId === musician.id
            const data = formData[musician.id] || {}

            return (
              <div key={musician.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
                {/* Musician Header */}
                <div className="flex items-start gap-4 mb-6">
                  {musician.photo_url ? (
                    <Image
                      src={musician.photo_url}
                      alt={musician.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Music className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-heading font-bold text-neutral-900">{musician.name}</h2>
                    <p className="text-sm text-gray-600">{instrumentName}</p>
                  </div>
                </div>

                {/* Video Section */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg border">
                  <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                    <Music size={18} />
                    Practice Video
                  </h3>

                  {!isEditing && data.video_url ? (
                    <video
                      controls
                      src={data.video_url}
                      className="w-full rounded-lg bg-black mb-3 max-h-64"
                    />
                  ) : isEditing ? (
                    <div className="space-y-3">
                      {data.video_url && (
                        <div className="relative rounded-lg overflow-hidden bg-black">
                          <video src={data.video_url} className="w-full max-h-48" controls />
                          <button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                [musician.id]: { ...prev[musician.id], video_url: undefined },
                              }))
                            }
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded hover:bg-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                      <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition">
                        <Upload size={18} />
                        <span className="text-sm">Upload Video</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          disabled={uploading === musician.id}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleVideoUpload(musician.id, file)
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No video uploaded</p>
                  )}
                </div>

                {/* Lyrics Section */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg border">
                  <h3 className="font-semibold text-neutral-800 mb-3">Lyrics</h3>

                  {isEditing ? (
                    <textarea
                      value={data.lyrics_text || ''}
                      onChange={(e) => handleLyricsChange(musician.id, e.target.value)}
                      placeholder="Paste lyrics here..."
                      className="input-field font-mono text-sm"
                      rows={6}
                    />
                  ) : data.lyrics_text ? (
                    <div className="bg-white p-3 rounded border text-sm whitespace-pre-wrap font-mono text-gray-700 max-h-48 overflow-y-auto">
                      {data.lyrics_text}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No lyrics uploaded</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveMusician(musician.id)}
                        disabled={uploading === musician.id}
                        className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/5 font-semibold transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingId(musician.id)}
                      className="flex-1 btn-primary"
                    >
                      Edit Materials
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
