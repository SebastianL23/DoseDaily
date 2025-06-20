"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCart } from '@/components/cart-provider'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isProcessing, setIsProcessing] = useState(true)
  const [orderProcessed, setOrderProcessed] = useState(false)
  const { clearCart, shippingAddress } = useCart()

  useEffect(() => {
    const processOrder = async () => {
      if (!sessionId) {
        toast.error('No session ID found')
        setIsProcessing(false)
        return
      }

      try {
        // Verify the payment with Stripe
        const verifyResponse = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionId
          })
        })

        const verifyData = await verifyResponse.json()

        if (!verifyResponse.ok) {
          throw new Error(verifyData.error || 'Failed to verify payment')
        }

        if (verifyData.payment_status === 'paid') {
          // Process the order (create shipping label, etc.)
          const orderResponse = await fetch('/api/process-stripe-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId: sessionId,
              paymentData: verifyData,
              shippingAddress: shippingAddress
            })
          })

          const orderData = await orderResponse.json()

          if (!orderResponse.ok) {
            throw new Error(orderData.error || 'Failed to process order')
          }

          // Show success message
          toast.success('Payment successful! Your order has been processed.')
          setOrderProcessed(true)
          
          // Clear the cart
          clearCart()
        } else {
          throw new Error('Payment was not successful')
        }
      } catch (error) {
        console.error('Error processing order:', error)
        toast.error('Payment verification failed')
      } finally {
        setIsProcessing(false)
      }
    }

    processOrder()
  }, [sessionId, clearCart, shippingAddress])

  if (isProcessing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss-500 mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Payment</h1>
            <p className="text-gray-600">Please wait while we verify your payment and process your order...</p>
          </div>
        </div>
      </div>
    )
  }

  if (orderProcessed) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-6 text-center">
              Thank you for your purchase. Your order has been processed and will be shipped soon.
            </p>
            <div className="space-y-3">
              <Link href="/products">
                <Button className="bg-moss-500 hover:bg-moss-600">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-lg text-gray-600 mb-6 text-center">
            There was an issue processing your payment. Please try again.
          </p>
          <Link href="/cart">
            <Button className="bg-moss-500 hover:bg-moss-600">
              Return to Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 