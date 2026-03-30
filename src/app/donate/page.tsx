'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { BRANCHES } from '@/lib/constants'
import { Heart, CreditCard, Shield } from 'lucide-react'

const presetAmounts = [10, 25, 50, 100, 250, 500]

const infoCardColors = [
  { bg: 'bg-accent/10', icon: 'text-accent' },
  { bg: 'bg-primary/10', icon: 'text-primary' },
  { bg: 'bg-tertiary/10', icon: 'text-tertiary' },
]

export default function DonatePage() {
  const [amount, setAmount] = useState<number | ''>('')
  const [customAmount, setCustomAmount] = useState('')

  return (
    <>
      <Header />
      <main>
        <Hero
          subtitle="Support Our Mission"
          title="Give Online"
          description="Your generous giving helps support our ministry across all 5 branches in Fiji. Every gift makes a difference."
        />

        <section className="section-padding bg-paleBlue">
          <div className="container-max">
            <div className="max-w-2xl mx-auto">
              <div className="card border border-gray-100 animate-fade-in-up">
                <h2 className="text-2xl font-heading font-bold mb-6 text-center">Make a Donation</h2>

                {/* Amount Selection */}
                <div className="mb-6">
                  <label className="label-text">Select Amount (FJD)</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => { setAmount(preset); setCustomAmount('') }}
                        className={`py-3 rounded-lg font-semibold transition-all duration-300 ${
                          amount === preset
                            ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="label-text">Or enter custom amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                      <input
                        type="number"
                        min="1"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setAmount('') }}
                        className="input-field pl-8"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                </div>

                {/* Branch Selection */}
                <div className="mb-6">
                  <label className="label-text">Designate to Branch (Optional)</label>
                  <select className="input-field">
                    <option value="">General Fund</option>
                    {BRANCHES.map((b) => (
                      <option key={b.name} value={b.name}>{b.name} Branch</option>
                    ))}
                  </select>
                </div>

                {/* Donor Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="label-text">Your Name (Optional)</label>
                    <input type="text" className="input-field" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="label-text">Email (Optional - for receipt)</label>
                    <input type="email" className="input-field" placeholder="your@email.com" />
                  </div>
                </div>

                {/* Submit */}
                <button className="btn-vibrant w-full flex items-center justify-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5" />
                  Donate ${amount || customAmount || '0'}
                </button>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Secured by Stripe. Your payment information is safe.</span>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { icon: Heart, title: 'Every Gift Matters', desc: 'No amount is too small. God multiplies your generosity.' },
                  { icon: Shield, title: '100% Secure', desc: 'All transactions are encrypted and processed by Stripe.' },
                  { icon: CreditCard, title: 'Tax Deductible', desc: 'Receipts available for your records.' },
                ].map((item, idx) => (
                  <div
                    key={item.title}
                    className="card text-center card-hover group animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className={`w-14 h-14 ${infoCardColors[idx].bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className={`w-7 h-7 ${infoCardColors[idx].icon} group-hover:scale-125 transition-transform duration-300`} />
                    </div>
                    <h3 className="font-heading font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Why Giving Matters - Blue section */}
        <section className="bg-primary text-white section-padding relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full -mr-36 -mt-36 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 pointer-events-none" />
          <div className="container-max relative z-10">
            <div className="text-center mb-12">
              <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">Your Generosity</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Why Giving Matters</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-accent via-secondary to-tertiary rounded-full mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '⛪', title: 'Fund Our Branches', desc: 'Your giving keeps all 5 branches running — lights on, doors open, and communities reached.' },
                { icon: '🎓', title: 'Equip Leaders', desc: 'Train pastors, equip ministers, and send teams across the Fiji Islands to preach the Gospel.' },
                { icon: '🌏', title: 'Reach the Islands', desc: 'Help us extend our reach to every island and village across Fiji and beyond.' },
              ].map((item, idx) => (
                <div key={item.title} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center animate-fade-in-up card-hover" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-heading font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-blue-200 italic text-lg font-heading">
                &ldquo;Each of you should give what you have decided in your heart to give...&rdquo; — 2 Corinthians 9:7
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
