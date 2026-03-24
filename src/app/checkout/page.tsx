'use client';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const RANCH_LAT = 48.3641170790182;
const RANCH_LNG = -116.43288801972392;

const FREE_MILES = 5;
const SURCHARGE_PER_MILE = 0.5;
const MAX_MILES = 25;

const fieldFade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Checkout() {
  const { cart, getTotal } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryInstructions: '',
    smsOptIn: true,
    saveAsAccount: false,
  });
  const [deliveryFeeDollars, setDeliveryFeeDollars] = useState(0);
  const [distanceMiles, setDistanceMiles] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValidZone, setIsValidZone] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartTotalDollars = getTotal() / 100;
  const finalTotalDollars = cartTotalDollars + deliveryFeeDollars;

  // Load Google Places
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = initAutocomplete;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const initAutocomplete = () => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    });

    autocomplete.addListener('place_changed', () => {
      handlePlaceSelected(autocomplete.getPlace());
    });
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, address: value }));

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (value.length > 5 && window.google) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: value }, (results, status) => {
          if (status === 'OK' && results[0]?.geometry?.location) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            handlePlaceSelected({ 
              geometry: { location: { lat: () => lat, lng: () => lng } }, 
              formatted_address: value 
            });
          }
        });
      }
    }, 600);
  }, []);

  const handlePlaceSelected = (place: any) => {
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const formattedAddress = place.formatted_address || formData.address;

    setFormData(prev => ({ ...prev, address: formattedAddress }));

    const dist = haversineDistance(RANCH_LAT, RANCH_LNG, lat, lng);
    const rounded = Math.round(dist * 10) / 10;
    setDistanceMiles(rounded);

    let fee = 0;
    let valid = true;
    if (dist > MAX_MILES) {
      valid = false;
      setErrorMsg(`Sorry, we only deliver within ${MAX_MILES} miles of the ranch.`);
    } else if (dist > FREE_MILES) {
      fee = Math.ceil(dist - FREE_MILES) * SURCHARGE_PER_MILE;
    }

    setDeliveryFeeDollars(fee);
    setIsValidZone(valid);
  };

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidZone) return;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          deliveryInstructions: formData.deliveryInstructions,
          smsOptIn: formData.smsOptIn,
          saveAsAccount: formData.saveAsAccount,
          deliveryFeeCents: Math.round(deliveryFeeDollars * 100),
          distanceMiles,
        }),
      });

      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'No redirect URL');
    } catch (err: any) {
      setErrorMsg(err.message || 'Checkout failed');
    }
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    fontWeight: 500,
    display: 'block',
    marginBottom: '0.45rem',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '1.1rem 1.5rem',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>← Back</Link>
        <span style={{ color: 'var(--border-strong)' }}>|</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>Checkout</h1>
      </motion.header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        <div>
          <motion.h2 {...fieldFade(0.05)} style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Delivery Details
          </motion.h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div {...fieldFade(0.1)}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="Jane Smith" required className="rl-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </motion.div>

            <motion.div {...fieldFade(0.17)}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="jane@example.com" required className="rl-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </motion.div>

            {/* === NEW FIELDS (minimal addition) === */}
            <motion.div {...fieldFade(0.20)}>
              <label style={labelStyle}>Phone Number</label>
              <input 
                type="tel" 
                placeholder="(555) 555-5555" 
                required 
                className="rl-input" 
                value={formData.phone} 
                onChange={e => setFormData({ ...formData, phone: e.target.value })} 
              />
            </motion.div>

            <motion.div {...fieldFade(0.27)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={formData.smsOptIn}
                onChange={e => setFormData({ ...formData, smsOptIn: e.target.checked })}
                style={{ accentColor: 'var(--gold)' }}
              />
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Opt in to text message delivery updates
              </label>
            </motion.div>

            <motion.div {...fieldFade(0.27)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                checked={formData.saveAsAccount}
                onChange={e => setFormData({ ...formData, saveAsAccount: e.target.checked })}
                style={{ accentColor: 'var(--gold)' }}
              />
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Save my details as an account (for faster future orders)
              </label>
            </motion.div>
            {/* === END NEW FIELDS === */}

            <motion.div {...fieldFade(0.24)}>
              <label style={labelStyle}>Delivery Address</label>
              <input
                ref={inputRef}
                type="text"
                placeholder="Start typing your full address..."
                className="rl-input"
                required
                onChange={handleInputChange}
              />
              {distanceMiles > 0 && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--accent-light)', borderRadius: '12px', fontSize: '0.95rem' }}>
                  📍 {distanceMiles} miles from ranch<br />
                  {deliveryFeeDollars === 0 
                    ? `✅ Free delivery (within ${FREE_MILES} miles)` 
                    : `🚚 Delivery fee: $${deliveryFeeDollars.toFixed(2)}`}
                </div>
              )}
            </motion.div>

            <motion.div {...fieldFade(0.31)}>
              <label style={labelStyle}>Delivery Instructions (optional)</label>
              <textarea
                placeholder="Leave at porch, ring bell twice, or any special notes for the driver..."
                rows={3}
                className="rl-input"
                style={{ resize: 'none' }}
                value={formData.deliveryInstructions}
                onChange={e => setFormData({ ...formData, deliveryInstructions: e.target.value })}
              />
            </motion.div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#b91c1c', fontSize: '0.9rem', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px' }}>
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button type="submit" disabled={!isValidZone} className="rl-btn-pay" whileTap={{ scale: 0.98 }}>
              Pay ${finalTotalDollars.toFixed(2)} with Stripe
            </motion.button>
          </form>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.75rem', 
            alignSelf: 'start' 
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Your Order</h3>
          
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <span>{item.name} × {item.quantity} dozen</span>
              <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
            </div>
          ))}

          {deliveryFeeDollars > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', color: '#d97706' }}>
              <span>Delivery Fee ({distanceMiles} miles)</span>
              <span>${deliveryFeeDollars.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.75rem', fontSize: '1.35rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            <span>Total</span>
            <span>${finalTotalDollars.toFixed(2)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}