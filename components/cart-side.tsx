"use client"

import { useState } from "react"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

// Add type assertions
const NextButton = Button as any
const NextInput = Input as any

// Add this interface at the top of the file
interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
}

export default function CartSide() {
  const { cart, applyDiscount, discount } = useCart()
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

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-600 mb-4 text-center">Add some products to your cart to checkout.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-medium">£{subtotal.toFixed(2)}</p>
        </div>
        {discount && discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <p>Discount ({discount.code}) - 10% off</p>
            <p>-£{discountAmount.toFixed(2)}</p>
          </div>
        )}
        <div className="flex justify-between">
          <p className="text-gray-600">Shipping</p>
          <p className="font-medium">{shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}</p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <p className="text-gray-900 font-medium">Total</p>
            <p className="text-gray-900 font-bold">£{total.toFixed(2)}</p>
          </div>
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
        
        <div className="mt-6">
          <NextButton 
            className="w-full bg-moss-500 hover:bg-moss-600" 
            onClick={() => window.location.href = '/cart'}
          >
            Checkout
          </NextButton>
        </div>
      </div>
    </div>
  )
} 