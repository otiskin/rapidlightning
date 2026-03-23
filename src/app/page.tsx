import { createClient } from '@/utils/supabase/server';
import ProductCard from '@/components/ProductCard';
import CartSidebar from '@/components/CartSidebar';
import HomeHero from '@/components/HomeHero';

export default async function Home() {
  const supabase = await createClient();
  const { data: product, error } = await supabase.from('products').select('*').single();

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Unable to load products.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <HomeHero product={product} />
      <CartSidebar />
    </div>
  );
}