'use client';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { cart, removeFromCart, getTotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (cart.length === 0) return null;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = getTotal();

  // Detect mobile via window width at render time (SSR safe default = desktop)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const sheetVariants = isMobile
    ? {
        hidden: { y: '100%', opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 32 } },
        exit: { y: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
      }
    : {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 32 } },
        exit: { x: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
      };

  return (
    <>
      {/* FAB / sticky bar */}
      <motion.button
        className="rl-cart-fab"
        onClick={() => setIsOpen(true)}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.5 }}
        whileTap={{ scale: 0.97 }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>🛒</span>
          <span>{itemCount} dozen</span>
        </span>
        <span style={{ background: 'rgba(255,255,255,0.22)', borderRadius: '8px', padding: '3px 10px', fontSize: '0.88rem', fontWeight: 600 }}>
          ${(total / 100).toFixed(2)}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 100,
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
              }}
            />

            {/* Sheet / Drawer */}
            <motion.div
              key="sheet"
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
                // Mobile: bottom sheet
                ...(isMobile ? {
                  bottom: 0, left: 0, right: 0,
                  borderRadius: '24px 24px 0 0',
                  maxHeight: '85vh',
                } : {
                  // Desktop: side drawer
                  top: 0, right: 0, bottom: 0,
                  width: '100%', maxWidth: '420px',
                  borderLeft: '1px solid var(--border)',
                }),
              }}
              drag={isMobile ? 'y' : false}
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120) setIsOpen(false);
              }}
            >
              {/* Handle (mobile only) */}
              {isMobile && <div className="rl-sheet-handle" />}

              {/* Header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0,
              }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
                    Your Order
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {itemCount} dozen egg{itemCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Items */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.5rem' }}>
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.85rem 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '42px', height: '42px', background: '#f5f0e8',
                          borderRadius: '10px', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0,
                        }}>
                          🥚
                        </div>
                        <div>
                          <p style={{ fontWeight: 500, fontSize: '0.88rem' }}>{item.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.quantity} dozen</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 500, fontSize: '0.92rem' }}>
                          ${((item.price * item.quantity) / 100).toFixed(2)}
                        </p>
                        <button className="rl-cart-remove" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div style={{
                padding: '1.25rem 1.5rem',
                borderTop: '1px solid var(--border)',
                flexShrink: 0,
                paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
                <motion.button
                  className="rl-cart-checkout"
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={() => { setIsOpen(false); router.push('/checkout'); }}
                >
                  Proceed to Checkout →
                </motion.button>
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
                  Local delivery · Bonner County, ID
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}