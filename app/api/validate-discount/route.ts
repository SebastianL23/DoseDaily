import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { code, email } = await request.json();
    
    console.log('Validate Discount - Received values:', { code, email });

    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Discount code is required' },
        { status: 400 }
      );
    }

    // Find the discount code
    const { data: discountCode, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code)
      .eq('email', email)
      .single();

    console.log('Validate Discount - Query result:', { 
      discountCode, 
      error,
      used: discountCode?.used,
      code: discountCode?.code,
      email: discountCode?.email 
    });

    if (error || !discountCode) {
      console.error('Discount code error:', error);
      return NextResponse.json(
        { valid: false, message: 'Invalid discount code' },
        { status: 400 }
      );
    }

    // Check if code is expired
    const now = new Date();
    if (now > new Date(discountCode.expires_at)) {
      return NextResponse.json(
        { valid: false, message: 'Discount code has expired' },
        { status: 400 }
      );
    }

    // Check if code has already been used
    if (discountCode.used) {
      console.log('Code already used:', { used: discountCode.used, used_at: discountCode.used_at });
      return NextResponse.json(
        { valid: false, message: 'This discount code has already been used' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      discount: {
        code: discountCode.code,
        email: discountCode.email,
        expires_at: discountCode.expires_at,
        discount_type: discountCode.discount_type,
        discount_value: discountCode.discount_value,
        used: discountCode.used  // Add used status to response
      }
    });
  } catch (error) {
    console.error('Error validating discount code:', error);
    return NextResponse.json(
      { valid: false, message: 'Error validating discount code' },
      { status: 500 }
    );
  }
} 