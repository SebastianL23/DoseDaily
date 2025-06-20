"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { toast } from "sonner"
import { CoinbaseCheckout } from "@/components/coinbase-checkout"
import { StripeCheckout } from "@/components/stripe-checkout"
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
    shippingAddress,
    setShippingAddress,
    clearCart
  } = useCart() as unknown as {
    cart: any[];
    updateQuantity: (id: number, quantity: number) => void;
    removeFromCart: (id: number) => void;
    discountEmail: string;
    discount: any;
    applyDiscount: (code: string) => void;
    shippingAddress: ShippingAddress;
    setShippingAddress: (value: ShippingAddress | ((prev: ShippingAddress) => ShippingAddress)) => void;
    clearCart: () => void;
  }

  const initialized = React.useRef(false);

  // Initialize shipping address with default values only once
  useEffect(() => {
    if (!initialized.current) {
      setShippingAddress({
        line1: '',
        line2: '',
        city: '',
        postal_code: '',
        country: 'United Kingdom',
        email: ''
      });
      initialized.current = true;
    }
  }, [setShippingAddress]);

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

  const createOrder = async () => {
    try {
      const orderData = {
        to_address: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
          email: shippingAddress.email
        },
        line_items: formatLineItems(cart),
        placed_at: new Date().toISOString(),
        order_number: `CBD-${Date.now()}`,
        order_status: "PAID",
        shipping_cost: shipping.toString(),
        shipping_cost_currency: "GBP",
        shipping_method: "Hermes UK ParcelShop Drop-Off",
        subtotal_price: subtotal.toFixed(2),
        total_price: total.toFixed(2),
        total_tax: "0.00",
        currency: "GBP",
        weight: "1",
        weight_unit: "kg"
      };

      const response = await fetch('/api/shippo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData,
          shippingAddress,
          items: cart
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
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

            {/* Add Shipping Address Form */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="shipping-line1" className="block text-sm font-medium text-gray-700">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    id="shipping-line1"
                    value={shippingAddress.line1}
                    onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, line1: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="shipping-line2" className="block text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="shipping-line2"
                    value={shippingAddress.line2}
                    onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, line2: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shipping-city" className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      id="shipping-city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, city: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="shipping-postal_code" className="block text-sm font-medium text-gray-700">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      id="shipping-postal_code"
                      value={shippingAddress.postal_code}
                      onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, postal_code: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shipping-country" className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <select
                    id="shipping-country"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, country: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                    required
                  >
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="shipping-email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="shipping-email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                    required
                    placeholder="your@email.com"
                  />
                </div>

                {/* Add validation message */}
                {shippingAddress.country !== "United Kingdom" && (
                  <p className="text-red-500 text-sm mt-1">
                    Currently, we only ship to addresses within the United Kingdom.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <CoinbaseCheckout 
                product={{
                  name: 'Cart Purchase',
                  price: total,
                  description: description
                }}
                onSuccess={async () => {
                  try {
                    // Validate shipping address is in UK
                    if (shippingAddress.country !== "United Kingdom") {
                      toast.error("We currently only ship to UK addresses");
                      return;
                    }

                    // Validate required fields
                    if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postal_code || !shippingAddress.email) {
                      toast.error("Please fill in all required shipping address fields");
                      return;
                    }

                    // Call Shippo API to create shipping label
                    const shippoData = await createOrder();

                    // Show success message
                    const shippingCost = shippoData.selectedRate?.amount || '0';
                    toast.success(`Payment successful! Shipping label created with ${shippoData.selectedRate?.provider} (${shippingCost} GBP)`);
                    
                    // Clear the cart after successful purchase
                    clearCart();
                  } catch (error) {
                    console.error('Error processing order:', error);
                    toast.error('Payment successful but failed to process order');
                  }
                }}
                onError={(error) => {
                  toast.error(error.message || 'Payment failed');
                }}
              />
              
              <div className="mt-3">
                <StripeCheckout 
                  product={{
                    name: 'Cart Purchase',
                    price: total,
                    description: description
                  }}
                  onSuccess={async () => {
                    try {
                      // Validate shipping address is in UK
                      if (shippingAddress.country !== "United Kingdom") {
                        toast.error("We currently only ship to UK addresses");
                        return;
                      }

                      // Validate required fields
                      if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postal_code || !shippingAddress.email) {
                        toast.error("Please fill in all required shipping address fields");
                        return;
                      }

                      // Call Shippo API to create shipping label
                      const shippoData = await createOrder();

                      // Show success message
                      const shippingCost = shippoData.selectedRate?.amount || '0';
                      toast.success(`Payment successful! Shipping label created with ${shippoData.selectedRate?.provider} (${shippingCost} GBP)`);
                      
                      // Clear the cart after successful purchase
                      clearCart();
                    } catch (error) {
                      console.error('Error processing order:', error);
                      toast.error('Payment successful but failed to process order');
                    }
                  }}
                  onError={(error) => {
                    toast.error(error.message || 'Payment failed');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
