import Link from "next/link"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import ProductCard from "@/components/product-card"
import HeroBanner from "@/components/hero-banner"
import FeaturedCategories from "@/components/featured-categories"
import TestimonialSlider from "@/components/testimonial-slider"
import BenefitsSection from "@/components/benefits-section"
import NewsletterSignup from "@/components/newsletter-signup"

// Add type assertions
const NextLink = Link as any
const NextChevronRight = ChevronRightIcon as any

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroBanner />

      {/* Featured Categories */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <NextLink
            href="/products"
            className="text-moss-500 hover:text-moss-600 flex items-center gap-1 font-medium"
          >
            View All <NextChevronRight className="h-4 w-4" />
          </NextLink>
        </div>
        <FeaturedCategories />
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-sand-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-moss-600">Best Sellers</h2>
          <NextLink
            href="/products"
            className="text-moss-500 hover:text-moss-600 flex items-center gap-1 font-medium"
          >
            View All <NextChevronRight className="h-4 w-4" />
          </NextLink>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* New Arrivals */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">New Arrivals</h2>
          <NextLink
            href="/products"
            className="text-moss-500 hover:text-moss-600 flex items-center gap-1 font-medium"
          >
            View All <NextChevronRight className="h-4 w-4" />
          </NextLink>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSlider />

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </main>
  )
}

// Sample product data - Updated to match shop page prices
const bestSellerProducts = [
  {
    id: 1,
    name: "Raspberry Muffin",
    price: 7.99,
    image: "/images/raspberry.webp",
    rating: 4.8,
    reviewCount: 124,
    category: "Flower",
    isNew: false,
    isBestSeller: true,
    lab_results: "https://example.com/lab-results"
  },
  {
    id: 2,
    name: "Blue Dream Amnesia Vape Liquid",
    price: 24.99,
    image: "/images/amnesia.webp",
    rating: 4.9,
    reviewCount: 89,
    category: "Vape Liquid",
    isNew: false,
    isBestSeller: true,
    lab_results: "https://example.com/lab-results"
  },
  {
    id: 3,
    name: "Moroccan Hash",
    price: 6.50,
    image: "/images/hash1.png",
    rating: 4.7,
    reviewCount: 56,
    category: "Hash",
    isNew: false,
    isBestSeller: true,
    lab_results: "https://example.com/lab-results"
  },
  {
    id: 4,
    name: "Banana Kush Wax",
    price: 30.00,
    image: "/images/bananakush.webp",
    rating: 4.6,
    reviewCount: 42,
    category: "Rosin",
    isNew: false,
    isBestSeller: true,
    lab_results: "https://example.com/lab-results"
  },
]

const newArrivalProducts = [
  {
    id: 5,
    name: "Lemon Octane",
    price: 5.50,
    image: "/images/lemonoc.jpg",
    rating: 4.5,
    reviewCount: 18,
    category: "Flower",
    isNew: true,
    isBestSeller: false,
    lab_results: "https://example.com/lab-results"
  },
  {
    id: 6,
    name: "Gelato Vape Liquid",
    price: 39.99,
    image: "/images/gelato1.webp",
    rating: 4.7,
    reviewCount: 23,
    category: "Vape Liquid",
    isNew: true,
    isBestSeller: false,
    lab_results: "https://example.com/lab-results"
  },
  {
    id: 7,
    name: "Bubble Hash",
    price: 7.99,
    image: "/images/hash3.jpg",
    rating: 4.4,
    reviewCount: 12,
    category: "Hash",
    isNew: true,
    isBestSeller: false,
    lab_results: "https://example.com/lab-results"
  },
  {
    id: 8,
    name: "Wedding Cake Wax",
    price: 28.00,
    image: "/images/weddingcake.webp",
    rating: 4.4,
    reviewCount: 12,
    category: "Rosin",
    isNew: true,
    isBestSeller: false,
    lab_results: "https://example.com/lab-results"
  }
]
