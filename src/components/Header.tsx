'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { NAV_LINKS, SITE_NAME } from '@/lib/constants'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-max px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/WOL-logo.png"
              alt="Word of Life Worship Centre Fiji"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
            <div>
              <h1 className="text-xl font-heading font-bold text-primary leading-tight">Word of Life</h1>
              <p className="text-sm text-primary font-semibold tracking-wider">Worship Centre Fiji</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-base text-neutral-800 hover:text-primary font-semibold transition-colors rounded-lg hover:bg-neutral-100"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="ml-4 btn-primary">
              Admin Login
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-neutral-800 hover:bg-neutral-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden border-t py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-neutral-800 hover:text-primary hover:bg-neutral-100 rounded-lg font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block mx-4 mt-3 btn-primary text-center text-sm"
            >
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
