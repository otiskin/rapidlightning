import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // ← add this key to your .env.local if not present
);

export async function POST(request: Request) {
  try {
    const {
      cart,
      name,
      email,
      phone = '',
      address,
      deliveryInstructions = '',
      smsOptIn = true,
      saveAsAccount = false,
      deliveryFeeCents = 0,
      distanceMiles = 0,
    } = await request.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const lineItems = [
      ...cart.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `${item.quantity} dozen`,
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),

      ...(deliveryFeeCents > 0 ? [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Delivery Fee',
            description: `${distanceMiles} miles from the ranch`,
          },
          unit_amount: deliveryFeeCents,
        },
        quantity: 1,
      }] : []),
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
      customer_email: email,
      metadata: {
        name,
        email,
        phone,
        address,
        deliveryInstructions,
        smsOptIn: smsOptIn.toString(),
        saveAsAccount: saveAsAccount.toString(),
        deliveryFeeCents: deliveryFeeCents.toString(),
        distanceMiles: distanceMiles.toString(),
      },
    });

    // === MINIMAL SUPABASE SAVING (added only this block) ===
    if (saveAsAccount && email) {
      // Upsert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          email,
          full_name: name,
          phone,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });

      if (profileError) console.error('Profile save error:', profileError);
    }

    // Always create order record
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: session.id,
        name,
        email,
        phone,
        address,
        delivery_instructions: deliveryInstructions,
        sms_opt_in: smsOptIn,
        delivery_fee_cents: deliveryFeeCents,
        distance_miles: distanceMiles,
        total_cents: lineItems.reduce((sum: number, item: any) => sum + (item.price_data?.unit_amount || 0) * (item.quantity || 1), 0),
        status: 'pending',
      });

    if (orderError) console.error('Order save error:', orderError);
    // === END SUPABASE SAVING ===

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}