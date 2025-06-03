"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

const NextLink = Link as any
const NextImage = Image as any
const NextButton = Button as any
const NextBadge = Badge as any
const NextCheck = Check as any
const NextArrowRight = ArrowRight as any
const NextChevronRight = ChevronRight as any

export default function HeroBanner() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    {
      src: "/images/mm.jpg",
      alt: "Hero Image 1"
    },
    {
      src: "/images/hero-image.webp",
      alt: "Hero Image 2"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-sand-100 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-6">
            <NextBadge className="bg-moss-500 text-white hover:bg-moss-600 mb-2">Premium Quality</NextBadge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Experience the <span className="text-moss-500 flickering-text">Natural Power</span> of CBD
            </h1>

            <p className="text-lg md:text-xl text-gray-600">
              Our lab-tested, organic CBD products are designed to enhance your wellness routine and bring balance to
              your everyday life.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <NextCheck className="h-5 w-5 text-moss-500" />
                <span className="text-gray-700">100% Organic Hemp Extract</span>
              </div>
              <div className="flex items-center gap-2">
                <NextCheck className="h-5 w-5 text-moss-500" />
                <span className="text-gray-700">Third-Party Lab Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <NextCheck className="h-5 w-5 text-moss-500" />
                <span className="text-gray-700">Free Shipping on Orders £75+</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <NextButton asChild size="lg" className="bg-moss-500 hover:bg-moss-600 text-lg">
                <NextLink href="/products" className="flex items-center">
                  Shop Now <NextArrowRight className="ml-2 h-5 w-5" />
                </NextLink>
              </NextButton>
            </div>

            <div className="flex flex-col pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Trusted & Certified</p>
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <NextImage
                    src="/images/labtested.png"
                    alt="GMP Certified"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <NextImage
                    src="/images/techniciancert.png"
                    alt="Certified Technician"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <NextImage
                    src="/images/thirdparty.webp"
                    alt="Third Party Verified"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="bg-white p-2 rounded-md shadow-sm">
                  <NextImage
                    src="/images/organic.png"
                    alt="Organic Certified"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    currentImage === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <NextImage
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover w-full h-full transition-transform duration-500"
                    style={{ objectPosition: 'center 15%' }}
                  />
                </div>
              ))}
              {/* Animated Join the Club Text */}
              <div className="absolute bottom-8 right-8 text-right z-10">
                <div className="animate-fade-in-up space-y-1">
                  <p className="text-2xl font-bold text-white drop-shadow-lg"> 10% off your first order</p>
                  <p className="text-1xl font-bold text-white drop-shadow-lg">when you subscribe to our newsletter</p>
                  
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      currentImage === index ? 'bg-moss-500' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating product badges */}
            <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-lg shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden relative bg-sage-100 flex items-center justify-center">
                  <NextImage
                    src="/images/hero-small-image.webp"
                    alt="CBD Hash Best Seller"
                    width={48}
                    height={48}
                    className="object-cover rounded-full h-full w-full"
                    style={{ display: 'block' }}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Moroccan Hash</p>
                  <p className="text-sm text-moss-500">Best Seller</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white p-3 rounded-lg shadow-lg hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center overflow-hidden">
                  <NextImage
                    src="/images/smallhero.jpg"
                    alt="CBD Gummies"
                    width={48}
                    height={128}
                    className="object-cover rounded-full h-full w-full scale-150"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Lemon Octane</p>
                  <p className="text-sm text-moss-500">New Arrival</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
          ></path>
        </svg>
      </div>

      <style>{`
        @keyframes flicker {
          0%, 100% {
            opacity: 1;
            text-shadow: 0 0 5px rgba(34, 197, 94, 0.5), 0 0 10px rgba(34, 197, 94, 0.4);
          }
          5% {
            opacity: 0.8;
            text-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
          }
          10% {
            opacity: 1;
            text-shadow: 0 0 15px rgba(34, 197, 94, 0.9), 0 0 25px rgba(34, 197, 94, 0.7);
          }
          15% {
            opacity: 0.9;
            text-shadow: 0 0 5px rgba(34, 197, 94, 0.6);
          }
          25% {
            opacity: 1;
            text-shadow: 0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.6);
          }
          30% {
            opacity: 0.85;
            text-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
          }
          35% {
            opacity: 1;
            text-shadow: 0 0 15px rgba(34, 197, 94, 0.7), 0 0 25px rgba(34, 197, 94, 0.5);
          }
          40% {
            opacity: 0.9;
            text-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
          }
          70% {
            opacity: 0.95;
            text-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
          }
          80% {
            opacity: 1;
            text-shadow: 0 0 12px rgba(34, 197, 94, 0.7), 0 0 18px rgba(34, 197, 94, 0.5);
          }
          90% {
            opacity: 0.85;
            text-shadow: 0 0 7px rgba(34, 197, 94, 0.6);
          }
        }

        .flickering-text {
          animation: flicker 8s infinite ease-in-out;
          position: relative;
          display: inline-block;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
