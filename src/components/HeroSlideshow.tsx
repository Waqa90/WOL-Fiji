'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = ['img1.JPG', 'img2.JPG', 'img3.JPG']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 30000) // 30 seconds
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full h-96 md:h-screen overflow-hidden bg-neutral-900">
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
            className="object-cover"
            priority={idx === 0}
            quality={85}
          />
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
