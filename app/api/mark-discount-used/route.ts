import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { code, email } = await request.json();

    console.log('Mark Discount Used - Received values:', { code, email });

    if (!code || !email) {
      return NextResponse.json(
        { success: false, message: 'Code and email are required' },
        { status: 400 }
      );
    }

    // Update the discount code to mark it as used
    const { data, error } = await supabase
      .from('discount_codes')
      .update({ 
        used: true,
        used_at: new Date().toISOString()
      })
      .eq('code', code)
      .eq('email', email);

    console.log('Mark Discount Used - Update result:', { data, error });

    if (error) {
      console.error('Error marking discount code as used:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to mark discount code as used' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in mark-discount-used:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 