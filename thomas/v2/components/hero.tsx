"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/product-pipe-jointing-lubricants.jpg",
      alt: "Pipe Jointing Lubricants",
    },
    {
      image: "/product-graphite-lubricants.jpg",
      alt: "Graphite Lubricants",
    },
    {
      image: "/product-high-temperature-lubricants.jpg",
      alt: "High-Temperature Lubricants",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative h-96 md:h-screen flex items-center justify-center overflow-hidden">
      {/* Product Carousel */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                filter: "brightness(0.5)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-4">
        <p className="text-lime-400 font-semibold text-sm md:text-base mb-2">Four Generations of Excellence</p>
        <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 leading-tight">80+ Years in Operation</h1>

        <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
          Committed to Clean Water and Quality Products. Delivered On Time, Every Time.
        </p>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-lime-400 hover:bg-lime-500 text-gray-900 p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-lime-400 hover:bg-lime-500 text-gray-900 p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-lime-400 w-8" : "bg-gray-400 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Wave divider */}
      <svg className="absolute bottom-0 left-0 right-0 z-20 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="white" />
      </svg>
    </section>
  )
}
