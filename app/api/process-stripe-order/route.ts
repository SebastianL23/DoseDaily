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
      const shippoResponse = await fetch('/api/shippo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderData: {
            to_address: {
              line1: body.shippingAddress.line1,
              line2: body.shippingAddress.line2,
              city: body.shippingAddress.city,
              postal_code: body.shippingAddress.postal_code,
              country: body.shippingAddress.country,
              email: body.shippingAddress.email
            },
            line_items: [{
              title: 'Cart Purchase',
              sku: 'CBD-ORDER',
              quantity: 1,
              total_price: (body.paymentData.amount_total / 100).toFixed(2), // Convert from pence
              currency: body.paymentData.currency.toUpperCase(),
              weight: "1",
              weight_unit: "kg"
            }],
            placed_at: new Date().toISOString(),
            order_number: orderId,
            order_status: "PAID",
            shipping_cost: "0.00",
            shipping_cost_currency: "GBP",
            shipping_method: "Hermes UK ParcelShop Drop-Off",
            subtotal_price: (body.paymentData.amount_total / 100).toFixed(2),
            total_price: (body.paymentData.amount_total / 100).toFixed(2),
            total_tax: "0.00",
            currency: "GBP",
            weight: "1",
            weight_unit: "kg"
          },
          shippingAddress: body.shippingAddress,
          items: [{
            name: 'Cart Purchase',
            price: body.paymentData.amount_total / 100,
            quantity: 1
          }]
        })
      })

      const shippoData = await shippoResponse.json()
      
      if (!shippoResponse.ok) {
        console.error('Shippo API error:', shippoData)
        // Don't fail the entire order if shipping label creation fails
        // Just log the error and continue
      }

      return NextResponse.json({
        success: true,
        orderId: orderId,
        sessionId: body.sessionId,
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