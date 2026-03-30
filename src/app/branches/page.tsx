import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import SectionHeading from '@/components/SectionHeading'
import { BRANCHES } from '@/lib/constants'
import { MapPin, Clock, Sparkles } from 'lucide-react'

const branchColors = [
  { pin: 'text-primary', gradient: 'from-primary/20 to-accent/20', mapPinSmall: 'text-primary' },
  { pin: 'text-secondary', gradient: 'from-secondary/20 to-primary/20', mapPinSmall: 'text-secondary' },
  { pin: 'text-tertiary', gradient: 'from-tertiary/20 to-primary/20', mapPinSmall: 'text-tertiary' },
  { pin: 'text-accent', gradient: 'from-accent/20 to-secondary/20', mapPinSmall: 'text-accent' },
  { pin: 'text-primary', gradient: 'from-primary/20 to-tertiary/20', mapPinSmall: 'text-primary' },
]

export default function BranchesPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          subtitle="Our Locations"
          title="Find a Branch Near You"
          description="Word of Life has 5 branches across the Fiji Islands. Visit the one closest to you!"
        />

        <section className="section-padding bg-paleBlue relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -ml-24 -mb-24 pointer-events-none" />
          <div className="container-max relative z-10">
            <SectionHeading title="Our Branches" subtitle="Five communities, one family of faith across the islands." />

            {/* Blue info row */}
            <div className="bg-primary rounded-2xl p-6 mb-10 text-white flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up">
              <div className="text-center sm:text-left">
                <p className="text-accent font-semibold text-sm tracking-wider uppercase mb-1">Serving Fiji Since 2012</p>
                <h3 className="text-2xl font-heading font-bold">5 Communities. One Family.</h3>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-accent">5</div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider">Branches</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">1</div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider">Vision</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">∞</div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider">Grace</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {BRANCHES.map((branch, index) => {
                const colors = branchColors[index % branchColors.length]
                return (
                  <div
                    key={branch.name}
                    className="card border border-gray-100 card-hover group animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-full h-48 bg-gradient-to-br ${colors.gradient} rounded-lg mb-6 flex items-center justify-center`}>
                      <div className="text-center">
                        <MapPin className={`w-12 h-12 ${colors.pin} mx-auto mb-2 group-hover:scale-125 transition-transform duration-300`} />
                        <span className={`text-2xl font-heading font-bold ${colors.pin}`}>{branch.name}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-4">{branch.name} Branch</h3>
                    <div className="space-y-3 text-gray-600">
                      <p className="flex items-start gap-3">
                        <MapPin className={`w-5 h-5 ${colors.mapPinSmall} mt-0.5 flex-shrink-0`} />
                        <span>{branch.location}</span>
                      </p>
                      <p className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>{branch.serviceTime}</span>
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Everyone is welcome! Come join us for worship, fellowship, and the Word of God.
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary-dark text-white section-padding">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 pointer-events-none" />
          <Sparkles className="absolute top-6 right-10 w-6 h-6 text-accent/60 animate-bounce-subtle pointer-events-none" />
          <Sparkles className="absolute bottom-6 left-10 w-5 h-5 text-white/40 animate-bounce-subtle pointer-events-none" style={{ animationDelay: '0.4s' }} />
          <div className="container-max text-center relative z-10">
            <h2 className="text-3xl font-heading font-bold mb-4">New to Word of Life?</h2>
            <p className="text-xl text-gray-200 mb-6">We would love to welcome you this Sunday. Come as you are!</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
