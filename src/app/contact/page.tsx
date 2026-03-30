'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { BRANCHES } from '@/lib/constants'
import { Send, MapPin, Mail, Phone } from 'lucide-react'

export default function ContactPage() {
  const [formType, setFormType] = useState<'contact' | 'prayer'>('contact')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    // TODO: Submit to API
    setSubmitted(true)
  }

  return (
    <>
      <Header />
      <main>
        <Hero
          subtitle="Get in Touch"
          title="Contact Us"
          description="We would love to hear from you. Send us a message or submit a prayer request."
        />

        <section className="section-padding bg-cream">
          <div className="container-max">
            {/* Blue highlight bar */}
            <div className="bg-primary rounded-2xl p-6 mb-10 text-white flex flex-col md:flex-row items-center gap-6 animate-fade-in-down">
              <div className="flex-1 text-center md:text-left">
                <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-1">We are here for you</p>
                <h3 className="text-xl font-heading font-bold">Reach out anytime — prayer, questions, or just to connect.</h3>
              </div>
              <div className="flex gap-6 text-center flex-shrink-0">
                <div>
                  <div className="text-2xl">✉️</div>
                  <div className="text-xs text-blue-200 mt-1">Email us</div>
                </div>
                <div>
                  <div className="text-2xl">🙏</div>
                  <div className="text-xs text-blue-200 mt-1">Prayer</div>
                </div>
                <div>
                  <div className="text-2xl">📍</div>
                  <div className="text-xs text-blue-200 mt-1">Find us</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Form */}
              <div className="lg:col-span-2 animate-fade-in-up">
                {/* Toggle */}
                <div className="flex gap-2 mb-8">
                  <button
                    onClick={() => { setFormType('contact'); setSubmitted(false) }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      formType === 'contact'
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                  >
                    Contact Form
                  </button>
                  <button
                    onClick={() => { setFormType('prayer'); setSubmitted(false) }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      formType === 'prayer'
                        ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                  >
                    Prayer Request
                  </button>
                </div>

                {submitted ? (
                  <div className="card bg-green-50 border border-green-200 text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-green-800 mb-2">
                      {formType === 'contact' ? 'Message Sent!' : 'Prayer Request Submitted!'}
                    </h3>
                    <p className="text-green-600">
                      {formType === 'contact'
                        ? 'Thank you for reaching out. We will get back to you soon.'
                        : 'Thank you for sharing. Our prayer team will lift you up in prayer.'}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 btn-primary"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="label-text">Name {formType === 'prayer' && '(Optional)'}</label>
                        <input
                          type="text"
                          name="name"
                          className="input-field"
                          placeholder="Your name"
                          required={formType === 'contact'}
                        />
                      </div>
                      <div>
                        <label className="label-text">Email {formType === 'prayer' && '(Optional)'}</label>
                        <input
                          type="email"
                          name="email"
                          className="input-field"
                          placeholder="your@email.com"
                          required={formType === 'contact'}
                        />
                      </div>
                    </div>

                    {formType === 'contact' && (
                      <div>
                        <label className="label-text">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          className="input-field"
                          placeholder="What is this regarding?"
                        />
                      </div>
                    )}

                    <div>
                      <label className="label-text">Branch (Optional)</label>
                      <select name="branch" className="input-field">
                        <option value="">Select a branch</option>
                        {BRANCHES.map((b) => (
                          <option key={b.name} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label-text">
                        {formType === 'contact' ? 'Message' : 'Prayer Request'}
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        className="input-field"
                        placeholder={
                          formType === 'contact'
                            ? 'How can we help you?'
                            : 'Share your prayer request. You may remain anonymous.'
                        }
                        required
                      />
                    </div>

                    {formType === 'prayer' && (
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" name="anonymous" className="rounded" />
                        Submit anonymously
                      </label>
                    )}

                    <button type="submit" className="btn-vibrant flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      {formType === 'contact' ? 'Send Message' : 'Submit Prayer Request'}
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <div className="card bg-paleBlue/50">
                  <h3 className="text-xl font-heading font-bold mb-4">Church Information</h3>
                  <div className="space-y-4 text-sm text-gray-600">
                    <p className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-accent mt-0.5" />
                      <span>info@wordoflifefiji.com</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent mt-0.5" />
                      <span>5 branches across Fiji</span>
                    </p>
                  </div>
                </div>

                <div className="card bg-primary text-white">
                  <h3 className="text-xl font-heading font-bold mb-3 text-white">Service Times</h3>
                  <p className="text-blue-100">
                    <span className="text-accent font-semibold">Sunday Worship:</span> 10:00 AM
                  </p>
                  <p className="text-sm text-blue-200 mt-2">All branches</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
