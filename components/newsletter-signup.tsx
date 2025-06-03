"use client"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

const NextButton = Button as any

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Insert the subscriber - the trigger will automatically create the discount code
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])
        .select()

      if (subscriberError) {
        console.error('Subscriber error:', subscriberError)
        if (subscriberError.code === '23505') { // Unique violation
          setMessage({ type: 'error', text: 'This email is already subscribed!' })
        } else if (subscriberError.message) {
          setMessage({ type: 'error', text: `Error: ${subscriberError.message}` })
        } else {
          setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
        }
        return
      }

      // Check if we have the subscriber data
      if (!subscriberData || subscriberData.length === 0) {
        setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' })
        return
      }

      setMessage({ type: 'success', text: 'Thank you for subscribing! Your discount code is CBD10' })
      setEmail('')
    } catch (err) {
      console.error('Unexpected error:', err)
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Something went wrong. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-[#476a47] rounded-lg p-8 md:p-12 border border-moss-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Newsletter</h2>
          <p className="text-lg text-moss-100 mb-8">
            Subscribe to our newsletter to receive a free Dose Daily tee and 10% off your first order. 
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 h-12 px-4 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-moss-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <NextButton 
              type="submit"
              className="bg-moss-800 hover:bg-moss-900 text-white h-12 px-6"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </NextButton>
          </form>
          {message && (
            <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

