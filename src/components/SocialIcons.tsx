'use client'

import { Heart, Camera, Play, Music } from 'lucide-react'
import Link from 'next/link'

export default function SocialIcons() {
  const socials = [
    {
      name: 'Facebook',
      icon: Heart,
      url: 'https://facebook.com/wordoflifefiji',
      label: 'Follow us on Facebook',
      symbol: 'f',
    },
    {
      name: 'Instagram',
      icon: Camera,
      url: '#',
      label: 'Follow us on Instagram',
      symbol: '📷',
    },
    {
      name: 'YouTube',
      icon: Play,
      url: '#',
      label: 'Subscribe to our YouTube',
      symbol: '▶',
    },
    {
      name: 'TikTok',
      icon: Music,
      url: '#',
      label: 'Follow us on TikTok',
      symbol: '♪',
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 md:top-6 md:right-6 md:bottom-auto flex flex-col gap-3 z-40">
      {socials.map((social) => {
        const IconComponent = social.icon
        return (
          <Link
            key={social.name}
            href={social.url}
            target={social.url !== '#' ? '_blank' : undefined}
            rel={social.url !== '#' ? 'noopener noreferrer' : undefined}
            className="group relative"
            aria-label={social.label}
          >
            <div className="bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center w-12 h-12 text-lg font-bold">
              {social.symbol}
            </div>
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {social.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
