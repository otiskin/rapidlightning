'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { saveOrderAndSendEmails } from '@/actions/saveOrder';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const hasFired = useRef(false);

  useEffect(() => {
    if (!sessionId || hasFired.current) return;
    hasFired.current = true;

    (async () => {
      try {
        await saveOrderAndSendEmails(sessionId);
      } catch (err) {
        console.error('Failed to save order:', err);
      } finally {
        clearCart();
      }
    })();
  }, [sessionId, clearCart]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', maxWidth: '600px' }}
      >
        <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>🎉</div>
        
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          Thank You!
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your order has been placed successfully.<br />
          We'll send a confirmation email shortly with tracking details.
        </p>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.1rem' }}>
            Your fresh eggs from the ranch will be delivered soon.
          </p>
        </div>

        <Link href="/" className="rl-btn-pay" style={{ display: 'inline-block', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          Back to Shop
        </Link>
      </motion.div>
    </div>
  );
}