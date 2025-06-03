import { NextResponse } from 'next/server';

const MAILERLITE_API_TOKEN = process.env.MAILERLITE_API_TOKEN;
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

interface Subscriber {
  email: string;
  fields?: {
    name?: string;
    tracking_number?: string;
    tracking_url?: string;
    order_id?: string;
  };
}

async function addSubscriber(subscriber: Subscriber) {
  try {
    console.log('Adding subscriber to MailerLite:', subscriber);
    
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(subscriber)
    });

    const responseData = await response.json();
    console.log('MailerLite API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    if (!response.ok) {
      throw new Error(`Failed to add subscriber: ${JSON.stringify(responseData)}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
}

async function updateSubscriber(email: string, fields: any) {
  try {
    console.log('Updating subscriber in MailerLite:', { email, fields });
    
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers/${email}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ fields })
    });

    const responseData = await response.json();
    console.log('MailerLite API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    if (!response.ok) {
      throw new Error(`Failed to update subscriber: ${JSON.stringify(responseData)}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error updating subscriber:', error);
    throw error;
  }
}

async function sendTrackingEmail(subscriber: Subscriber) {
  try {
    console.log('Sending tracking email to:', subscriber.email);
    
    const response = await fetch(`${MAILERLITE_API_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: `Order Tracking - ${subscriber.fields?.order_id}`,
        type: 'regular',
        subject: 'Your Order is on its way! 🚚',
        content: {
          html: `
            <h1>Thank you for your order!</h1>
            <p>Dear ${subscriber.fields?.name || 'Valued Customer'},</p>
            <p>Your order has been shipped and is on its way to you.</p>
            <p>Tracking Number: ${subscriber.fields?.tracking_number}</p>
            <p>Track your package: <a href="${subscriber.fields?.tracking_url}">Click here to track your order</a></p>
            <p>Order ID: ${subscriber.fields?.order_id}</p>
            <p>Thank you for choosing Dose Daily!</p>
          `,
          plain: `
            Thank you for your order!
            
            Dear ${subscriber.fields?.name || 'Valued Customer'},
            
            Your order has been shipped and is on its way to you.
            
            Tracking Number: ${subscriber.fields?.tracking_number}
            Track your package: ${subscriber.fields?.tracking_url}
            Order ID: ${subscriber.fields?.order_id}
            
            Thank you for choosing Dose Daily!
          `
        },
        recipients: {
          segments: [],
          groups: [],
          subscribers: [subscriber.email]
        }
      })
    });

    const responseData = await response.json();
    console.log('MailerLite Campaign Response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    if (!response.ok) {
      throw new Error(`Failed to send tracking email: ${JSON.stringify(responseData)}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error sending tracking email:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    if (!MAILERLITE_API_TOKEN) {
      console.error('MAILERLITE_API_TOKEN is not configured');
      throw new Error('MAILERLITE_API_TOKEN is not configured');
    }

    const body = await request.json();
    console.log('Received request body:', body);
    
    const { email, name, tracking_number, tracking_url, order_id } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // First, try to add the subscriber
    try {
      const result = await addSubscriber({
        email,
        fields: {
          name,
          tracking_number,
          tracking_url,
          order_id
        }
      });
      console.log('Successfully added subscriber:', result);

      // If we have tracking information, send the tracking email
      if (tracking_number && tracking_url) {
        await sendTrackingEmail({
          email,
          fields: {
            name,
            tracking_number,
            tracking_url,
            order_id
          }
        });
      }

      return NextResponse.json({ 
        success: true,
        message: 'Subscriber added successfully',
        data: result
      });
    } catch (error: any) {
      // If subscriber already exists, update their information
      if (error.message.includes('already exists')) {
        console.log('Subscriber exists, updating information...');
        const result = await updateSubscriber(email, {
          tracking_number,
          tracking_url,
          order_id
        });
        console.log('Successfully updated subscriber:', result);

        // If we have tracking information, send the tracking email
        if (tracking_number && tracking_url) {
          await sendTrackingEmail({
            email,
            fields: {
              name,
              tracking_number,
              tracking_url,
              order_id
            }
          });
        }

        return NextResponse.json({ 
          success: true,
          message: 'Subscriber updated successfully',
          data: result
        });
      } else {
        throw error;
      }
    }
  } catch (error: any) {
    console.error('MailerLite API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process subscriber',
        details: error.message
      },
      { status: 500 }
    );
  }
} 