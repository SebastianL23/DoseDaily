import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)
    
    // Validate required fields
    if (!body.name || !body.local_price?.amount || !body.local_price?.currency) {
      console.error('Missing required fields:', body)
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate price is a positive number
    const price = parseFloat(body.local_price.amount)
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price:', body.local_price.amount)
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      )
    }

    // Get API key from environment
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY

    // Log environment check details
    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length,
      nodeEnv: process.env.NODE_ENV
    })

    // Validate API key exists
    if (!apiKey) {
      console.error('No Coinbase Commerce API key configured')
      return NextResponse.json(
        { error: 'Payment service is not configured' },
        { status: 500 }
      )
    }

    // Make request to Coinbase Commerce API
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    console.log('Coinbase Commerce API response:', data)

    if (!response.ok) {
      console.error('Coinbase Commerce API error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'Failed to create charge' },
        { status: response.status }
      )
    }

    // Handle web3 retail payment response
    if (data.data?.hosted_url) {
      return NextResponse.json({ hosted_url: data.data.hosted_url })
    } else if (data.hosted_url) {
      return NextResponse.json({ hosted_url: data.hosted_url })
    } else if (data.data?.web3_retail_payment_metadata) {
      // If we have web3 retail payment metadata, return the hosted URL from there
      const hostedUrl = data.data.hosted_url || data.hosted_url
      if (hostedUrl) {
        return NextResponse.json({ hosted_url: hostedUrl })
      }
    }

    console.error('No hosted URL in response:', data)
    return NextResponse.json(
      { error: 'Invalid response from payment provider' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error creating charge:', error)
    return NextResponse.json(
      { error: 'Failed to create charge' },
      { status: 500 }
    )
  }
} 