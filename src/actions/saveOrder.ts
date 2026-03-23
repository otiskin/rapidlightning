'use server';

import { Resend } from 'resend';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

export async function saveOrderAndSendEmails(sessionId: string) {
  const supabase = await createClient();
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // 1. Retrieve real order data from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });

  const customerName = (session.metadata?.name as string) ?? 'Unknown';
  const address = (session.metadata?.address as string) ?? 'Unknown';
  const email = session.customer_email ?? '';
  const total = session.amount_total ?? 0;

  // Calculate total quantity from line items
  const quantity =
    session.line_items?.data.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;

  const orderData = {
    customer_name: customerName,
    email,
    address,
    quantity,
    total,
    status: 'pending_delivery',
    session_id: sessionId,
  };

  // 2. Save order — throw on failure so we know about it
  const { error: insertError } = await supabase.from('orders').insert([orderData]);
  if (insertError) throw new Error(`Order insert failed: ${insertError.message}`);

  // 3. Decrement stock for each product ordered
  for (const item of session.line_items?.data ?? []) {
    // Match by product name — or swap to product ID via metadata if you prefer
    const { data: product } = await supabase
      .from('products')
      .select('id, stock, name')
      .eq('id', 1) // Update this if you have multiple products
      .single();

    if (product) {
      const newStock = Math.max(0, product.stock - (item.quantity ?? 0));
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id);
      if (stockError) console.error('Stock update failed:', stockError.message);
    }
  }

  // 4. Notify you / the ranch
  await resend.emails.send({
    from: 'Rapid Lightning <no-reply@rapidlightning.vercel.app>',
    to: ['your-email@example.com', 'ranch-email@example.com'], // ← update these
    subject: 'New Egg Order Received!',
    text: `New order from ${customerName}!\n${quantity} dozen to ${address}\nTotal: $${(total / 100).toFixed(2)}\nEmail: ${email}`,
  });

  // 5. Confirm to customer
  await resend.emails.send({
    from: 'Rapid Lightning <no-reply@rapidlightning.vercel.app>',
    to: email,
    subject: 'Your Rapid Lightning Eggs Order Confirmation',
    text: `Hi ${customerName}, thank you! Your ${quantity} dozen eggs are on the way to ${address}. We'll be in touch soon!`,
  });
}