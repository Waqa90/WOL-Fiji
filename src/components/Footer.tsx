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
    <footer className="bg-white border-t-4 border-gradient-primary">
      {/* Logo Section - Centered */}
      <div className="bg-gradient-to-b from-paleBlue to-white py-12 border-b border-neutral-200">
        <div className="container-max flex flex-col items-center justify-center gap-4">
          <div className="animate-fade-in-up">
            <Image
              src="/images/WOL-logo.png"
              alt="Word of Life Worship Centre Fiji"
              width={96}
              height={96}
              className="object-contain drop-shadow-lg"
            />
          </div>
          <p className="text-sm text-neutral-600 text-center max-w-md">
            A Christ-centered church serving communities across the Fiji Islands.
          </p>
        </div>
      </div>

      {/* Links Section */}
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-primary relative pb-3">
              Quick Links
              <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-secondary w-16 animate-underline-sweep"></span>
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-neutral-700 hover:text-primary hover:translate-x-1 transition-all duration-200 text-sm font-medium flex items-center gap-2">
                    <span className="text-accent text-lg">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Branches */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-primary relative pb-3">
              Our Branches
              <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-secondary to-tertiary w-16 animate-underline-sweep" style={{ animationDelay: '0.2s' }}></span>
            </h4>
            <ul className="space-y-3">
              {BRANCHES.map((branch) => (
                <li key={branch.name} className="text-neutral-700 text-sm group">
                  <span className="text-accent font-bold group-hover:text-secondary transition-colors">●</span>
                  <span className="font-medium group-hover:text-primary transition-colors ml-1">{branch.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-primary relative pb-3">
              Get in Touch
              <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-tertiary to-accent w-16 animate-underline-sweep" style={{ animationDelay: '0.4s' }}></span>
            </h4>
            <ul className="space-y-4 text-sm text-neutral-700">
              <li>
                <p className="text-primary font-semibold mb-1">📧 Email</p>
                <a href="mailto:info@wordoflifefiji.com" className="text-neutral-600 hover:text-accent transition-colors">
                  info@wordoflifefiji.com
                </a>
              </li>
              <li>
                <p className="text-primary font-semibold mb-1">⏰ Service Times</p>
                <p className="text-neutral-600">Sundays at 10:00 AM</p>
              </li>
              <li className="pt-2">
                <Link href="/contact" className="btn-vibrant text-sm !px-6 !py-2 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Icons & Copyright */}
        <div className="border-t border-neutral-200 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
            <div className="flex gap-4">
              {socials.map((social, idx) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target={social.url !== '#' ? '_blank' : undefined}
                  rel={social.url !== '#' ? 'noopener noreferrer' : undefined}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white p-2 rounded-full transition-all duration-300 flex items-center justify-center w-12 h-12 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label={social.name}
                  title={social.name}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <span className="font-bold text-sm">{social.symbol}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-neutral-600 text-sm">&copy; {new Date().getFullYear()} Word of Life Fiji. All rights reserved.</p>
            <p className="text-neutral-600 text-sm">
              Part of the <span className="text-primary font-semibold bg-gradient-primary bg-clip-text text-transparent">Word of Life Worship Centre</span>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
