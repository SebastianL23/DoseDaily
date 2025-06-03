"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const NextDialog = Dialog as any
const NextDialogContent = DialogContent as any
const NextDialogDescription = DialogDescription as any
const NextDialogHeader = DialogHeader as any
const NextDialogTitle = DialogTitle as any
const NextSelect = Select as any
const NextSelectContent = SelectContent as any
const NextSelectItem = SelectItem as any
const NextSelectTrigger = SelectTrigger as any
const NextSelectValue = SelectValue as any
const NextCheckbox = Checkbox as any
const NextButton = Button as any
const NextImage = Image as any

export default function AgeVerification() {
  const [isOpen, setIsOpen] = useState(false)
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")
  const [year, setYear] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user has already verified their age
    const ageVerified = localStorage.getItem("age-verified")

    if (!ageVerified) {
      // Show modal after a short delay to ensure it renders properly
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleVerify = () => {
    setError("")

    // Basic validation
    if (!month || !day || !year) {
      setError("Please complete all date fields")
      return
    }

    // Convert to date object
    const birthDate = new Date(`${month}/${day}/${year}`)
    const today = new Date()

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    // Check if user is at least 21
    if (age < 21) {
      setError("You must be 21 or older to enter this site")
      return
    }

    // Store verification in localStorage if remember me is checked
    if (rememberMe) {
      localStorage.setItem("age-verified", "true")
    }

    // Close modal
    setIsOpen(false)
  }

  const handleExit = () => {
    // Redirect to a general information page or Google
    window.location.href = "https://www.google.com"
  }

  // Generate arrays for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString())

  return (
    <NextDialog open={isOpen} onOpenChange={setIsOpen}>
      <NextDialogContent className="sm:max-w-md" onInteractOutside={(e: React.MouseEvent) => e.preventDefault()}>
        <NextDialogHeader>
          <div className="mx-auto w-16 h-16 mb-4">
            <NextImage
              src="/images/logo.png"
              alt="CBD Shop Logo"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <NextDialogTitle className="text-center text-2xl">Age Verification</NextDialogTitle>
          <NextDialogDescription className="text-center">
            You must be 21 years or older to enter this website.
            <br />
            Please verify your age to continue.
          </NextDialogDescription>
        </NextDialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Date of Birth</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <NextSelect value={month} onValueChange={setMonth}>
                  <NextSelectTrigger>
                    <NextSelectValue placeholder="Month" />
                  </NextSelectTrigger>
                  <NextSelectContent>
                    {months.map((m, i) => (
                      <NextSelectItem key={m} value={(i + 1).toString()}>
                        {m}
                      </NextSelectItem>
                    ))}
                  </NextSelectContent>
                </NextSelect>
              </div>
              <div>
                <NextSelect value={day} onValueChange={setDay}>
                  <NextSelectTrigger>
                    <NextSelectValue placeholder="Day" />
                  </NextSelectTrigger>
                  <NextSelectContent>
                    {days.map((d) => (
                      <NextSelectItem key={d} value={d}>
                        {d}
                      </NextSelectItem>
                    ))}
                  </NextSelectContent>
                </NextSelect>
              </div>
              <div>
                <NextSelect value={year} onValueChange={setYear}>
                  <NextSelectTrigger>
                    <NextSelectValue placeholder="Year" />
                  </NextSelectTrigger>
                  <NextSelectContent>
                    {years.map((y) => (
                      <NextSelectItem key={y} value={y}>
                        {y}
                      </NextSelectItem>
                    ))}
                  </NextSelectContent>
                </NextSelect>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex items-center space-x-2">
            <NextCheckbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked: boolean) => setRememberMe(checked === true)}
              className="data-[state=checked]:bg-moss-500 data-[state=checked]:text-white"
            />
            <label htmlFor="remember" className="text-sm text-gray-500">
              Remember me on this device
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <NextButton onClick={handleVerify} className="flex-1 bg-moss-500 hover:bg-moss-600">
              I am 21 or older
            </NextButton>
            <NextButton onClick={handleExit} variant="outline" className="flex-1 border-moss-500 text-moss-500 hover:bg-moss-50">
              Exit
            </NextButton>
          </div>

          <p className="text-xs text-center text-gray-500">
            By entering this site, you agree to our{" "}
            <a href="/terms" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </NextDialogContent>
    </NextDialog>
  )
}
