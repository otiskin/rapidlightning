'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { saveOrderAndSendEmails } from '@/actions/saveOrder';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const hasFired = useRef(false);

  const [isSaving, setIsSaving] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [orderSaved, setOrderSaved] = useState(false);

  useEffect(() => {
    if (!sessionId || hasFired.current) return;

    hasFired.current = true;

    (async () => {
      try {
        setIsSaving(true);
        await saveOrderAndSendEmails(sessionId);
        setOrderSaved(true);
      } catch (err: any) {
        console.error('Failed to save order:', err);
        setSaveError(err.message || 'Failed to save order. Please contact us.');
      } finally {
        setIsSaving(false);
        clearCart();
      }
    })();
  }, [sessionId, clearCart]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', maxWidth: '620px' }}
      >
        <motion.div
          initial={{ scale: 0.6, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ fontSize: '5.5rem', marginBottom: '1.25rem' }}
        >
          🥚
        </motion.div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Thank You!
        </h1>

        <AnimatePresence mode="wait">
          {isSaving ? (
            <p key="saving" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
              Saving your order and sending confirmation...
            </p>
          ) : saveError ? (
            <div key="error" style={{ color: '#b91c1c', marginBottom: '2rem' }}>
              <p>Your payment was successful, but we had trouble saving the order details.</p>
              <p style={{ fontSize: '0.95rem' }}>{saveError}</p>
              <p>Please contact us so we can manually process your order.</p>
            </div>
          ) : (
            <motion.p
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}
            >
              Your fresh eggs from the ranch have been ordered successfully.<br />
              We'll send a confirmation email shortly with all the details.
            </motion.p>
          )}
        </AnimatePresence>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', marginBottom: '2.5rem', textAlign: 'left' }}>
          <p style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
            Your pasture-raised eggs will be hand-delivered from the ranch soon.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Keep an eye on your email for tracking information and delivery window.
          </p>
        </div>

        <Link href="/" className="rl-btn-pay" style={{ display: 'inline-block', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          Back to Shop
        </Link>
      </motion.div>
    </div>
  );
}