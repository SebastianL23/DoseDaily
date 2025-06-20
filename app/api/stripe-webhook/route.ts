import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Verify the webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  webhookSecret: string
): boolean {
  try {
    // Allow test requests in development or with test signature
    if (process.env.NODE_ENV !== 'production' || signature === 'test-signature') {
      console.log('Accepting test signature')
      return true
    }

    console.log('Verifying Stripe webhook signature...')
    console.log('Payload length:', payload.length)
    console.log('Signature:', signature)
    console.log('Secret length:', webhookSecret.length)
    
    const hmac = crypto.createHmac('sha256', webhookSecret)
    const digest = hmac.update(payload).digest('hex')
    
    console.log('Generated digest:', digest)
    
    return crypto.timingSafeEqual(
      new Uint8Array(Buffer.from(signature)),
      new Uint8Array(Buffer.from(digest))
    )
  } catch (error) {
    console.error('Error in verifyWebhookSignature:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    // Get the webhook signature from headers
    const signature = request.headers.get('stripe-signature')
    const isDevelopment = process.env.NODE_ENV !== 'production'
    
    console.log('Stripe Webhook Environment:', {
      nodeEnv: process.env.NODE_ENV,
      isDevelopment,
      hasSignature: !!signature
    })

    if (!signature && !isDevelopment) {
      console.error('No Stripe webhook signature found')
      return NextResponse.json(
        { error: 'No webhook signature' },
        { status: 400 }
      )
    }

    // Get the webhook secret from environment variables
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    console.log('Environment variable check:', {
      hasSecret: !!webhookSecret,
      secretLength: webhookSecret?.length,
      envKeys: Object.keys(process.env).filter(key => key.includes('STRIPE'))
    })

    if (!webhookSecret && !isDevelopment) {
      console.error('Stripe webhook secret not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Get the raw payload
    const payload = await request.text()
    console.log('Received Stripe payload length:', payload.length)

    // In development, skip signature verification
    if (isDevelopment) {
      console.log('Development mode: skipping signature verification')
    } else if (signature && webhookSecret && !verifyWebhookSignature(payload, signature, webhookSecret)) {
      console.error('Invalid Stripe webhook signature')
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    // Parse the payload
    const event = JSON.parse(payload)
    console.log('=== Stripe Webhook Event Debug ===')
    console.log('Event Type:', event.type)
    console.log('Event Data:', JSON.stringify(event.data, null, 2))

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful payment
        console.log('Processing completed Stripe checkout session...')
        try {
          const session = event.data.object
          
          // Get the order ID from metadata
          const orderId = session.metadata?.order_id
          console.log('Order ID from metadata:', orderId)
          
          if (!orderId) {
            throw new Error('No order ID in Stripe session metadata')
          }

          // First, get the original order from Supabase
          console.log('Fetching original order from Supabase...')
          const { data: originalOrder, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

          if (fetchError) {
            console.error('Failed to fetch original order:', fetchError)
            throw fetchError
          }

          console.log('Original order found:', originalOrder)

          // Update the original order's payment status
          console.log('Updating original order payment status...')
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              payment_id: session.payment_intent,
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId)

          if (updateError) {
            console.error('Failed to update original order:', updateError)
            throw updateError
          }

          // Copy the order to paid_orders table
          console.log('Creating paid order...')
          const { data: paidOrder, error: insertError } = await supabase
            .from('paid_orders')
            .insert({
              original_order_id: orderId,
              payment_id: session.payment_intent,
              amount: session.amount_total / 100, // Convert from pence
              currency: session.currency.toUpperCase(),
              items: originalOrder.items,
              customer_email: session.customer_details?.email || originalOrder.customer_email,
              shipping_address: originalOrder.shipping_address, // Use the address from cart
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (insertError) {
            console.error('Failed to create paid order:', insertError)
            throw insertError
          }

          console.log('Paid order created:', paidOrder)

          // Create shipping label with Shippo (using the address from cart)
          try {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            console.log('Environment Check:', {
              baseUrl,
              nodeEnv: process.env.NODE_ENV,
              hasShippoToken: !!process.env.SHIPPO_API_TOKEN,
              appUrl: process.env.NEXT_PUBLIC_APP_URL
            });

            // Create from address (your business address)
            const fromAddress = {
              name: "Dose Daily",
              company: "Dose Daily",
              street1: "36 Woodacre",
              city: "Bristol",
              state: "avon",
              zip: "BS207BT",
              country: "United Kingdom",
              phone: "077990266704",
              email: "your@email.com",
              is_residential: false
            };

            // Create to address (customer's address from cart)
            const toAddress = {
              name: originalOrder.shipping_address.name || "Customer",
              street1: originalOrder.shipping_address.line1,
              street2: originalOrder.shipping_address.line2 || "",
              city: originalOrder.shipping_address.city,
              state: originalOrder.shipping_address.state || "",
              zip: originalOrder.shipping_address.postal_code,
              country: originalOrder.shipping_address.country,
              phone: originalOrder.shipping_address.phone || "",
              email: originalOrder.customer_email || "",
              is_residential: true
            };

            console.log('Creating addresses in Shippo:', {
              fromAddress,
              toAddress
            });

            // Create addresses in Shippo
            const fromAddressResponse = await fetch('https://api.goshippo.com/addresses/', {
              method: 'POST',
              headers: {
                'Authorization': `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(fromAddress),
            });

            const fromAddressData = await fromAddressResponse.json();
            console.log('From address response:', fromAddressData);

            if (!fromAddressResponse.ok) {
              throw new Error(`Failed to create from address: ${JSON.stringify(fromAddressData)}`);
            }

            const toAddressResponse = await fetch('https://api.goshippo.com/addresses/', {
              method: 'POST',
              headers: {
                'Authorization': `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(toAddress),
            });

            const toAddressData = await toAddressResponse.json();
            console.log('To address response:', toAddressData);

            if (!toAddressResponse.ok) {
              throw new Error(`Failed to create to address: ${JSON.stringify(toAddressData)}`);
            }

            // Create Shippo order
            const shippoOrder = {
              to_address: toAddressData.object_id,
              from_address: fromAddressData.object_id,
              line_items: originalOrder.items.map((item: any) => ({
                title: item.name,
                quantity: item.quantity,
                total_price: item.price.toString(),
                currency: originalOrder.currency,
                weight: "1",
                weight_unit: "kg"
              })),
              placed_at: new Date().toISOString(),
              order_status: "PAID",
              order_number: orderId,
              weight: "1",
              weight_unit: "kg",
              notes: "Disclaimer: All producrs on this website are available for purcahse by individuals agesd 18 and over. Porducts sold by DoseDaily LTD are not intended to diagnose, treat, cure, or prevent any disease. By purchasing from DoseDaily LTD, you agree to our terms and conditions."
            };

            console.log('Creating Shippo order:', shippoOrder);

            const orderResponse = await fetch('https://api.goshippo.com/orders/', {
              method: 'POST',
              headers: {
                'Authorization': `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(shippoOrder)
            });

            const orderData = await orderResponse.json();
            console.log('Shippo order response:', orderData);

            if (!orderResponse.ok) {
              throw new Error(`Failed to create Shippo order: ${JSON.stringify(orderData)}`);
            }

            // Get packing slip URL
            const packingslipResponse = await fetch(`https://api.goshippo.com/orders/${orderData.object_id}/packingslip/`, {
              method: 'GET',
              headers: {
                'Authorization': `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
              }
            });

            const packingslipData = await packingslipResponse.json();
            console.log('Packing slip response:', packingslipData);

            if (!packingslipResponse.ok) {
              throw new Error(`Failed to get packing slip: ${JSON.stringify(packingslipData)}`);
            }

            // Update paid_orders with packing slip URL
            const { error: packingslipUpdateError } = await supabase
              .from('paid_orders')
              .update({
                picking_slip_url: packingslipData.slip_url,
                updated_at: new Date().toISOString()
              })
              .eq('id', paidOrder.id);

            if (packingslipUpdateError) {
              console.error('Failed to update paid order with packing slip URL:', packingslipUpdateError);
              throw packingslipUpdateError;
            }

            // Create shipment with standard Hermes configuration
            const shipment = {
              address_from: fromAddressData.object_id,
              address_to: toAddressData.object_id,
              parcels: originalOrder.items.map((item: any) => ({
                length: "25",
                width: "20",
                height: "5",
                distance_unit: "cm",
                weight: "1",
                mass_unit: "kg",
              })),
              async: false
            };

            console.log('Creating shipment:', shipment);

            const shipmentResponse = await fetch('https://api.goshippo.com/shipments/', {
              method: 'POST',
              headers: {
                'Authorization': `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(shipment),
            });

            const shipmentData = await shipmentResponse.json();
            console.log('Shipment response:', shipmentData);

            if (!shipmentResponse.ok) {
              throw new Error(`Failed to create shipment: ${JSON.stringify(shipmentData)}`);
            }

            // Find the Hermes rate
            const hermesRate = shipmentData.rates.find((rate: any) => 
              rate.provider === "Hermes UK" && 
              rate.servicelevel.token === "hermes_uk_parcelshop_dropoff"
            ) || shipmentData.rates.find((rate: any) => 
              rate.provider === "Hermes UK"
            );

            if (!hermesRate) {
              throw new Error('No Hermes rate found for the shipment');
            }

            console.log('Selected rate:', hermesRate);

            // Create transaction
            const transaction = {
              rate: hermesRate.object_id,
              label_file_type: "PDF",
              async: false
            };

            console.log('Creating transaction:', transaction);

            const transactionResponse = await fetch('https://api.goshippo.com/transactions/', {
              method: 'POST',
              headers: {
                'Authorization': `ShippoToken ${process.env.SHIPPO_API_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(transaction),
            });

            const transactionData = await transactionResponse.json();
            console.log('Transaction response:', transactionData);

            if (!transactionResponse.ok) {
              throw new Error(`Failed to create transaction: ${JSON.stringify(transactionData)}`);
            }

            // Create tracking info
            const trackingInfo = {
              tracking_number: transactionData.tracking_number ? String(transactionData.tracking_number) : null,
              tracking_url: transactionData.tracking_url || null,
              tracking_status: transactionData.status || 'pending',
              estimated_delivery: transactionData.eta || null,
              updated_at: new Date().toISOString()
            };

            console.log('Tracking info to update:', trackingInfo);

            // Update the paid order with tracking information
            console.log('Updating paid order with tracking info...');
            const { data: updatedOrder, error: updateError } = await supabase
              .from('paid_orders')
              .update(trackingInfo)
              .eq('id', paidOrder.id)
              .select();

            if (updateError) {
              console.error('Failed to update paid order with tracking info:', {
                error: updateError,
                trackingInfo,
                orderId: paidOrder.id
              });
            } else {
              console.log('Successfully updated paid order with tracking info:', {
                updatedOrder,
                trackingInfo
              });
            }

            // Also update the original order with tracking info
            console.log('Updating original order with tracking info...');
            const { data: updatedOriginalOrder, error: updateOriginalError } = await supabase
              .from('orders')
              .update(trackingInfo)
              .eq('id', orderId)
              .select();

            if (updateOriginalError) {
              console.error('Failed to update original order with tracking info:', {
                error: updateOriginalError,
                trackingInfo,
                orderId
              });
            } else {
              console.log('Successfully updated original order with tracking info:', {
                updatedOriginalOrder,
                trackingInfo
              });
            }
          } catch (error: any) {
            console.error('Error creating shipping label:', {
              error,
              message: error?.message,
              stack: error?.stack,
              orderId,
              paidOrderId: paidOrder.id
            });
            // Don't throw error here, just log it
          }

          return NextResponse.json({
            success: true,
            message: 'Stripe payment confirmed and order processed',
            orderId: paidOrder.id,
            originalOrderId: orderId,
            paymentId: session.payment_intent,
            items: originalOrder.items,
            customerEmail: originalOrder.customer_email,
            shippingAddress: originalOrder.shipping_address
          });

        } catch (error) {
          console.error('Error processing Stripe payment:', error);
          return NextResponse.json(
            { error: 'Failed to process order', details: error },
            { status: 500 }
          );
        }
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Stripe payment failed:', event.data)
        try {
          const paymentIntent = event.data.object
          const orderId = paymentIntent.metadata?.order_id
          
          if (orderId) {
            // Update order status to failed in Supabase
            await supabase
              .from('orders')
              .update({
                payment_status: 'failed',
                payment_id: paymentIntent.id,
                updated_at: new Date().toISOString()
              })
              .eq('id', orderId)
          }
        } catch (error) {
          console.error('Failed to update failed order:', error)
        }
        break

      case 'payment_intent.canceled':
        // Handle canceled payment
        console.log('Stripe payment canceled:', event.data)
        try {
          const paymentIntent = event.data.object
          const orderId = paymentIntent.metadata?.order_id
          
          if (orderId) {
            // Update order status to canceled in Supabase
            await supabase
              .from('orders')
              .update({
                payment_status: 'canceled',
                payment_id: paymentIntent.id,
                updated_at: new Date().toISOString()
              })
              .eq('id', orderId)
          }
        } catch (error) {
          console.error('Failed to update canceled order:', error)
        }
        break

      default:
        console.log('Unhandled Stripe event type:', event.type)
        return NextResponse.json(
          { error: 'Unhandled event type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error in Stripe webhook handler:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook', details: error },
      { status: 500 }
    );
  }
}
