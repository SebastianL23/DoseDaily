"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Add type assertions for components
const NextButton = Button as any
const NextInput = Input as any

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    
    try {
      const response = await fetch("/api/mailerlite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }

      setStatus("success")
      setMessage("Thank you for subscribing!")
      setEmail("")
      setName("")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
      <p className="text-gray-200 mb-8">
        Subscribe to our newsletter to receive the latest CBD news, research, and wellness tips directly to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="flex-1">
          <NextInput 
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="bg-moss-700/50 border-moss-600 text-white placeholder:text-gray-400 focus:ring-moss-500 focus:border-moss-500 px-4 rounded-lg mb-2 sm:mb-0"
          />
          <NextInput 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            className="bg-moss-700/50 border-moss-600 text-white placeholder:text-gray-400 focus:ring-moss-500 focus:border-moss-500 px-4 rounded-lg"
          />
        </div>
        <NextButton 
          type="submit"
          disabled={status === "loading"}
          className="bg-moss-500 hover:bg-moss-600 text-white rounded-lg"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </NextButton>
      </form>
      {message && (
        <p className={`mt-4 text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  )
} 