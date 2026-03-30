import Link from 'next/link'
import Image from 'next/image'
import { SITE_NAME, BRANCHES, NAV_LINKS } from '@/lib/constants'

export default function Footer() {
  const socials = [
    { name: 'Facebook', symbol: 'f', url: 'https://facebook.com/wordoflifefiji' },
    { name: 'Instagram', symbol: '📷', url: '#' },
    { name: 'YouTube', symbol: '▶', url: '#' },
    { name: 'TikTok', symbol: '♪', url: '#' },
  ]

  return (
    <footer className="bg-primary text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About with Logo */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/WOL-logo.png"
                alt="Word of Life Worship Centre Fiji"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <p className="text-gray-100 text-sm leading-relaxed">
              A Christ-centered church serving communities across the Fiji Islands.
              Part of the Word of Life Worship Centre.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-200 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Branches */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-white">Our Branches</h4>
            <ul className="space-y-2">
              {BRANCHES.map((branch) => (
                <li key={branch.name} className="text-gray-200 text-sm">
                  <span className="text-white">●</span> {branch.name} — {branch.location.split(',')[0]}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-white">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-gray-200">
              <li>
                <span className="text-white font-semibold">Email:</span><br />
                info@wordoflifefiji.com
              </li>
              <li>
                <span className="text-white font-semibold">Service Times:</span><br />
                Sundays at 10:00 AM
              </li>
            </ul>
            <Link href="/contact" className="inline-block mt-4 btn-accent text-sm !px-4 !py-2">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Social Icons in Footer */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-200 text-sm">&copy; {new Date().getFullYear()} Word of Life Fiji. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target={social.url !== '#' ? '_blank' : undefined}
                  rel={social.url !== '#' ? 'noopener noreferrer' : undefined}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all flex items-center justify-center w-10 h-10"
                  aria-label={social.name}
                >
                  <span className="font-bold text-sm">{social.symbol}</span>
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-gray-200 text-sm">
            Part of the <span className="text-white font-semibold">Word of Life Worship Centre</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
