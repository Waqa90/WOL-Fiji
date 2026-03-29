import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import SectionHeading from '@/components/SectionHeading'
import { Calendar, MapPin, Clock } from 'lucide-react'

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

        <section className="section-padding bg-white">
          <div className="container-max">
            <SectionHeading title="Regular Services" subtitle="Our weekly gatherings." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleEvents.map((event) => (
                <div key={event.title} className="card border border-gray-100">
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm mb-3">
                    <Calendar className="w-4 h-4" />
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

        <section className="section-padding bg-neutral-50">
          <div className="container-max text-center">
            <SectionHeading title="Upcoming Events" subtitle="Special events will be posted here as they are announced." />
            <div className="card max-w-lg mx-auto">
              <Calendar className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <p className="text-gray-500">Check back soon for upcoming special events, conferences, and church activities.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
