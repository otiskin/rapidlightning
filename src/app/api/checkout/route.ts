import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/context/CartContext';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const {
      cart,
      name,
      email,
      address,
      deliveryInstructions = '',
      deliveryFeeCents = 0,
      distanceMiles = 0,
    } = await request.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const lineItems = [
      ...cart.map((item: CartItem) => ({
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
        address,
        deliveryInstructions,
        deliveryFeeCents: deliveryFeeCents.toString(),
        distanceMiles: distanceMiles.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}