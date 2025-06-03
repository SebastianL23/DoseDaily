import { NextResponse } from 'next/server';

const SHIPPO_API_TOKEN = process.env.SHIPPO_API_TOKEN;
const SHIPPO_API_URL = 'https://api.goshippo.com';

interface ShippingAddress {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  is_residential: boolean;
}

export async function POST(request: Request) {
  try {
    if (!SHIPPO_API_TOKEN) {
      throw new Error('SHIPPO_API_TOKEN is not configured');
    }

    const body = await request.json();
    const { shippingAddress, items } = body;

    if (!shippingAddress || !items) {
      throw new Error('Missing required shipping address or items data');
    }

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

    // Create to address (customer's address)
    const toAddress = {
      name: shippingAddress.name || "Customer",
      street1: shippingAddress.line1,
      street2: shippingAddress.line2 || "",
      city: shippingAddress.city,
      state: shippingAddress.state || "",
      zip: shippingAddress.postal_code,
      country: shippingAddress.country,
      phone: shippingAddress.phone || "",
      email: shippingAddress.email || "",
      is_residential: true
    };

    console.log('Creating from address:', fromAddress);
    console.log('Creating to address:', toAddress);

    // Create addresses in Shippo
    const fromAddressResponse = await fetch(`${SHIPPO_API_URL}/addresses/`, {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${SHIPPO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fromAddress),
    });

    const fromAddressData = await fromAddressResponse.json();
    console.log('From address response:', fromAddressData);

    if (!fromAddressResponse.ok) {
      throw new Error(`Failed to create from address: ${JSON.stringify(fromAddressData)}`);
    }

    const toAddressResponse = await fetch(`${SHIPPO_API_URL}/addresses/`, {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${SHIPPO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toAddress),
    });

    const toAddressData = await toAddressResponse.json();
    console.log('To address response:', toAddressData);

    if (!toAddressResponse.ok) {
      throw new Error(`Failed to create to address: ${JSON.stringify(toAddressData)}`);
    }

    // Create shipment with standard Hermes configuration
    const shipment = {
      address_from: fromAddressData.object_id,
      address_to: toAddressData.object_id,
      parcels: items.map((item: any) => ({
        length: "25", // 25cm
        width: "20",  // 20cm
        height: "5",  // 5cm
        distance_unit: "cm",
        weight: "1",  // 1kg
        mass_unit: "kg",
      })),
      async: false
    };

    console.log('Creating shipment:', shipment);

    const shipmentResponse = await fetch(`${SHIPPO_API_URL}/shipments/`, {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${SHIPPO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipment),
    });

    const shipmentData = await shipmentResponse.json();
    console.log('Shipment response:', shipmentData);

    if (!shipmentResponse.ok) {
      throw new Error(`Failed to create shipment: ${JSON.stringify(shipmentData)}`);
    }

    // Find the Hermes rate (prefer ParcelShop Drop-Off if available)
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

    // Create a transaction (shipping label)
    const transaction = {
      rate: hermesRate.object_id,
      label_file_type: "PDF",
      async: false
    };

    console.log('Creating transaction:', transaction);

    const transactionResponse = await fetch(`${SHIPPO_API_URL}/transactions/`, {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${SHIPPO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    console.log('Shippo API Request:', {
      url: `${SHIPPO_API_URL}/transactions/`,
      headers: {
        'Authorization': 'ShippoToken [REDACTED]',
        'Content-Type': 'application/json',
      },
      body: transaction
    });

    const transactionData = await transactionResponse.json();
    console.log('Raw Shippo API Response:', {
      status: transactionResponse.status,
      statusText: transactionResponse.statusText,
      headers: Object.fromEntries(transactionResponse.headers.entries()),
      data: transactionData
    });

    if (!transactionResponse.ok) {
      throw new Error(`Failed to create transaction: ${JSON.stringify(transactionData)}`);
    }

    // Check if we have tracking information
    console.log('Tracking Information Check:', {
      hasTrackingNumber: !!transactionData.tracking_number,
      hasTrackingUrl: !!transactionData.tracking_url,
      hasTrackingStatus: !!transactionData.status,
      rawTrackingNumber: transactionData.tracking_number,
      rawTrackingUrl: transactionData.tracking_url,
      rawStatus: transactionData.status,
      trackingNumberType: typeof transactionData.tracking_number
    });

    // Format the response with all necessary tracking information
    const formattedResponse = {
      success: true,
      shipment: shipmentData,
      fromAddress: fromAddressData,
      toAddress: toAddressData,
      transaction: {
        ...transactionData,
        tracking_number: transactionData.tracking_number ? String(transactionData.tracking_number) : null,
        tracking_url: transactionData.tracking_url || transactionData.tracking?.url || null,
        tracking_status: transactionData.status || transactionData.tracking?.status || 'pending',
        estimated_delivery: transactionData.eta || transactionData.tracking?.eta || null,
        label_url: transactionData.label_url || null
      },
      selectedRate: hermesRate
    };

    console.log('Final Formatted Response:', {
      hasTrackingNumber: !!formattedResponse.transaction.tracking_number,
      hasTrackingUrl: !!formattedResponse.transaction.tracking_url,
      hasTrackingStatus: !!formattedResponse.transaction.tracking_status,
      trackingNumber: formattedResponse.transaction.tracking_number,
      trackingUrl: formattedResponse.transaction.tracking_url,
      trackingStatus: formattedResponse.transaction.tracking_status,
      trackingNumberType: typeof formattedResponse.transaction.tracking_number
    });

    return NextResponse.json(formattedResponse);

  } catch (error: any) {
    console.error('Shippo API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process shipping request',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
