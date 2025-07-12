import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received PayPal order processing request:', body)
    
    // Validate required fields
    if (!body.orderId || !body.paypalOrderId || !body.paymentData) {
      console.error('Missing required fields for PayPal order processing:', body)
      return NextResponse.json(
        { error: 'Missing required fields: orderId, paypalOrderId, and paymentData are required' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not configured')
      return NextResponse.json(
        { error: 'Database service is not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the original order from Supabase
    console.log('Fetching original order from Supabase...')
    const { data: originalOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', body.orderId)
      .single()

    if (fetchError) {
      console.error('Failed to fetch original order:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: 500 }
      )
    }

    console.log('Original order found:', originalOrder)

    // Update the original order's payment status
    console.log('Updating original order payment status...')
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_id: body.paypalOrderId,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.orderId)

    if (updateError) {
      console.error('Failed to update original order:', updateError)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    // Copy the order to paid_orders table
    console.log('Creating paid order...')
    const { error: paidOrderError } = await supabase
      .from('paid_orders')
      .insert({
        order_id: body.orderId,
        paypal_order_id: body.paypalOrderId,
        paypal_capture_id: body.paymentData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        customer_email: originalOrder.customer_email,
        items: originalOrder.items,
        total: originalOrder.total,
        currency: originalOrder.currency,
        payment_status: 'paid',
        created_at: new Date().toISOString()
      })

    if (paidOrderError) {
      console.error('Failed to create paid order:', paidOrderError)
      // Don't fail the entire process if this fails
    }

          // Create shipping label using Shippo (reusing existing logic)
      try {
        // Get the base URL for server-to-server API calls
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const shippoUrl = `${baseUrl}/api/shippo`
        
        console.log('Making request to Shippo API at:', shippoUrl)
        console.log('Payment data received:', JSON.stringify(body.paymentData, null, 2))
        
        // Extract shipping address from PayPal payment data
        const paypalShippingAddress = body.paymentData.purchase_units?.[0]?.shipping?.address
        const paypalPayer = body.paymentData.payer
        
        if (!paypalShippingAddress) {
          console.error('No shipping address found in PayPal payment data')
          throw new Error('No shipping address provided by PayPal')
        }
        
        const shippoResponse = await fetch(shippoUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shippingAddress: {
              name: `${paypalPayer?.name?.given_name || ''} ${paypalPayer?.name?.surname || ''}`.trim() || 'Customer',
              line1: paypalShippingAddress.address_line_1,
              line2: paypalShippingAddress.address_line_2 || '',
              city: paypalShippingAddress.admin_area_2,
              state: paypalShippingAddress.admin_area_1 || '',
              postal_code: paypalShippingAddress.postal_code,
              country: paypalShippingAddress.country_code,
              phone: paypalPayer?.phone?.phone_number?.national_number || '',
              email: paypalPayer?.email_address || originalOrder.customer_email
            },
            items: originalOrder.items.map((item: any) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              weight: "1",
              weight_unit: "kg"
            }))
          })
        })

      const shippoData = await shippoResponse.json()
      console.log('Shippo API response:', shippoData)
      
      if (!shippoResponse.ok) {
        console.error('Shippo API error:', shippoData)
        // Don't fail the entire order if shipping label creation fails
        // Just log the error and continue
      } else {
        console.log('Shipping label created successfully:', shippoData)
      }

    } catch (error) {
      console.error('Error creating shipping label:', error)
      // Don't fail the entire order if shipping label creation fails
    }

    return NextResponse.json({
      success: true,
      message: 'Order processed successfully',
      orderId: body.orderId,
      paypalOrderId: body.paypalOrderId
    })

  } catch (error) {
    console.error('Error processing PayPal order:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
} 