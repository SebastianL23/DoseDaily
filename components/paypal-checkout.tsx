"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCart } from '@/components/cart-provider'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

interface PayPalCheckoutProps {
  product: {
    name: string;
    price: number;
    description: string;
  };
  onSuccess: () => void;
  onError: (error: any) => void;
}

export function PayPalCheckout({ product, onSuccess, onError }: PayPalCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const { discountEmail } = useCart()

  // PayPal client ID from environment variables
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!paypalClientId) {
    console.error('No PayPal client ID found')
    return (
      <Button 
        className="w-full bg-moss-500 hover:bg-moss-600 text-white"
        disabled={true}
      >
        PayPal not configured
      </Button>
    )
  }

  const createPayPalOrder = async () => {
    try {
      // Create the order in our backend (shipping address will come from PayPal)
      console.log('Creating order with data:', {
        items: [{
          name: product.name,
          price: product.price,
          quantity: 1,
          description: product.description
        }],
        total: product.price,
        currency: 'GBP',
        customer_email: discountEmail
      })

      const orderPayload: any = {
        items: [{
          name: product.name,
          price: product.price,
          quantity: 1,
          description: product.description
        }],
        total: product.price,
        currency: 'GBP'
      }

      // Only add customer_email if it's not empty
      if (discountEmail && discountEmail.trim()) {
        orderPayload.customer_email = discountEmail
      }

      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      })

      const orderData = await orderResponse.json()
      console.log('Order created successfully:', orderData)

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Create PayPal order
      const paypalOrderResponse = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product.price,
          currency: 'GBP',
          description: product.description,
          metadata: {
            order_id: orderData.id,
            product_name: product.name
          }
        })
      })

      const paypalOrderData = await paypalOrderResponse.json()
      console.log('PayPal order response:', paypalOrderData)

      if (!paypalOrderResponse.ok) {
        throw new Error(paypalOrderData.error || 'Failed to create PayPal order')
      }

      setOrderId(orderData.id)
      return paypalOrderData.id

    } catch (error) {
      console.error('PayPal order creation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order'
      toast.error(errorMessage)
      if (onError) {
        onError(error)
      }
      throw error
    }
  }

  const onApprove = async (data: any) => {
    setIsLoading(true)
    try {
      console.log('PayPal payment approved:', data)

      // Capture the payment
      const captureResponse = await fetch('/api/capture-paypal-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
          orderId: orderId // Our internal order ID
        })
      })

      const captureData = await captureResponse.json()
      console.log('Payment capture response:', captureData)

      if (!captureResponse.ok) {
        throw new Error(captureData.error || 'Failed to capture payment')
      }

      if (captureData.status === 'COMPLETED') {
        toast.success('Payment successful!')
        if (onSuccess) {
          onSuccess()
        }
      } else {
        throw new Error('Payment was not completed')
      }

    } catch (error) {
      console.error('PayPal payment capture error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment'
      toast.error(errorMessage)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayPalError = (err: any) => {
    console.error('PayPal error:', err)
    const errorMessage = 'PayPal payment failed. Please try again.'
    toast.error(errorMessage)
    if (onError) {
      onError(err)
    }
  }

  const onCancel = () => {
    console.log('PayPal payment cancelled')
    toast.info('Payment cancelled')
  }

  return (
    <PayPalScriptProvider options={{ 
      clientId: paypalClientId,
      currency: "GBP",
      intent: "capture"
    }}>
      <div className="w-full">
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "pay"
          }}
          createOrder={createPayPalOrder}
          onApprove={onApprove}
          onError={handlePayPalError}
          onCancel={onCancel}
          disabled={isLoading}
        />
      </div>
    </PayPalScriptProvider>
  )
} 