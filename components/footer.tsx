"use client"

import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import NextImage from "next/image"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

const NextLink = Link as any
const NextButton = Button as any
const NextInput = Input as any
const NextFacebook = Facebook as any
const NextInstagram = Instagram as any

export default function Footer() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') { // Unique violation
          setMessage({ type: 'error', text: 'This email is already subscribed!' })
        } else {
          setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
        }
        return
      }

      setMessage({ type: 'success', text: 'Thank you for subscribing!' })
      setEmail('')
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-moss-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">About Us</h3>
            <p className="text-gray-200 mb-4">
              We provide premium quality products sourced from the finest growers. Our mission is to improve lives
              through the power of natural wellness.
            </p>
            <div className="flex space-x-4">
              <NextButton variant="ghost" size="icon" className="rounded-full text-white hover:text-gray-200 hover:bg-moss-700">
                <NextFacebook className="h-5 w-5" />
              </NextButton>
              <NextButton 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-white hover:text-gray-200 hover:bg-moss-700"
                asChild
              >
                <a 
                  href="https://www.instagram.com/dosedailyltd?igsh=dnJjd2huY283YWJ5&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <NextInstagram className="h-5 w-5" />
                </a>
              </NextButton>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NextLink href="/products" className="text-gray-200 hover:text-white">
                  Shop All
                </NextLink>
              </li>
              <li>
                <NextLink href="/blog" className="text-gray-200 hover:text-white">
                  Blog
                </NextLink>
              </li>
              <li>
                <NextLink href="/contact" className="text-gray-200 hover:text-white">
                  Contact Us
                </NextLink>
              </li>
              <li>
                <NextLink href="/faq" className="text-gray-200 hover:text-white">
                  FAQs
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <NextLink href="/products?category=Flower" className="text-gray-200 hover:text-white">
                  Flower
                </NextLink>
              </li>
              <li>
                <NextLink href="/products?category=Vape Liquid" className="text-gray-200 hover:text-white">
                  Vape Liquid
                </NextLink>
              </li>
              <li>
                <NextLink href="/products?category=Hash" className="text-gray-200 hover:text-white">
                  Hash
                </NextLink>
              </li>
              <li>
                <NextLink href="/products?category=Rosin" className="text-gray-200 hover:text-white">
                  Rosin
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
            <p className="text-gray-200 mb-4">
            Subscribe to our newsletter to receive a free Dose Daily tee and 10% off your first order.            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <NextInput 
                type="email"
                placeholder="Your email" 
                className="bg-moss-700/50 border-moss-600 text-white placeholder:text-gray-400 focus:ring-moss-500 focus:border-moss-500 px-4 rounded-lg"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              <NextButton 
                type="submit"
                className="bg-moss-500 hover:bg-moss-600 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? '...' : 'Subscribe'}
              </NextButton>
            </form>
            {message && (
              <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-moss-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Dose Daily. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <NextLink href="/faq" className="text-gray-300 hover:text-white text-sm">
                Privacy Policy
              </NextLink>
              <NextLink href="/faq" className="text-gray-300 hover:text-white text-sm">
                Terms of Service
              </NextLink>
              <NextLink href="/faq" className="text-gray-300 hover:text-white text-sm">
                Shipping Policy
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
