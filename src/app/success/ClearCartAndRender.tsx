'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Simple confetti particle
function Particle({ index }: { index: number }) {
  const colors = ['#2d5a27', '#5a9e52', '#c8a96e', '#e8f0e6', '#f5edd9'];
  const color = colors[index % colors.length];
  const x = (Math.random() - 0.5) * 300;
  const y = -(Math.random() * 250 + 80);
  const rotate = Math.random() * 720 - 360;
  const size = Math.random() * 8 + 4;

  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      animate={{ opacity: 0, x, y, rotate, scale: 0 }}
      transition={{ duration: 0.9 + Math.random() * 0.6, delay: 0.3 + Math.random() * 0.3, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: size, height: size,
        background: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function ClearCartAndRender() {
  const { clearCart } = useCart();
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    clearCart();
    setShowParticles(true);
    const t = setTimeout(() => setShowParticles(false), 1500);
    return () => clearTimeout(t);
  }, [clearCart]);

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          maxWidth: '420px', width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.09)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Particles */}
        <AnimatePresence>
          {showParticles && (
            <>
              {Array.from({ length: 24 }).map((_, i) => (
                <Particle key={i} index={i} />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Checkmark circle */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          style={{
            width: '72px', height: '72px',
            background: 'var(--accent-light)',
            border: '2px solid var(--accent)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 16 }}
            style={{ fontSize: '1.8rem', color: 'var(--accent)', lineHeight: 1 }}
          >
            ✓
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.6rem' }}
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
          style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '0.4rem' }}
        >
          Thank you! Your fresh eggs from Rapid Lightning Ranch are on the way.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.46 }}
          style={{ color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '1.75rem' }}
        >
          Check your email for a confirmation. We'll be in touch about your delivery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'var(--gold-light)', border: '1px solid var(--gold)',
            borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '1.75rem',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 500 }}>
            🚚 Delivery to Rapid Lightning Rd & Selle Valley
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <motion.div whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Link href="/" className="rl-btn-back" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.9rem' }}>
              Back to Shop
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}