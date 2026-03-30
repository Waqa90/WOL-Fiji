import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Link from 'next/link'
import { Clock, Video, Music, Package, Sparkles } from 'lucide-react'

const featureCards = [
  {
    icon: Video,
    title: 'Sermon Archive',
    desc: 'Watch and stream sermon videos from all our branches.',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    badgeBg: 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary',
  },
  {
    icon: Music,
    title: 'Music Module',
    desc: 'Weekly song lists and worship resources for our teams.',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    badgeBg: 'bg-gradient-to-r from-accent/20 to-secondary/20 text-accent',
  },
  {
    icon: Package,
    title: 'Asset Management',
    desc: 'Track and manage church assets across all branches.',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    badgeBg: 'bg-gradient-to-r from-secondary/20 to-tertiary/20 text-secondary',
  },
]

export default function ComingSoonPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          subtitle="Coming Soon"
          title="Exciting Features Ahead"
          description="We are working hard to bring you new features. Stay tuned!"
        />

        <section className="section-padding bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -ml-24 -mb-24 pointer-events-none" />
          <div className="container-max relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {featureCards.map((card, idx) => (
                <div
                  key={card.title}
                  className="card text-center border border-gray-100 card-hover group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`w-16 h-16 ${card.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <card.icon className={`w-8 h-8 ${card.iconColor} group-hover:scale-125 transition-transform duration-300`} />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{card.desc}</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${card.badgeBg}`}>
                    <Clock className="w-3 h-3" /> Phase 2
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blue timeline section */}
        <section className="bg-primary text-white section-padding relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
          </div>
          <div className="container-max relative z-10">
            <div className="text-center mb-10">
              <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-3">Our Roadmap</p>
              <h2 className="text-3xl font-heading font-bold">What We Are Building</h2>
            </div>
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
              {[
                { phase: 'Phase 1', label: 'Live Now ✅', title: 'Core Website & Admin Portal', desc: 'Public website, member management, finance tracking, and branch management.' },
                { phase: 'Phase 2', label: 'Coming Soon 🔨', title: 'Sermon Archive & Music Lab', desc: 'Video sermons, music practice tools, song schedules, and instrument pages.' },
                { phase: 'Phase 3', label: 'Future 🚀', title: 'App & Notifications', desc: 'Mobile app, push notifications, online giving, and event registration.' },
              ].map((item, idx) => (
                <div key={item.phase} className="flex gap-4 items-start animate-fade-in-up" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold text-primary-dark text-sm">
                    {idx + 1}
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{item.phase}</span>
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{item.label}</span>
                    </div>
                    <h3 className="font-heading font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-blue-100 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
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
            <h2 className="text-3xl font-heading font-bold mb-4">In the Meantime</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-xl mx-auto">
              Explore what is already available on our site while we build more for you.
            </p>
            <Link href="/" className="btn-vibrant">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
