import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CartProvider from "@/components/cart-provider"
import AgeVerification from "@/components/age-verification"
import BotpressChat from "@/components/BotpressChat"
import { Playfair_Display } from 'next/font/google'
import { Toaster } from "sonner"

const canela = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-canela',
})

export const metadata: Metadata = {
  title: "Premium CBD Products | Modern CBD E-commerce",
  description:
    "Shop our premium selection of CBD oils, edibles, topicals and more. Lab-tested, high-quality CBD products delivered to your door.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={canela.variable}>
      <body className="font-canela" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <AgeVerification />
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">{children}</div>
              <Footer />
              <BotpressChat />
              <Toaster />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
