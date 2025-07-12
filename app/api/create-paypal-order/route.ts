import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received PayPal order request body:', body)
    
    // Validate required fields
    if (!body.amount || !body.currency) {
      console.error('Missing required fields for PayPal order:', body)
      return NextResponse.json(
        { error: 'Missing required fields: amount and currency are required' },
        { status: 400 }
      )
    }

    // Validate amount is a positive number
    const amount = parseFloat(body.amount)
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid amount for PayPal order:', body.amount)
      return NextResponse.json(
        { error: 'Invalid amount - must be a positive number' },
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

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: body.currency.toUpperCase(),
            value: amount.toFixed(2)
          },
          description: body.description || 'Cart Purchase',
          custom_id: body.metadata?.order_id || `order_${Date.now()}`
        }
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`
      }
    }

    console.log('Creating PayPal order with data:', orderData)

    const orderResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(orderData)
    })

    const orderResult = await orderResponse.json()
    console.log('PayPal order response:', {
      status: orderResponse.status,
      statusText: orderResponse.statusText,
      data: orderResult
    })

    if (!orderResponse.ok) {
      console.error('PayPal order creation error:', orderResult)
      return NextResponse.json(
        { error: orderResult.error_description || orderResult.message || 'Failed to create PayPal order' },
        { status: orderResponse.status }
      )
    }

    // Return the order ID for PayPal buttons
    return NextResponse.json({
      success: true,
      id: orderResult.id,
      status: orderResult.status
    })

  } catch (error) {
    console.error('Error creating PayPal order:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
} 