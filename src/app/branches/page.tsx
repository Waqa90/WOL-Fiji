import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import SectionHeading from '@/components/SectionHeading'
import { BRANCHES } from '@/lib/constants'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'

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

        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {BRANCHES.map((branch, index) => (
                <div key={branch.name} className="card border border-gray-100">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-6 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                      <span className="text-2xl font-heading font-bold text-primary">{branch.name}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-4">{branch.name} Branch</h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
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
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white section-padding">
          <div className="container-max text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">New to Word of Life?</h2>
            <p className="text-xl text-gray-200 mb-6">We would love to welcome you this Sunday. Come as you are!</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
