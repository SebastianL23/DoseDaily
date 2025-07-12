"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { toast } from "sonner"
import { PayPalCheckout } from "@/components/paypal-checkout"
import React from "react"

// Add type assertions for components
const NextLink = Link as any
const NextButton = Button as any
const NextImage = Image as any

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
  email: string;
}

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    discountEmail,
    discount,
    applyDiscount,
    clearCart
  } = useCart() as unknown as {
    cart: any[];
    updateQuantity: (id: number, quantity: number) => void;
    removeFromCart: (id: number) => void;
    discountEmail: string;
    discount: any;
    applyDiscount: (code: string) => void;
    clearCart: () => void;
  }

  console.log('Cart data in page:', cart) // Debug log

  const [isProcessing, setIsProcessing] = useState(false)

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-lg text-gray-600">Your cart is empty</p>
            <NextButton 
              className="mt-4 bg-moss-500 hover:bg-moss-600"
              onClick={() => window.location.href = '/products'}
            >
              Continue Shopping
            </NextButton>
          </div>
        </div>
      </div>
    )
  }

  // Calculate total price
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 75 ? 0 : 5.99
  const discountAmount = discount
    ? (subtotal + shipping) * 0.1 // 10% discount on total (subtotal + shipping)
    : 0
  const total = Math.max(0, subtotal + shipping - discountAmount)
  const description = cart.map(item => `${item.name} x${item.quantity}`).join(', ')

  const formatLineItems = (cart: any[]) => {
    return cart.map(item => ({
      title: item.name,
      sku: `CBD-${item.id}`,
      quantity: item.quantity,
      total_price: (item.price * item.quantity).toFixed(2),
      currency: "GBP",
      weight: "1", // You might want to adjust this based on your products
      weight_unit: "kg"
    }));
  };



  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="py-6 flex">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
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
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <span className="h-4 w-4">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                              </svg>
                            </span>
                          </NextButton>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <NextButton
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <span className="h-4 w-4">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </span>
                          </NextButton>
                        </div>
                        <NextButton
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <span className="h-5 w-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </span>
                        </NextButton>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Order Summary and Shipping */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="flow-root">
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
              </div>
            </div>



            <div className="mt-6">
              <PayPalCheckout 
                product={{
                  name: 'Cart Purchase',
                  price: total,
                  description: description
                }}
                onSuccess={async () => {
                  try {
                    // Payment successful - order processing is handled by PayPal
                    toast.success('Payment successful! Your order is being processed.');
                    
                    // Clear the cart after successful purchase
                    clearCart();
                  } catch (error) {
                    console.error('Error processing order:', error);
                    toast.error('Payment successful but failed to process order');
                  }
                }}
                onError={(error: any) => {
                  toast.error(error.message || 'Payment failed');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
