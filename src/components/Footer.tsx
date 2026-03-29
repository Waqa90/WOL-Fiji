import Link from 'next/link'
import { SITE_NAME, BRANCHES, NAV_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-heading text-lg font-bold">W</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg">Word of Life</h3>
                <p className="text-xs text-accent tracking-wider uppercase">Fiji Islands</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              A Christ-centered church serving communities across the Fiji Islands.
              Part of the Word of Life Worship Centre.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-accent transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Branches */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Our Branches</h4>
            <ul className="space-y-2">
              {BRANCHES.map((branch) => (
                <li key={branch.name} className="text-gray-300 text-sm">
                  <span className="text-accent">●</span> {branch.name} — {branch.location.split(',')[0]}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <span className="text-accent font-semibold">Email:</span><br />
                info@wordoflifefiji.com
              </li>
              <li>
                <span className="text-accent font-semibold">Service Times:</span><br />
                Sundays at 10:00 AM
              </li>
            </ul>
            <Link href="/contact" className="inline-block mt-4 btn-accent text-sm !px-4 !py-2">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Word of Life Fiji. All rights reserved.</p>
          <p className="mt-1">Part of the <span className="text-accent">Word of Life Worship Centre</span>.</p>
        </div>
      </div>
    </footer>
  )
}
