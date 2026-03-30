import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSlideshow from '@/components/HeroSlideshow'
import SectionHeading from '@/components/SectionHeading'
import { BRANCHES } from '@/lib/constants'
import { MapPin, Clock, Users, Heart, BookOpen, Music } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Slideshow */}
        <HeroSlideshow />

        {/* Welcome Section */}
        <section className="section-padding bg-cream">
          <div className="container-max">
            <SectionHeading
              title="Welcome to Our Church Family"
              subtitle="Word of Life Fiji is part of the global Word of Life family, bringing the love of Christ to communities across Fiji."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">Biblical Teaching</h3>
                <p className="text-gray-600">Grounded in the Word of God, our teaching equips believers for life and ministry.</p>
              </div>
              <div className="card text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">Community</h3>
                <p className="text-gray-600">5 branches across Fiji building genuine relationships and supporting one another.</p>
              </div>
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">Outreach</h3>
                <p className="text-gray-600">Sharing the Gospel and serving our communities through compassion and action.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Branches Preview */}
        <section className="section-padding bg-paleBlue">
          <div className="container-max">
            <SectionHeading
              title="Our Branches"
              subtitle="Find a Word of Life branch near you across the Fiji Islands."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BRANCHES.map((branch) => (
                <div key={branch.name} className="card">
                  <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-primary/50" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{branch.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      {branch.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      {branch.serviceTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/branches" className="btn-primary">
                View All Branches
              </Link>
            </div>
          </div>
        </section>

        {/* Ministries Preview */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <SectionHeading
              title="Our Ministries"
              subtitle="Discover how you can get involved and make a difference."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, name: 'Bible Study', desc: 'Midweek Bible study groups for all ages' },
                { icon: Music, name: 'Worship Team', desc: 'Musicians and singers leading praise' },
                { icon: Users, name: 'Youth Ministry', desc: 'Empowering the next generation' },
                { icon: Heart, name: 'Outreach', desc: 'Serving our community with love' },
              ].map((ministry) => (
                <div key={ministry.name} className="text-center p-6 rounded-xl hover:bg-neutral-50 transition-colors">
                  <ministry.icon className="w-10 h-10 text-accent mx-auto mb-3" />
                  <h3 className="font-heading font-bold mb-2">{ministry.name}</h3>
                  <p className="text-sm text-gray-600">{ministry.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white section-padding">
          <div className="container-max text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Join Us This Sunday
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Everyone is welcome at Word of Life. Come as you are and experience the love of Christ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/branches" className="btn-accent text-lg">
                Find a Branch
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-lg">
                Prayer Request
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
