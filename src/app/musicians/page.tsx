'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import { Music } from 'lucide-react'

interface Musician {
  id: string
  name: string
  photo_url?: string
  instrument_specialty?: string
  video_url?: string
  lyrics_text?: string
}

const INSTRUMENTS = [
  'All',
  'Bass',
  'Guitar',
  'Drums',
  'Keyboard',
  'Trumpet',
  'Flute',
  'Singers',
  'Sound Engineer',
]

export default function MusiciansPage() {
  const [musicians, setMusicians] = useState<Musician[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInstrument, setSelectedInstrument] = useState('All')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMusicians()
  }, [])

  const fetchMusicians = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/musicians')
      if (!response.ok) throw new Error('Failed to fetch musicians')
      const data = await response.json()
      setMusicians(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load musicians')
      console.error('Error fetching musicians:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredMusicians = musicians.filter((musician) => {
    if (selectedInstrument === 'All') return true
    return musician.instrument_specialty?.toLowerCase() === selectedInstrument.toLowerCase()
  })

  return (
    <>
      <Header />
      <main>
        {/* Page Header */}
        <section className="section-padding bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="container-max">
            <SectionHeading
              title={`${selectedInstrument === 'All' ? 'Our Musicians' : selectedInstrument + ' Lab'}`}
              subtitle="Meet our talented musicians and singers who lead worship at Word of Life"
            />
          </div>
        </section>

        {/* Instrument Filter Buttons */}
        <section className="section-padding bg-white border-b">
          <div className="container-max">
            <div className="flex flex-wrap gap-3 justify-center">
              {INSTRUMENTS.map((instrument) => (
                <button
                  key={instrument}
                  onClick={() => setSelectedInstrument(instrument)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedInstrument === instrument
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {instrument}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Musicians Grid */}
        <section className="section-padding bg-neutral-50">
          <div className="container-max">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin">
                  <Music className="w-8 h-8 text-primary" />
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : filteredMusicians.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <p className="text-lg">No musicians found for {selectedInstrument === 'All' ? 'this selection' : selectedInstrument}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMusicians.map((musician) => (
                  <div key={musician.id} className="card overflow-hidden hover:shadow-xl transition-all">
                    {/* Musician Image */}
                    {musician.photo_url ? (
                      <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                        <Image
                          src={musician.photo_url}
                          alt={musician.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Music className="w-16 h-16 text-primary/50" />
                      </div>
                    )}

                    {/* Info Section */}
                    <div className="p-4">
                      <h3 className="text-lg font-heading font-bold text-neutral-900 mb-1">
                        {musician.name}
                      </h3>
                      {musician.instrument_specialty && (
                        <p className="text-sm text-primary font-semibold mb-3 uppercase tracking-wider">
                          {musician.instrument_specialty}
                        </p>
                      )}

                      {/* Video & Lyrics Section */}
                      {musician.video_url && (
                        <div className="mt-4 space-y-3 border-t pt-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Practice Video</p>
                            <div className="rounded-lg overflow-hidden bg-gray-100">
                              <video
                                controls
                                className="w-full h-32 object-cover"
                                src={musician.video_url}
                              />
                            </div>
                          </div>

                          {musician.lyrics_text && (
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-2">Lyrics</p>
                              <div className="bg-neutral-100 p-3 rounded-lg max-h-40 overflow-y-auto text-xs text-gray-700 whitespace-pre-wrap font-mono">
                                {musician.lyrics_text}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
