"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useCart } from "./cart-provider"
import { toast } from "sonner"

const NextImage = Image as any
const NextLink = Link as any
const NextButton = Button as any
const NextSheet = Sheet as any
const NextSheetContent = SheetContent as any
const NextSheetHeader = SheetHeader as any
const NextSheetTitle = SheetTitle as any
const NextSheetTrigger = SheetTrigger as any
const NextShoppingBag = ShoppingBag as any
const NextMinus = Minus as any
const NextPlus = Plus as any
const NextTrash2 = Trash2 as any
const NextInput = Input as any

export default function CartSheet({ children }: { children: ReactNode }) {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart,
    discount,
    applyDiscount
  } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [discountEmail, setDiscountEmail] = useState("")
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 75 ? 0 : 5.99
  const discountAmount = discount
    ? (subtotal + shipping) * 0.1 // 10% discount on total (subtotal + shipping)
    : 0
  const total = Math.max(0, subtotal + shipping - discountAmount)
  const description = cart.map(item => `${item.name} x${item.quantity}`).join(', ')

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code')
      return
    }
    if (!discountEmail.trim()) {
      toast.error('Please enter your email')
      return
    }

    setIsApplyingDiscount(true)
    try {
      const result = await applyDiscount(discountCode, discountEmail)
      
      if (result.success) {
        toast.success(result.message)
        setDiscountCode("")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to apply discount code')
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      setIsProcessing(true)
      const response = await fetch('/api/create-charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Cart Purchase',
          description: description,
          local_price: {
            amount: total.toString(),
            currency: 'GBP'
          },
          pricing_type: 'fixed_price',
          metadata: {
            product_id: 'cart_purchase',
            quantity: cart.length.toString()
          },
          redirect_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/products`
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create charge')
      }

      toast.success('Redirecting to payment...')
      const hostedUrl = data.hosted_url || data.data?.hosted_url
      if (hostedUrl) {
        window.location.href = hostedUrl
      } else {
        throw new Error('No hosted URL in response')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process checkout. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <NextSheet>
      <NextSheetTrigger asChild>{children}</NextSheetTrigger>
      <NextSheetContent 
        className="w-full sm:max-w-md" 
        title="Shopping Cart"
        aria-describedby="cart-description"
      >
        <div id="cart-description" className="sr-only">
          Your shopping cart containing {cart.reduce((total, item) => total + item.quantity, 0)} items
        </div>
        <NextSheetHeader className="mb-6">
          <NextSheetTitle className="flex items-center">
            <NextShoppingBag className="mr-2 h-5 w-5" />
            Your Cart ({cart.reduce((total, item) => total + item.quantity, 0)} items)
          </NextSheetTitle>
        </NextSheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <NextShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6 text-center">
              Looks like you haven't added any products to your cart yet.
            </p>
            <NextButton asChild className="bg-moss-500 hover:bg-moss-600">
              <NextLink href="/products">Shop Now</NextLink>
            </NextButton>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <NextImage src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <NextLink href={`/products/${item.id}`} className="hover:text-green-600">
                              {item.name}
                            </NextLink>
                          </h3>
                          <p className="ml-4">£{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        {item.selectedStrength && (
                          <p className="mt-1 text-sm text-gray-500">Strength: {item.selectedStrength}</p>
                        )}
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <div className="flex items-center">
                          <NextButton
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <NextMinus className="h-3 w-3" />
                          </NextButton>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <NextButton
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <NextPlus className="h-3 w-3" />
                          </NextButton>
                        </div>
                        <NextButton
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <NextTrash2 className="h-4 w-4" />
                        </NextButton>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="space-y-4">
                <div className="flex justify-between text-base text-gray-900">
                  <p>Subtotal</p>
                  <p>£{subtotal.toFixed(2)}</p>
                </div>
                {discount && discountAmount > 0 && (
                  <div className="flex justify-between text-base text-green-600">
                    <p>Discount ({discount.code}) - 10% off</p>
                    <p>-£{discountAmount.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between text-base text-gray-900">
                  <p>Shipping</p>
                  <p>{shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>£{total.toFixed(2)}</p>
                </div>

                {/* Discount Code Section */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Apply Discount Code</h3>
                  <div className="space-y-3">
                    <NextInput
                      type="text"
                      value={discountCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Enter discount code"
                      className="w-full"
                      disabled={isApplyingDiscount}
                    />
                    <NextInput
                      type="email"
                      value={discountEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full"
                      disabled={isApplyingDiscount}
                    />
                    <NextButton
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount}
                      className="w-full bg-moss-500 hover:bg-moss-600"
                    >
                      {isApplyingDiscount ? 'Applying...' : 'Apply Discount'}
                    </NextButton>
                  </div>
                </div>

                <NextButton 
                  className="w-full bg-moss-500 hover:bg-moss-600"
                  onClick={() => window.location.href = '/cart'}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Checkout'}
                </NextButton>
              </div>
            </div>
          </>
        )}
      </NextSheetContent>
    </NextSheet>
  )
}
