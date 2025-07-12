import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received PayPal payment capture request:', body)
    
    // Validate required fields
    if (!body.orderID) {
      console.error('Missing order ID for PayPal payment capture')
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get PayPal client ID and secret from environment
    const paypalClientId = process.env.PAYPAL_CLIENT_ID
    const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET

    // Validate PayPal credentials exist
    if (!paypalClientId || !paypalClientSecret) {
      console.error('No PayPal credentials configured')
      return NextResponse.json(
        { error: 'Payment service is not configured' },
        { status: 500 }
      )
    }

    // Determine PayPal environment (sandbox or live)
    const isProduction = process.env.NODE_ENV === 'production'
    const paypalBaseUrl = isProduction 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com'

    // Get PayPal access token
    const tokenResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    })

    const tokenData = await tokenResponse.json()
    console.log('PayPal token response:', {
      status: tokenResponse.status,
      hasAccessToken: !!tokenData.access_token
    })

    if (!tokenResponse.ok) {
      console.error('PayPal token error:', tokenData)
      return NextResponse.json(
        { error: 'Failed to authenticate with PayPal' },
        { status: 500 }
      )
    }

    // Capture the payment
    console.log('Capturing PayPal payment for order:', body.orderID)

    const captureResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${body.orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    })

    const captureData = await captureResponse.json()
    console.log('PayPal capture response:', {
      status: captureResponse.status,
      statusText: captureResponse.statusText,
      data: captureData
    })

    if (!captureResponse.ok) {
      console.error('PayPal capture error:', captureData)
      return NextResponse.json(
        { error: captureData.error_description || captureData.message || 'Failed to capture payment' },
        { status: captureResponse.status }
      )
    }

    // Check if payment was successful
    if (captureData.status === 'COMPLETED') {
      console.log('PayPal payment captured successfully:', {
        orderID: body.orderID,
        captureID: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        amount: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
        status: captureData.status
      })

      // Process the order if we have an internal order ID
      if (body.orderId) {
        try {
          // Update order status in database
          const orderUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/process-paypal-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: body.orderId,
              paypalOrderId: body.orderID,
              paymentData: captureData
            })
          })

          if (!orderUpdateResponse.ok) {
            console.error('Failed to process order after PayPal capture')
            // Don't fail the payment capture if order processing fails
          }
        } catch (error) {
          console.error('Error processing order after PayPal capture:', error)
          // Don't fail the payment capture if order processing fails
        }
      }

      return NextResponse.json({
        success: true,
        status: captureData.status,
        captureID: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        amount: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
        currency: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code
      })
    } else {
      console.error('PayPal payment not completed:', captureData.status)
      return NextResponse.json(
        { error: 'Payment was not completed' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error capturing PayPal payment:', error)
    return NextResponse.json(
      { error: 'Failed to capture payment' },
      { status: 500 }
    )
  }
} 