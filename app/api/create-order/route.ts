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
    if (!body.items || !body.total || !body.currency) {
      return NextResponse.json(
        { error: 'Missing required fields: items, total, and currency are required' },
        { status: 400 }
      )
    }

    // Create order in Supabase (shipping address will be added after PayPal payment)
    const { data, error } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        payment_status: 'pending',
        amount: body.total,
        currency: body.currency,
        items: body.items,
        customer_email: body.customer_email || null,
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
