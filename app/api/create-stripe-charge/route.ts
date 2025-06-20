import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received Stripe charge request body:', body)
    
    // Validate required fields
    if (!body.amount || !body.currency || !body.source) {
      console.error('Missing required fields for Stripe charge:', body)
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency, and source are required' },
        { status: 400 }
      )
    }

    // Validate amount is a positive integer (Stripe expects amounts in smallest currency unit)
    const amount = parseInt(body.amount)
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid amount for Stripe charge:', body.amount)
      return NextResponse.json(
        { error: 'Invalid amount - must be a positive integer in smallest currency unit' },
        { status: 400 }
      )
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    // Enhanced environment check logging
    console.log('Stripe environment check details:', {
      hasStripeKey: !!stripeSecretKey,
      stripeKeyLength: stripeSecretKey?.length,
      stripeKeyPrefix: stripeSecretKey?.substring(0, 8) + '...', // Log first 8 chars for debugging
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('STRIPE'))
    })

    // Validate Stripe key exists
    if (!stripeSecretKey) {
      console.error('No Stripe secret key configured')
      return NextResponse.json(
        { error: 'Payment service is not configured' },
        { status: 500 }
      )
    }

    // Prepare the charge data for Stripe
    const chargeData: Record<string, string> = {
      amount: amount.toString(),
      currency: body.currency.toLowerCase(),
      source: body.source,
      description: body.description || 'Cart Purchase',
      receipt_email: body.receipt_email,
      statement_descriptor: body.statement_descriptor,
      capture: 'true' // Automatically capture the charge
    }

    // Add metadata if provided
    if (body.metadata) {
      Object.entries(body.metadata).forEach(([key, value]) => {
        chargeData[`metadata[${key}]`] = value as string
      })
    }

    // Add shipping if provided
    if (body.shipping) {
      Object.entries(body.shipping).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            chargeData[`shipping[${key}][${subKey}]`] = subValue as string
          })
        } else {
          chargeData[`shipping[${key}]`] = value as string
        }
      })
    }

    console.log('Creating Stripe charge with data:', {
      ...chargeData,
      source: chargeData.source?.substring(0, 8) + '...' // Only log first 8 chars of source
    })

    // Make request to Stripe API
    const response = await fetch('https://api.stripe.com/v1/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2023-10-16'
      },
      body: new URLSearchParams(chargeData).toString()
    })

    const data = await response.json()
    console.log('Stripe API response:', {
      status: response.status,
      statusText: response.statusText,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    })

    if (!response.ok) {
      console.error('Stripe API error:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      })
      return NextResponse.json(
        { error: data.error?.message || 'Failed to create charge' },
        { status: response.status }
      )
    }

    // Return the successful charge data
    return NextResponse.json({
      success: true,
      charge: data,
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      paid: data.paid,
      receipt_url: data.receipt_url
    })

  } catch (error) {
    console.error('Error creating Stripe charge:', error)
    return NextResponse.json(
      { error: 'Failed to create charge' },
      { status: 500 }
    )
  }
} 