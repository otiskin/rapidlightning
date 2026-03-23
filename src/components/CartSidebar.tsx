'use client';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { cart, removeFromCart, getTotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const router = useRouter();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = getTotal();

  useEffect(() => {
    if (itemCount > 0) setPulseKey(Date.now());
  }, [itemCount]);

  if (cart.length === 0) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const sheetVariants = isMobile
    ? { hidden: { y: '100%', opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 32 } }, exit: { y: '100%', opacity: 0 } }
    : { hidden: { x: '100%', opacity: 0 }, visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 32 } }, exit: { x: '100%', opacity: 0 } };

  return (
    <>
      {/* === HARD-CODED HIGH-CONTRAST FAB (no CSS vars, no blending) === */}
      {!isOpen && (
        <motion.button
          key={pulseKey}
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 200,
            background: '#224820',           // ← hard-coded ranch green
            color: '#ffffff',               // ← forced white
            border: 'none',
            borderRadius: '9999px',
            padding: '1rem 1.75rem',
            fontSize: '1.1rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 35px -10px rgba(34, 72, 32, 0.6)',
            cursor: 'pointer',
            minWidth: '190px',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '1.45rem', color: '#ffffff' }}>🥚</span>
          <span style={{ color: '#ffffff' }}>{itemCount} dozen</span>
          <span style={{
            background: 'rgba(255,255,255,0.25)',
            borderRadius: '9999px',
            padding: '4px 12px',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#ffffff',               // ← forced white
          }}>
            ${(total / 100).toFixed(2)}
          </span>
        </motion.button>
      )}

      {/* === Your original drawer (100% unchanged) === */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, backdropFilter: 'blur(3px)' }}
            />

            <motion.div
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: 'fixed',
                zIndex: 101,
                background: 'var(--bg-sheet)',
                display: 'flex',
                flexDirection: 'column',
                ...(isMobile ? {
                  bottom: 0, left: 0, right: 0,
                  borderRadius: '24px 24px 0 0',
                  maxHeight: '85vh',
                } : {
                  top: 0, right: 0, bottom: 0,
                  width: '100%', maxWidth: '420px',
                  borderLeft: '1px solid var(--border)',
                }),
              }}
              drag={isMobile ? 'y' : false}
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => info.offset.y > 120 && setIsOpen(false)}
            >
              {isMobile && <div className="rl-sheet-handle" />}
              
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600 }}>Your Order</h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{itemCount} dozen egg{itemCount !== 1 ? 's' : ''}</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  ✕
                </motion.button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.5rem' }}>
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', background: '#f5f0e8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🥚</div>
                        <div>
                          <p style={{ fontWeight: 500 }}>{item.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.quantity} dozen</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 500 }}>${((item.price * item.quantity) / 100).toFixed(2)}</p>
                        <button className="rl-cart-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>${(total / 100).toFixed(2)}</span>
                </div>
                <motion.button className="rl-cart-checkout" onClick={() => { setIsOpen(false); router.push('/checkout'); }} whileTap={{ scale: 0.98 }}>
                  Proceed to Checkout →
                </motion.button>
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>Local delivery · Bonner County, ID</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}