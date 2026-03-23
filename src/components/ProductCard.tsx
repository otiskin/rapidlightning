'use client';
import { useState } from 'react';
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
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const inStock = product.stock > 0;

  const handleAdd = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
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
      {/* Image area */}
      <div style={{
        background: 'linear-gradient(150deg, #f5f0e8 0%, #ede5d4 100%)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
      }}>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.4 }}
          style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '0.25rem' }}
        >
          🥚
        </motion.div>
        <p style={{ fontSize: '0.72rem', color: '#8a7d6b', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
          Ranch Fresh
        </p>
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: inStock ? 'var(--accent-light)' : '#fef2f2',
            color: inStock ? 'var(--accent)' : '#b91c1c',
            fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.04em',
            padding: '4px 12px', borderRadius: '100px',
          }}
        >
          {inStock ? `${product.stock} dozen left` : 'Out of stock'}
        </motion.div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
            {product.name}
          </h2>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
              ${(product.price / 100).toFixed(2)}
            </span>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>per dozen</p>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
          {product.description}
        </p>

        {/* Quantity stepper */}
        <div style={{ marginBottom: '1.1rem' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '0.6rem' }}>
            Quantity (dozen)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.button
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="rl-btn-qty"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.span
                key={quantity}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                style={{ fontSize: '1.15rem', fontWeight: 500, width: '32px', textAlign: 'center', display: 'inline-block' }}
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="rl-btn-qty"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </motion.button>
          </div>
        </div>

        {/* Add to cart */}
        <motion.button
          className={`rl-btn-add${added ? ' added' : ''}`}
          disabled={!inStock}
          onClick={handleAdd}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <motion.span
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  ✓
                </motion.span>
                Added to cart!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Add {quantity} dozen
                <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.85rem' }}>
                  ${(product.price * quantity / 100).toFixed(2)}
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}