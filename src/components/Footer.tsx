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
    <footer className="bg-white border-t border-neutral-200">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About with Logo */}
          <div>
            <div className="mb-6">
              <Image
                src="/images/WOL-logo.png"
                alt="Word of Life Worship Centre Fiji"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <p className="text-neutral-700 text-sm leading-relaxed">
              A Christ-centered church serving communities across the Fiji Islands.
              Part of the Word of Life Worship Centre.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-neutral-700 hover:text-primary hover:text-accent transition-colors text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Branches */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-primary">Our Branches</h4>
            <ul className="space-y-2">
              {BRANCHES.map((branch) => (
                <li key={branch.name} className="text-neutral-700 text-sm">
                  <span className="text-accent font-bold">●</span> <span className="font-medium">{branch.name}</span> — {branch.location.split(',')[0]}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-primary">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-neutral-700">
              <li>
                <span className="text-primary font-semibold">Email:</span><br />
                <span className="text-neutral-600">info@wordoflifefiji.com</span>
              </li>
              <li>
                <span className="text-primary font-semibold">Service Times:</span><br />
                <span className="text-neutral-600">Sundays at 10:00 AM</span>
              </li>
            </ul>
            <Link href="/contact" className="inline-block mt-4 btn-accent text-sm !px-4 !py-2">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Social Icons & Copyright */}
        <div className="border-t border-neutral-200 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-neutral-600 text-sm">&copy; {new Date().getFullYear()} Word of Life Fiji. All rights reserved.</p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target={social.url !== '#' ? '_blank' : undefined}
                  rel={social.url !== '#' ? 'noopener noreferrer' : undefined}
                  className="bg-primary hover:bg-primary-light text-white p-2 rounded-full transition-all flex items-center justify-center w-10 h-10"
                  aria-label={social.name}
                  title={social.name}
                >
                  <span className="font-bold text-sm">{social.symbol}</span>
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-6 text-center text-neutral-600 text-sm">
            Part of the <span className="text-primary font-semibold">Word of Life Worship Centre</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
