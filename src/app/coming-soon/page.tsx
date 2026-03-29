import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Link from 'next/link'
import { Clock, Video, Music, Package } from 'lucide-react'

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

        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="card text-center border border-gray-100">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">Sermon Archive</h3>
                <p className="text-gray-600 text-sm mb-4">Watch and stream sermon videos from all our branches.</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> Phase 2
                </span>
              </div>
              <div className="card text-center border border-gray-100">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">Music Module</h3>
                <p className="text-gray-600 text-sm mb-4">Weekly song lists and worship resources for our teams.</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> Phase 2
                </span>
              </div>
              <div className="card text-center border border-gray-100">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">Asset Management</h3>
                <p className="text-gray-600 text-sm mb-4">Track and manage church assets across all branches.</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> Phase 2
                </span>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/" className="btn-primary">Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
