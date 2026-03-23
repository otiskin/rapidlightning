// src/app/page.tsx
import { createClient } from '@/utils/supabase/server';
import ProductCard from '@/components/ProductCard';
import CartSidebar from '@/components/CartSidebar';
import HomeHero from '@/components/HomeHero';

export default async function Home() {
  const supabase = await createClient();
  
  const { data: products = [], error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Supabase products error:', error);
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Unable to load ranch eggs. Please refresh.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 600 }}>No eggs in stock yet</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            We’re collecting fresh ones daily — check back soon!
          </p>
        </div>
      </div>
    );
  }

  const featuredProduct = products[0];
  const otherProducts = products.slice(1); // ← removes duplicate

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Your beautiful HomeHero (spotlight on the featured egg) */}
      <HomeHero product={featuredProduct} />

      {/* Catalog — only the rest of the eggs (scalable to beef later) */}
      {otherProducts.length > 0 && (
        <section style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '0 1.5rem 6rem' 
        }}>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '2.75rem', 
            fontWeight: 700, 
            letterSpacing: '-0.03em',
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'var(--accent)'
          }}>
            More Fresh Eggs from the Ranch
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {otherProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <CartSidebar />
    </div>
  );
}