"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCart } from '@/components/cart-provider'
import { loadStripe } from '@stripe/stripe-js'

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
  email: string;
}

interface StripeCheckoutProps {
  product: {
    name: string;
    price: number;
    description: string;
  };
  onSuccess: () => void;
  onError: (error: any) => void;
}

export function StripeCheckout({ product, onSuccess, onError }: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [stripe, setStripe] = useState<any>(null)
  const { shippingAddress, discountEmail } = useCart()

  // Initialize Stripe
  useEffect(() => {
    const initStripe = async () => {
      // You'll need to add STRIPE_PUBLISHABLE_KEY to your environment variables
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      console.log('Initializing Stripe with key:', publishableKey?.substring(0, 20) + '...')
      
      if (!publishableKey) {
        console.error('No Stripe publishable key found')
        return
      }
      
      const stripeInstance = await loadStripe(publishableKey)
      console.log('Stripe initialized:', !!stripeInstance)
      setStripe(stripeInstance)
    }
    initStripe()
  }, [])

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      // Validate shipping address is in UK
      if (shippingAddress.country !== "United Kingdom") {
        throw new Error("We currently only ship to UK addresses");
      }

      // Validate required fields
      if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postal_code || !shippingAddress.email) {
        throw new Error("Please fill in all required shipping address fields");
      }

      // Transform shipping address to match expected format
      const formattedShippingAddress = {
        ...shippingAddress,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        postal_code: shippingAddress.postal_code
      };

      // First create the order in our backend
      console.log('Creating order with data:', {
        items: [{
          name: product.name,
          price: product.price,
          quantity: 1,
          description: product.description
        }],
        total: product.price,
        currency: 'GBP',
        customer_email: discountEmail,
        shipping_address: formattedShippingAddress
      })

      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            name: product.name,
            price: product.price,
            quantity: 1,
            description: product.description
          }],
          total: product.price,
          currency: 'GBP',
          customer_email: discountEmail,
          shipping_address: formattedShippingAddress
        })
      })

      const orderData = await orderResponse.json()
      console.log('Order created successfully:', orderData)

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Create a payment intent instead of a direct charge
      const paymentIntentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(product.price * 100), // Convert to pence
          currency: 'gbp',
          description: product.description,
          metadata: {
            order_id: orderData.id,
            product_name: product.name
          }
        })
      })

      const paymentIntentData = await paymentIntentResponse.json()
      console.log('Payment intent response:', paymentIntentData)

      if (!paymentIntentResponse.ok) {
        throw new Error(paymentIntentData.error || 'Failed to create payment intent')
      }

      // Redirect to Stripe Checkout
      if (stripe) {
        console.log('Redirecting to checkout with session ID:', paymentIntentData.sessionId)
        const { error } = await stripe.redirectToCheckout({
          sessionId: paymentIntentData.sessionId
        })

        if (error) {
          console.error('Stripe redirect error:', error)
          throw new Error(error.message)
        }
      } else {
        throw new Error('Stripe not initialized')
      }

    } catch (error) {
      console.error('Stripe checkout error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment'
      toast.error(errorMessage)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleCheckout}
      className="w-full bg-moss-500 hover:bg-moss-600 text-white"
      disabled={isLoading || !stripe}
    >
      {isLoading ? 'Processing...' : 'Pay with Card'}
    </Button>
  )
} 