import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received payment verification request:', body)
    
    // Validate required fields
    if (!body.sessionId) {
      console.error('Missing session ID for payment verification')
      return NextResponse.json(
        { error: 'Session ID is required' },
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

    // Retrieve the checkout session from Stripe
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${body.sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Stripe-Version': '2023-10-16'
      }
    })

    const data = await response.json()
    console.log('Stripe session verification response:', {
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
        { error: data.error?.message || 'Failed to verify payment' },
        { status: response.status }
      )
    }

    // Check if payment was successful
    if (data.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        payment_status: data.payment_status,
        amount_total: data.amount_total,
        currency: data.currency,
        customer_email: data.customer_details?.email,
        metadata: data.metadata,
        sessionId: data.id
      })
    } else {
      return NextResponse.json({
        success: false,
        payment_status: data.payment_status,
        error: 'Payment was not completed'
      })
    }

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
} 