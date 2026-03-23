'use client';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const fieldFade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Checkout() {
  const { cart, getTotal } = useCart();
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const total = getTotal();

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Add some eggs before checking out.</p>
          <Link href="/" className="rl-btn-back">Back to Shop</Link>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, ...formData }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'No redirect URL');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem', color: 'var(--text-muted)',
    letterSpacing: '0.07em', textTransform: 'uppercase',
    fontWeight: 500, display: 'block', marginBottom: '0.45rem',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          borderBottom: '1px solid var(--border)', padding: '1.1rem 1.5rem',
          background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '0.75rem',
          position: 'sticky', top: 0, zIndex: 40,
        }}
      >
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', lineHeight: 1 }}>←</Link>
        <span style={{ color: 'var(--border-strong)', fontSize: '1rem' }}>|</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>Checkout</h1>
      </motion.header>

      {/* Layout: stacks on mobile, side-by-side on desktop */}
      <div style={{
        maxWidth: '860px', margin: '0 auto',
        padding: '2rem 1.25rem 5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start',
      }}>

        {/* Form */}
        <div>
          <motion.h2 {...fieldFade(0.05)} style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Delivery Details
          </motion.h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <motion.div {...fieldFade(0.1)}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text" placeholder="Jane Smith" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rl-input"
              />
            </motion.div>

            <motion.div {...fieldFade(0.17)}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email" placeholder="jane@example.com" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rl-input"
              />
            </motion.div>

            <motion.div {...fieldFade(0.24)}>
              <label style={labelStyle}>Delivery Address</label>
              <textarea
                placeholder="123 Rapid Lightning Rd, Sandpoint, ID 83864" required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="rl-input"
                style={{ resize: 'none' }}
              />
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Delivery available to Rapid Lightning Rd & Selle Valley only
              </p>
            </motion.div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem',
                    fontSize: '0.875rem', color: '#b91c1c',
                  }}
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div {...fieldFade(0.3)}>
              <motion.button
                type="submit"
                disabled={loading}
                className="rl-btn-pay"
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {loading ? 'Redirecting to payment...' : `Pay $${(total / 100).toFixed(2)} with Stripe`}
              </motion.button>
            </motion.div>
          </form>
        </div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '1.4rem',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.1rem' }}>
            Order Summary
          </h3>
          {cart.map(item => (
            <div key={item.id} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '0.88rem', padding: '0.55rem 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.quantity}</span>
              <span style={{ fontWeight: 500 }}>${((item.price * item.quantity) / 100).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1.1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
              ${(total / 100).toFixed(2)}
            </span>
          </div>
          <div style={{
            marginTop: '1.1rem', padding: '0.8rem',
            background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent)', lineHeight: 1.5 }}>
              🔒 Secure payment via Stripe
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}