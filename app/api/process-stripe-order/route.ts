import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received Stripe order processing request:', body)
    
    // Validate required fields
    if (!body.sessionId || !body.paymentData || !body.shippingAddress) {
      console.error('Missing required fields for order processing')
      return NextResponse.json(
        { error: 'Session ID, payment data, and shipping address are required' },
        { status: 400 }
      )
    }

    // Get the order ID from metadata
    const orderId = body.paymentData.metadata?.order_id
    if (!orderId) {
      console.error('No order ID found in payment metadata')
      return NextResponse.json(
        { error: 'No order ID found in payment metadata' },
        { status: 400 }
      )
    }

    // Create shipping label using Shippo (reusing existing logic)
    try {
      // Get the base URL for server-to-server API calls
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const shippoUrl = `${baseUrl}/api/shippo`
      
      console.log('Making request to Shippo API at:', shippoUrl)
      console.log('Payment data received:', JSON.stringify(body.paymentData, null, 2))
      console.log('Shipping address received:', JSON.stringify(body.shippingAddress, null, 2))
      
      const shippoResponse = await fetch(shippoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddress: {
            name: body.paymentData.customer_details?.name || 'Customer',
            line1: body.shippingAddress.line1,
            line2: body.shippingAddress.line2,
            city: body.shippingAddress.city,
            state: body.shippingAddress.state || '',
            postal_code: body.shippingAddress.postal_code,
            country: body.shippingAddress.country,
            phone: body.paymentData.customer_details?.phone || '',
            email: body.paymentData.customer_email || body.shippingAddress.email
          },
          items: [{
            name: body.paymentData.metadata?.product_name || 'Cart Purchase',
            price: body.paymentData.amount_total / 100,
            quantity: 1,
            weight: "1",
            weight_unit: "kg"
          }]
        })
      })

      const shippoData = await shippoResponse.json()
      console.log('Shippo API response:', shippoData)
      
      if (!shippoResponse.ok) {
        console.error('Shippo API error:', shippoData)
        // Don't fail the entire order if shipping label creation fails
        // Just log the error and continue
      }

      return NextResponse.json({
        success: true,
        orderId: orderId,
        sessionId: body.sessionId,
        payment_id: body.paymentData.payment_intent,
        customer_email: body.paymentData.customer_email,
        tracking_number: shippoData.transaction?.tracking_number || null,
        tracking_url: shippoData.transaction?.tracking_url || null,
        shippingData: shippoData,
        message: 'Order processed successfully'
      })

    } catch (error) {
      console.error('Error creating shipping label:', error)
      // Return success even if shipping label creation fails
      // The payment was successful, so we don't want to fail the entire order
      return NextResponse.json({
        success: true,
        orderId: orderId,
        sessionId: body.sessionId,
        payment_id: body.paymentData.payment_intent,
        customer_email: body.paymentData.customer_email,
        tracking_number: null,
        tracking_url: null,
        message: 'Order processed successfully (shipping label creation failed)'
      })
    }

  } catch (error) {
    console.error('Error processing Stripe order:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
} 