"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LucideProps } from "lucide-react"
import Image from "next/image"

// Add type assertion for NextImage
const NextImage = Image as any

const IconWrapper = ({ icon: Icon, ...props }: { icon: any } & LucideProps) => {
  return <Icon {...props} />
}

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "London, UK",
    rating: 5,
    text: "I've been using the CBD Morrocan hash for my anxiety and it has made a world of difference. I feel calmer and more focused throughout the day.",
  },
  {
    id: 2,
    name: "Michael T.",
    location: "Manchester, UK",
    rating: 5,
    text: "The Rosin has been a game-changer for my recovery. It provides quick relief to my back pain.",
  },
  {
    id: 3,
    name: "Jennifer L.",
    location: "Edinburgh, UK",
    rating: 4,
    text: "I was skeptical at first, but the CBD Vape liquid has really helped with my sleep issues. I fall asleep faster and wake up feeling refreshed.",
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 bg-sand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-moss-600 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover why our customers love our premium CBD products and exceptional service.
          </p>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl p-8 shadow-lg">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-gray-600">{testimonial.location}</p>
                    </div>
                    <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <IconWrapper
                          key={i}
                          icon={Star}
                          className={`h-5 w-5 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
            aria-label="Previous testimonial"
          >
            <IconWrapper icon={ChevronLeft} className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
            aria-label="Next testimonial"
          >
            <IconWrapper icon={ChevronRight} className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
