import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import SectionHeading from '@/components/SectionHeading'
import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react'

const sampleEvents = [
  {
    title: 'Sunday Worship Service',
    date: 'Every Sunday',
    time: '10:00 AM',
    location: 'All Branches',
    description: 'Join us for praise, worship, and the Word of God.',
    recurring: true,
  },
  {
    title: 'Midweek Bible Study',
    date: 'Every Wednesday',
    time: '6:00 PM',
    location: 'All Branches',
    description: 'Dive deeper into the Scriptures with our midweek study groups.',
    recurring: true,
  },
  {
    title: 'Youth Fellowship',
    date: 'Every Friday',
    time: '5:00 PM',
    location: 'Sabeto Branch',
    description: 'A time for young people to fellowship, learn, and grow together.',
    recurring: true,
  },
]

const eventIconColors = [
  'text-primary',
  'text-secondary',
  'text-tertiary',
]

export default function EventsPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          subtitle="What's Happening"
          title="Events & Services"
          description="Stay connected with what's happening at Word of Life Fiji."
        />

        {/* Regular Services */}
        <section className="section-padding bg-cream">
          <div className="container-max">
            <SectionHeading title="Regular Services" subtitle="Our weekly gatherings." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleEvents.map((event, idx) => (
                <div
                  key={event.title}
                  className="card border border-gray-100 card-hover group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`flex items-center gap-2 font-semibold text-sm mb-3 ${eventIconColors[idx]}`}>
                    <Calendar className={`w-4 h-4 group-hover:scale-125 transition-transform duration-300`} />
                    {event.date}
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" /> {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" /> {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="section-padding bg-primary relative overflow-hidden">
          <div className="container-max text-center">
            <div className="mb-10">
              <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">Stay Tuned</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Upcoming Events</h2>
              <p className="text-blue-200 max-w-xl mx-auto">Special events will be posted here as they are announced.</p>
              <div className="w-24 h-1.5 bg-gradient-to-r from-accent via-secondary to-tertiary rounded-full mx-auto mt-4" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-8 max-w-lg mx-auto animate-fade-in-up">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <p className="text-blue-100">Check back soon for upcoming special events, conferences, and church activities.</p>
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
            <h2 className="text-3xl font-heading font-bold mb-4">Join Us This Week</h2>
            <p className="text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
              Whether it is your first visit or you have been coming for years, there is always a place for you at Word of Life.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
