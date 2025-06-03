"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "./cart-provider"
import CartSheet from "./cart-sheet"
import { useRouter } from "next/navigation"

const NextLink = Link as any
const NextImage = Image as any
const NextButton = Button as any
const NextInput = Input as any
const NextSheet = Sheet as any
const NextSheetContent = SheetContent as any
const NextSheetTrigger = SheetTrigger as any
const NextMenu = Menu as any
const NextSearch = Search as any
const NextShoppingCart = ShoppingCart as any
const NextX = X as any

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { cart } = useCart()

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NextLink href="/" className="flex items-center">
              <NextImage src="/images/logo.png" alt="Dose Daily Logo" width={120} height={120} className="h-28 w-auto" />
            </NextLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NextLink href="/" className="text-gray-600 hover:text-moss-500 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-moss-500 after:transition-all after:duration-300">
              Home
            </NextLink>
            <NextLink href="/products" className="text-gray-600 hover:text-moss-500 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-moss-500 after:transition-all after:duration-300">
              Shop
            </NextLink>
            <NextLink href="/blog" className="text-gray-600 hover:text-moss-500 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-moss-500 after:transition-all after:duration-300">
              Blog
            </NextLink>
            <NextLink href="/contact" className="text-gray-600 hover:text-moss-500 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-moss-500 after:transition-all after:duration-300">
              Contact
            </NextLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <NextButton variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <NextSearch className="h-5 w-5" />
            </NextButton>

            <CartSheet>
              <NextButton variant="ghost" size="icon" className="relative">
                <NextShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-moss-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </NextButton>
            </CartSheet>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <NextButton variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <NextSearch className="h-5 w-5" />
            </NextButton>
            <CartSheet>
              <NextButton variant="ghost" size="icon" className="relative">
                <NextShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-moss-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </NextButton>
            </CartSheet>
            <NextSheet>
              <NextSheetTrigger asChild>
                <NextButton variant="ghost" size="icon">
                  <NextMenu className="h-5 w-5" />
                </NextButton>
              </NextSheetTrigger>
              <NextSheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <NextImage
                        src="/images/logo.png"
                        alt="Dose Daily Logo"
                        width={84}
                        height={84}
                        className="h-20 w-auto"
                      />
                    </div>
                  </div>
                  <nav className="flex flex-col space-y-4">
                    <NextLink href="/" className="text-gray-600 hover:text-moss-500 font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-moss-500 after:transition-all after:duration-300">
                      Home
                    </NextLink>
                    <NextLink href="/products" className="text-gray-600 hover:text-moss-500 font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-moss-500 after:transition-all after:duration-300">
                      Shop
                    </NextLink>
                    <NextLink href="/blog" className="text-gray-600 hover:text-moss-500 font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-moss-500 after:transition-all after:duration-300">
                      Blog
                    </NextLink>
                    <NextLink href="/contact" className="text-gray-600 hover:text-moss-500 font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-moss-500 after:transition-all after:duration-300">
                      Contact
                    </NextLink>
                  </nav>
                </div>
              </NextSheetContent>
            </NextSheet>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
            <NextInput 
              type="text" 
              placeholder="Search products..." 
              className="pr-10"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            <NextButton
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <NextSearch className="h-5 w-5" />
            </NextButton>
          </form>
        </div>
      )}
    </header>
  )
}
