"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { toast } from "sonner"
import { CoinbaseCheckout } from "@/components/coinbase-checkout"

// Add type assertions
const NextImage = Image as any
const NextLink = Link as any
const NextButton = Button as any
const NextMinus = Minus as any
const NextPlus = Plus as any
const NextTrash2 = Trash2 as any

interface ShippingAddress {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  is_residential: boolean;
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
          name: shippingAddress.name,
          company: shippingAddress.company,
          street1: shippingAddress.street1,
          street2: shippingAddress.street2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          email: shippingAddress.email,
          is_residential: true
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
                            <NextMinus className="h-3 w-3" />
                          </NextButton>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <NextButton
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
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
                  <label htmlFor="shipping-name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="shipping-name"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                  <div>
                    <label htmlFor="shipping-phone" className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="shipping-phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                      required
                      placeholder="07123456789"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shipping-street1" className="block text-sm font-medium text-gray-700">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    id="shipping-street1"
                    value={shippingAddress.street1}
                    onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, street1: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="shipping-street2" className="block text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="shipping-street2"
                    value={shippingAddress.street2}
                    onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, street2: e.target.value }))}
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
                    <label htmlFor="shipping-state" className="block text-sm font-medium text-gray-700">
                      County *
                    </label>
                    <input
                      type="text"
                      id="shipping-state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, state: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                      required
                      placeholder="e.g. Greater London"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shipping-zip" className="block text-sm font-medium text-gray-700">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      id="shipping-zip"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress((prev: ShippingAddress) => ({ ...prev, zip: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-moss-500 focus:ring-moss-500 sm:text-sm"
                      required
                    />
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
                    if (!shippingAddress.street1 || !shippingAddress.city || !shippingAddress.zip || !shippingAddress.email) {
                      toast.error("Please fill in all required shipping address fields");
                      return;
                    }

                    // Call Shippo API to create shipping label
                    const shippoData = await createOrder();

                    // Call MailerLite API to add subscriber and send tracking email
                    const mailerLiteResponse = await fetch('/api/mailerlite', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email: shippingAddress.email,
                        name: shippingAddress.street1.split(' ')[0], // Use first name from address
                        tracking_number: shippoData.tracking_number,
                        tracking_url: shippoData.tracking_url,
                        order_id: shippoData.order_id
                      }),
                    });

                    const mailerLiteData = await mailerLiteResponse.json();

                    if (!mailerLiteResponse.ok) {
                      console.error('MailerLite error:', mailerLiteData);
                      // Don't throw error here as the order was successful
                    }

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
    </main>
  )
}
