import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  backgroundClass?: string
}

export default function Hero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundClass = 'bg-gradient-to-r from-primary via-secondary/80 to-primary-dark',
}: HeroProps) {
  return (
    <section className={`${backgroundClass} text-white relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      {/* Sparkle decorations */}
      <Sparkles className="absolute top-8 left-8 w-6 h-6 text-accent/60 animate-bounce-subtle pointer-events-none" />
      <Sparkles className="absolute top-12 right-12 w-8 h-8 text-accent/40 animate-bounce-subtle pointer-events-none" style={{ animationDelay: '0.3s' }} />
      <Sparkles className="absolute bottom-10 left-1/4 w-5 h-5 text-white/30 animate-bounce-subtle pointer-events-none" style={{ animationDelay: '0.6s' }} />

      <div className="container-max section-padding relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {subtitle && (
            <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-4 animate-fade-in-down">
              {subtitle}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 animate-fade-in-up">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl mx-auto animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
              {description}
            </p>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {primaryAction && (
                <Link href={primaryAction.href} className="btn-vibrant text-lg">
                  {primaryAction.label}
                </Link>
              )}
              {secondaryAction && (
                <Link
                  href={secondaryAction.href}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-lg"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
