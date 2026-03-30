'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = ['img1.JPG', 'img2.JPG', 'img3.JPG']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative w-full h-[55vw] max-h-[520px] min-h-[260px] overflow-hidden bg-neutral-900">
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={`/images/${slide}`}
            alt={`Slide ${idx + 1}`}
            fill
            className={`object-cover object-top transition-transform duration-8000 ${
              idx === currentSlide ? 'scale-105' : 'scale-100'
            }`}
            priority={idx === 0}
            quality={85}
          />
        </div>
      ))}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/45 z-[1]" />

      {/* Text Overlay */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-accent font-semibold tracking-wider uppercase text-xs sm:text-sm mb-2 sm:mb-4">
            Welcome to
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-3 sm:mb-6 drop-shadow-lg">
            Word of Life Fiji
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-4 sm:mb-8 max-w-2xl mx-auto hidden sm:block">
            A Christ-centered church serving communities across the beautiful Fiji Islands.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/branches" className="btn-accent text-sm sm:text-lg">
              Visit a Branch
            </Link>
            <Link
              href="/donate"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-sm sm:text-lg"
            >
              Give Online
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-[3] bg-black/40 hover:bg-black/70 text-white w-8 h-8 sm:w-10 sm:h-10 text-xl sm:text-2xl rounded-full transition-all flex items-center justify-center"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-[3] bg-black/40 hover:bg-black/70 text-white w-8 h-8 sm:w-10 sm:h-10 text-xl sm:text-2xl rounded-full transition-all flex items-center justify-center"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[3]">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`rounded-full transition-all ${
              idx === currentSlide
                ? 'bg-white w-5 h-3'
                : 'bg-white/50 w-3 h-3'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
