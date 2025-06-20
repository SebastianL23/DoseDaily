import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received payment intent request body:', body)
    
    // Validate required fields
    if (!body.amount || !body.currency) {
      console.error('Missing required fields for payment intent:', body)
      return NextResponse.json(
        { error: 'Missing required fields: amount and currency are required' },
        { status: 400 }
      )
    }

    // Validate amount is a positive integer
    const amount = parseInt(body.amount)
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid amount for payment intent:', body.amount)
      return NextResponse.json(
        { error: 'Invalid amount - must be a positive integer in smallest currency unit' },
        { status: 400 }
      )
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    // Validate Stripe key exists
    if (!stripeSecretKey) {
      console.error('No Stripe secret key configured')
      return NextResponse.json(
        { error: 'Payment service is not configured' },
        { status: 500 }
      )
    }

    // Create checkout session with Stripe
    const sessionData: Record<string, string> = {
      'payment_method_types[0]': 'card',
      'line_items[0][price_data][currency]': body.currency.toLowerCase(),
      'line_items[0][price_data][product_data][name]': body.description || 'Cart Purchase',
      'line_items[0][price_data][unit_amount]': amount.toString(),
      'line_items[0][quantity]': '1',
      'mode': 'payment',
      'success_url': `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
    }

    // Add metadata if provided
    if (body.metadata) {
      Object.entries(body.metadata).forEach(([key, value]) => {
        sessionData[`metadata[${key}]`] = value as string
      })
    }

    console.log('Creating Stripe checkout session with data:', sessionData)

    // Make request to Stripe API to create checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2023-10-16'
      },
      body: new URLSearchParams(sessionData).toString()
    })

    const data = await response.json()
    console.log('Stripe API response:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    })

    if (!response.ok) {
      console.error('Stripe API error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      })
      return NextResponse.json(
        { error: data.error?.message || 'Failed to create checkout session' },
        { status: response.status }
      )
    }

    // Return the session ID for redirect
    return NextResponse.json({
      success: true,
      sessionId: data.id,
      url: data.url
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
} 