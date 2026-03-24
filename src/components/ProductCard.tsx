'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { cart, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Current quantity already in cart for this product
  const currentCartQty = cart.find(item => item.id === product.id)?.quantity || 0;
  const available = product.stock - currentCartQty;
  const inStock = available > 0;
  const maxQuantity = Math.max(1, available);

  // Clamp quantity when stock changes or cart updates
  useEffect(() => {
    if (quantity > maxQuantity) setQuantity(maxQuantity);
  }, [maxQuantity, quantity]);

  const handleAdd = () => {
    if (quantity > available) {
      setToastMessage(`Only ${available} dozen left in stock!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2800);
      return;
    }

    const success = addToCart({ id: product.id, name: product.name, price: product.price, quantity });

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);

      setToastMessage(`${quantity} dozen ${product.name} added!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const updateQuantity = (newQty: number) => {
    setQuantity(Math.max(1, Math.min(maxQuantity, newQty)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      }}
    >
      {/* Image + stock badge */}
      <div style={{
        background: 'linear-gradient(150deg, #f5f0e8 0%, #ede5d4 100%)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
      }}>
        <motion.div style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '0.25rem' }}>🥚</motion.div>
        <p style={{ fontSize: '0.72rem', color: '#8a7d6b', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
          Ranch Fresh
        </p>
        <motion.div
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: inStock ? 'var(--accent-light)' : '#fef2f2',
            color: inStock ? 'var(--accent)' : '#b91c1c',
            fontSize: '0.72rem', fontWeight: 500, padding: '4px 12px', borderRadius: '100px',
          }}
        >
          {inStock ? `${available} dozen left` : 'Out of stock'}
        </motion.div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600 }}>{product.name}</h2>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
              ${(product.price / 100).toFixed(2)}
            </span>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>per dozen</p>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
          {product.description}
        </p>

        {/* Quantity stepper with stock limit */}
        <div style={{ marginBottom: '1.1rem' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '0.6rem' }}>
            Quantity (dozen)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.button whileTap={{ scale: 0.88 }} className="rl-btn-qty" onClick={() => updateQuantity(quantity - 1)}>-</motion.button>
            
            <AnimatePresence mode="wait">
              <motion.span
                key={quantity}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{ fontSize: '1.15rem', fontWeight: 500, width: '32px', textAlign: 'center' }}
              >
                {quantity}
              </motion.span>
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.88 }}
              className="rl-btn-qty"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={quantity >= maxQuantity}
              style={{ opacity: quantity >= maxQuantity ? 0.4 : 1 }}
            >
              +
            </motion.button>
          </div>
          {available <= 3 && available > 0 && (
            <p style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '0.5rem' }}>Only {available} dozen left — act fast!</p>
          )}
        </div>

        {/* Add to cart */}
        <motion.button
          className={`rl-btn-add${added ? ' added' : ''}`}
          disabled={!inStock || quantity > available}
          onClick={handleAdd}
          whileTap={{ scale: 0.97 }}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <span>✓ Added to cart!</span>
            ) : (
              <span>Add {quantity} dozen</span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Floating toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed', bottom: '6.5rem', right: '2rem', zIndex: 300,
              background: 'var(--bg-card)', border: '1px solid var(--accent)',
              borderRadius: '16px', padding: '1rem 1.5rem', boxShadow: '0 20px 40px -15px rgba(34,72,32,0.25)',
              maxWidth: '280px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.75rem' }}>🥚</div>
              <p style={{ fontWeight: 600 }}>{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}