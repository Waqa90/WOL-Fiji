interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeading({ title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <div className="animate-fade-in-down">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className={`mt-4 w-24 h-1.5 bg-gradient-to-r from-accent via-secondary to-tertiary rounded-full animate-underline-sweep ${centered ? 'mx-auto' : ''}`} />
      </div>
    </div>
  )
}
