'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { BRANCHES } from '@/lib/constants'
import { Heart, CreditCard, Shield } from 'lucide-react'

const presetAmounts = [10, 25, 50, 100, 250, 500]

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

        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="max-w-2xl mx-auto">
              <div className="card border border-gray-100">
                <h2 className="text-2xl font-heading font-bold mb-6 text-center">Make a Donation</h2>

                {/* Amount Selection */}
                <div className="mb-6">
                  <label className="label-text">Select Amount (FJD)</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => { setAmount(preset); setCustomAmount('') }}
                        className={`py-3 rounded-lg font-semibold transition-colors ${
                          amount === preset
                            ? 'bg-primary text-white'
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
                <button className="btn-accent w-full flex items-center justify-center gap-2 text-lg">
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
                <div className="text-center p-4">
                  <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h3 className="font-heading font-bold mb-1">Every Gift Matters</h3>
                  <p className="text-sm text-gray-600">No amount is too small. God multiplies your generosity.</p>
                </div>
                <div className="text-center p-4">
                  <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h3 className="font-heading font-bold mb-1">100% Secure</h3>
                  <p className="text-sm text-gray-600">All transactions are encrypted and processed by Stripe.</p>
                </div>
                <div className="text-center p-4">
                  <CreditCard className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h3 className="font-heading font-bold mb-1">Tax Deductible</h3>
                  <p className="text-sm text-gray-600">Receipts available for your records.</p>
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
