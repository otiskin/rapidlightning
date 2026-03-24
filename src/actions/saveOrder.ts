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
    expand: ['line_items.data.price.product'],
  });

  const customerName = (session.metadata?.name as string) ?? 'Unknown';
  const address = (session.metadata?.address as string) ?? 'Unknown';
  const email = session.customer_email ?? '';
  const total = session.amount_total ?? 0;

  // Calculate total quantity from line items (excluding delivery fee)
  const eggLineItems = (session.line_items?.data ?? []).filter(
    (item) => item.description !== `${item.quantity} miles from the ranch`
  );

  const quantity = eggLineItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

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

  // 3. Decrement stock for each egg product ordered
  for (const item of eggLineItems) {
    const productData = item.price?.product as Stripe.Product | undefined;
    const productName = productData?.name ?? item.description ?? '';

    if (!productName) continue;

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, stock, name')
      .ilike('name', productName)
      .single();

    if (fetchError || !product) {
      console.error(`Product not found for "${productName}":`, fetchError?.message);
      continue;
    }

    const newStock = Math.max(0, product.stock - (item.quantity ?? 0));
    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', product.id);

    if (stockError) console.error('Stock update failed:', stockError.message);
  }

  // 4. Notify the ranch
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