import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSlideshow from '@/components/HeroSlideshow'
import SectionHeading from '@/components/SectionHeading'
import RotatingVerse from '@/components/RotatingVerse'
import { BRANCHES } from '@/lib/constants'
import { MapPin, Clock, Users, Heart, BookOpen, Music, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Slideshow */}
        <HeroSlideshow />

        {/* Blue Stats Banner */}
        <section className="bg-primary text-white py-8">
          <div className="container-max">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { number: '5', label: 'Branches', icon: '🏛️' },
                { number: '12+', label: 'Years Serving', icon: '📖' },
                { number: '5', label: 'Islands', icon: '🌺' },
                { number: '100%', label: 'Spirit-led', icon: '✝️' },
              ].map((stat) => (
                <div key={stat.label} className="animate-fade-in-up">
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-heading font-bold text-accent">{stat.number}</div>
                  <div className="text-sm text-blue-200 font-semibold tracking-wider uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="section-padding bg-cream relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full -ml-48 -mb-48 pointer-events-none" />
          <div className="container-max relative z-10">
            <div className="animate-fade-in-down">
              <SectionHeading
                title="Welcome to Our Church Family"
                subtitle="Word of Life Fiji is part of the global Word of Life family, bringing the love of Christ to communities across Fiji."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: BookOpen, name: 'Biblical Teaching', desc: 'Grounded in the Word of God, our teaching equips believers for life and ministry.', color: 'primary', delay: 0 },
                { icon: Users, name: 'Community', desc: '5 branches across Fiji building genuine relationships and supporting one another.', color: 'accent', delay: 0.2 },
                { icon: Heart, name: 'Outreach', desc: 'Sharing the Gospel and serving our communities through compassion and action.', color: 'secondary', delay: 0.4 },
              ].map((item, idx) => (
                <div
                  key={item.name}
                  className="card card-hover animate-fade-in-up relative overflow-hidden group"
                  style={{ animationDelay: `${item.delay}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className={`w-16 h-16 bg-${item.color}/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-8 h-8 text-${item.color}`} />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-gray-600 group-hover:text-neutral-700 transition-colors">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Branches Preview */}
        <section className="section-padding bg-paleBlue relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full -ml-40 -mt-40 pointer-events-none" />
          <div className="container-max relative z-10">
            <div className="animate-fade-in-down">
              <SectionHeading
                title="Our Branches"
                subtitle="Find a Word of Life branch near you across the Fiji Islands."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BRANCHES.map((branch, idx) => (
                <div
                  key={branch.name}
                  className="card card-hover animate-fade-in-up group relative"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="w-full h-40 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center group-hover:from-primary/30 group-hover:via-accent/20 group-hover:to-secondary/20 transition-all duration-300">
                    <MapPin className="w-12 h-12 text-primary/50 group-hover:text-primary group-hover:scale-125 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">{branch.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2 group-hover:text-accent transition-colors">
                      <MapPin className="w-4 h-4 text-accent group-hover:text-secondary transition-colors" />
                      {branch.location}
                    </p>
                    <p className="flex items-center gap-2 group-hover:text-primary transition-colors">
                      <Clock className="w-4 h-4 text-secondary group-hover:text-tertiary transition-colors" />
                      {branch.serviceTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/branches" className="btn-vibrant btn-glow">
                <span className="relative z-10">View All Branches</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Rotating Bible Verse — changes every hour */}
        <RotatingVerse />

        {/* Ministries Preview */}
        <section className="section-padding bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-tertiary/5 rounded-full -mr-36 -mt-36 pointer-events-none" />
          <div className="container-max relative z-10">
            <div className="animate-fade-in-down">
              <SectionHeading
                title="Our Ministries"
                subtitle="Discover how you can get involved and make a difference."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, name: 'Bible Study', desc: 'Midweek Bible study groups for all ages', color: 'primary' },
                { icon: Music, name: 'Worship Team', desc: 'Musicians and singers leading praise', color: 'accent' },
                { icon: Users, name: 'Youth Ministry', desc: 'Empowering the next generation', color: 'secondary' },
                { icon: Heart, name: 'Outreach', desc: 'Serving our community with love', color: 'tertiary' },
              ].map((ministry, idx) => (
                <div
                  key={ministry.name}
                  className="text-center p-8 rounded-xl bg-gradient-to-br from-white to-cream hover:from-cream hover:to-paleBlue transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 animate-fade-in-up group cursor-pointer"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-full bg-${ministry.color}/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-125 transition-transform duration-300`}>
                    <ministry.icon className={`w-6 h-6 text-${ministry.color} group-hover:text-${ministry.color} animate-bounce-subtle`} />
                  </div>
                  <h3 className="font-heading font-bold mb-2 group-hover:text-primary transition-colors">{ministry.name}</h3>
                  <p className="text-sm text-gray-600 group-hover:text-neutral-700 transition-colors">{ministry.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden section-padding">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary-dark" />
          <div className="absolute inset-0 opacity-20">
            <Sparkles className="absolute top-10 left-10 w-12 h-12 text-white animate-bounce-subtle" />
            <Sparkles className="absolute bottom-20 right-20 w-8 h-8 text-white animate-bounce-subtle" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="container-max text-center relative z-10">
            <div className="animate-fade-in-down">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white drop-shadow-lg">
                Join Us This Sunday
              </h2>
              <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow">
                Everyone is welcome at Word of Life. Come as you are and experience the love of Christ.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/branches" className="btn-vibrant btn-glow text-lg">
                <span className="relative z-10">Find a Branch</span>
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 text-lg shadow-lg hover:shadow-xl">
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
