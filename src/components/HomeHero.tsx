'use client';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
};

export default function HomeHero({ product }: { product: Product }) {
  return (
    <>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Rapid Lightning
          </h1>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Ranch Fresh · Selle Valley
          </p>
        </div>
        <div style={{
          background: 'var(--gold-light)', border: '1px solid var(--gold)', borderRadius: '100px',
          padding: '5px 12px', fontSize: '0.72rem', fontWeight: 500, color: 'var(--gold)', letterSpacing: '0.03em',
        }}>
          Local Delivery
        </div>
      </motion.header>

      {/* Hero */}
      <section style={{ padding: '3rem 1.5rem 1.5rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div {...fadeUp(0.05)} style={{
          display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)',
          borderRadius: '100px', padding: '5px 16px', fontSize: '0.78rem', fontWeight: 500,
          letterSpacing: '0.03em', marginBottom: '1.25rem',
        }}>
          🌿 Free-range · Pasture raised
        </motion.div>

        <motion.h2
          {...fadeUp(0.12)}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 7vw, 3.2rem)',
            fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem',
          }}
        >
          Farm Fresh Eggs,<br />
          <span style={{ color: 'var(--accent)' }}>Delivered Nearby</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 2.5rem' }}
        >
          Straight from our hens to your table. Delivered fresh to Rapid Lightning Road and Selle Valley neighbors.
        </motion.p>
      </section>

      {/* Product card */}
      <section style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1.25rem 8rem' }}>
        <ProductCard product={product} />
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Delivery limited to Rapid Lightning Rd & nearby Selle Valley · Bonner County, ID
        </p>
      </footer>
    </>
  );
}