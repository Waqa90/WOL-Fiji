import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import SectionHeading from '@/components/SectionHeading'
import { Heart, BookOpen, Globe, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          subtitle="About Us"
          title="Our Story & Mission"
          description="Word of Life Fiji is part of a global family of churches united by faith in Jesus Christ and a passion for reaching communities."
        />

        {/* Mission & Vision */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-4 text-primary">Our Mission</h2>
                <div className="w-16 h-1 bg-accent rounded-full mb-6" />
                <p className="text-gray-600 leading-relaxed text-lg">
                  To glorify God by making disciples of Jesus Christ in Fiji and beyond.
                  We are committed to preaching the Gospel, building strong believers,
                  and serving our communities with the love of Christ.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold mb-4 text-primary">Our Vision</h2>
                <div className="w-16 h-1 bg-accent rounded-full mb-6" />
                <p className="text-gray-600 leading-relaxed text-lg">
                  To see transformed lives, thriving churches, and communities
                  impacted by the Gospel across every island and village in Fiji.
                  We envision a movement of faith that reaches every home.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-neutral-50">
          <div className="container-max">
            <SectionHeading title="Our Values" subtitle="The pillars that guide everything we do." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: BookOpen, title: 'Scripture', desc: 'The Bible is our foundation — the inspired, infallible Word of God guiding all we believe and do.' },
                { icon: Heart, title: 'Love', desc: 'We love God and love people. Compassion and grace define how we treat everyone.' },
                { icon: Globe, title: 'Mission', desc: 'We exist to share the Gospel — locally in Fiji and globally as part of the Word of Life family.' },
                { icon: Users, title: 'Community', desc: 'We grow together through genuine fellowship, accountability, and mutual support.' },
              ].map((value) => (
                <div key={value.title} className="card text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <SectionHeading title="Our Leadership" subtitle="Meet the pastors and leaders serving our church family." />
            <div className="max-w-2xl mx-auto">
              <div className="card text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-heading font-bold text-white">LN</span>
                </div>
                <h3 className="text-2xl font-heading font-bold">Mr Liuaki Nacagilevu</h3>
                <p className="text-accent font-semibold mb-3">Senior Pastor</p>
                <p className="text-gray-600 leading-relaxed">
                  Leading Word of Life Fiji with vision, faith, and a heart for the people of Fiji.
                  Under his leadership, the church has grown to serve 5 communities across the islands.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Connection */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white section-padding">
          <div className="container-max text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Part of the Global Word of Life Family
            </h2>
            <p className="text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
              Word of Life Fiji is connected to the Word of Life Christian Church in Los Angeles
              and churches around the world, united in our mission to spread the Gospel.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
