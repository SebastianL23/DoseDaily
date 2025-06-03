import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseKey 
  })
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    console.log('Creating order with data:', body)

    // Validate required fields
    if (!body.items || !body.total || !body.currency || !body.shipping_address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate shipping address fields
    const requiredShippingFields = ['line1', 'city', 'postal_code', 'country']
    const missingShippingFields = requiredShippingFields.filter(
      field => !body.shipping_address[field]
    )

    if (missingShippingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing shipping fields: ${missingShippingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create order in Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        payment_status: 'pending',
        amount: body.total,
        currency: body.currency,
        items: body.items,
        customer_email: body.customer_email,
        shipping_address: {
          line1: body.shipping_address.line1,
          line2: body.shipping_address.line2 || null,
          city: body.shipping_address.city,
          postal_code: body.shipping_address.postal_code,
          country: body.shipping_address.country
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    console.log('Order created:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in create-order:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
