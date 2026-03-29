import Link from 'next/link'

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
  backgroundClass = 'bg-gradient-to-br from-primary via-primary-dark to-primary',
}: HeroProps) {
  return (
    <section className={`${backgroundClass} text-white relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {subtitle && (
            <p className="text-accent font-semibold tracking-wider uppercase text-sm mb-4">
              {subtitle}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryAction && (
                <Link href={primaryAction.href} className="btn-accent text-lg">
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
