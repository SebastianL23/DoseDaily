"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCart } from '@/components/cart-provider'

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
  email: string;
}

interface CoinbaseCheckoutProps {
  product: {
    name: string
    price: number
    description: string
  }
  onSuccess?: () => void
  onError?: (error: any) => void
}

export function CoinbaseCheckout({ product, onSuccess, onError }: CoinbaseCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { shippingAddress, discountEmail } = useCart()

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
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

      // Then create the Coinbase charge
      const response = await fetch('/api/create-charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          local_price: {
            amount: product.price.toString(),
            currency: 'GBP'
          },
          pricing_type: 'fixed_price',
          metadata: {
            order_id: orderData.id
          },
          redirect_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/products`
        })
      })

      const data = await response.json()
      console.log('Coinbase charge created:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create charge')
      }

      // Redirect to Coinbase Commerce checkout
      const hostedUrl = data.data?.hosted_url || data.hosted_url
      if (hostedUrl) {
        window.location.href = hostedUrl
      } else {
        throw new Error('No hosted URL in response')
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Checkout error:', error)
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
      className="w-full bg-moss-500 hover:bg-moss-600"
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Pay with Crypto'}
    </Button>
  )
} 