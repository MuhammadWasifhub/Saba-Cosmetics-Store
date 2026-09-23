'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Sukkur',
  'Bahawalpur', 'Sargodha', 'Abbottabad', 'Other',
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_phone_alt: '',
    shipping_address: '',
    area: '',
    city: '',
    landmark: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validatePhone(phone: string) {
    const cleaned = phone.replace(/[\s-]/g, '');
    return /^(03\d{9}|\+923\d{9})$/.test(cleaned);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.customer_name.trim()) return setError('Please enter your full name.');
    if (!validatePhone(form.customer_phone)) {
      return setError('Please enter a valid phone number (e.g. 03xx-xxxxxxx).');
    }
    if (!form.shipping_address.trim()) return setError('Please enter your street address / house details.');
    if (!form.area.trim()) return setError('Please enter your area or neighbourhood.');
    if (!form.city.trim()) return setError('Please select your city.');
    if (items.length === 0) return setError('Your bag is empty.');

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            product_id: i.product_id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmed?order=${data.order_number}`);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="container" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
        <h1 style={{ fontSize: 26, marginBottom: 12 }}>Your bag is empty</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: 24 }}>
          Add a few products before checking out.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: 'var(--color-ink)',
            color: 'var(--color-white)',
            padding: '14px 28px',
            borderRadius: 999,
          }}
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>Checkout</h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 32 }}>
        Cash on Delivery, pay when your order arrives at your door.
      </p>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 56 }}
        className="checkout-grid"
      >
        <form onSubmit={handleSubmit}>
          <h2 style={sectionHeading}>Contact details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
            <div>
              <label style={labelStyle}>Full name *</label>
              <input
                placeholder="e.g. Ayesha Khan"
                value={form.customer_name}
                onChange={(e) => updateField('customer_name', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="phone-grid">
              <div>
                <label style={labelStyle}>Mobile number *</label>
                <input
                  placeholder="03xx-xxxxxxx"
                  value={form.customer_phone}
                  onChange={(e) => updateField('customer_phone', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Alternate number (optional)</label>
                <input
                  placeholder="03xx-xxxxxxx"
                  value={form.customer_phone_alt}
                  onChange={(e) => updateField('customer_phone_alt', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--color-muted)' }}>
              We'll use this number to confirm your order and for the rider to reach you on delivery.
            </p>
          </div>

          <h2 style={sectionHeading}>Delivery address</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>House / flat / street address *</label>
              <textarea
                placeholder="House # 12, Street 4, ABC Society"
                value={form.shipping_address}
                onChange={(e) => updateField('shipping_address', e.target.value)}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' as const }}
              />
            </div>
            <div>
              <label style={labelStyle}>Area / neighbourhood *</label>
              <input
                placeholder="e.g. Gulshan-e-Iqbal, DHA Phase 5"
                value={form.area}
                onChange={(e) => updateField('area', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="phone-grid">
              <div>
                <label style={labelStyle}>City *</label>
                <select
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  style={{ ...inputStyle, appearance: 'auto' as const }}
                >
                  <option value="">Select city</option>
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nearby landmark (optional)</label>
                <input
                  placeholder="e.g. Near XYZ Masjid"
                  value={form.landmark}
                  onChange={(e) => updateField('landmark', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              padding: '14px 16px',
              background: 'var(--color-cream)',
              borderRadius: 10,
              fontSize: 13.5,
              color: 'var(--color-muted)',
            }}
          >
            💵 Payment method: <strong style={{ color: 'var(--color-ink)' }}>Cash on Delivery</strong>. 
            Please keep exact change ready for the rider where possible.
          </div>

          {error && <p style={{ color: '#b3413a', fontSize: 14, marginTop: 16 }}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              marginTop: 24,
              background: 'var(--color-ink)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: 999,
              padding: '16px',
              fontSize: 15,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Placing order…' : `Place order ${formatPKR(totalPrice)}`}
          </button>
        </form>

        <div>
          <div style={{ background: 'var(--color-cream)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 18 }}>Order summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {items.map((item) => (
                <div
                  key={item.product_id}
                  style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPKR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                borderTop: '1px solid var(--color-hairline)',
                paddingTop: 16,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              <span>Total</span>
              <span>{formatPKR(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .checkout-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .phone-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

const sectionHeading: React.CSSProperties = {
  fontSize: 14,
  marginBottom: 16,
  color: 'var(--color-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  marginBottom: 6,
  color: 'var(--color-ink)',
};

const inputStyle: React.CSSProperties = {
  border: '1px solid var(--color-hairline)',
  borderRadius: 10,
  padding: '13px 16px',
  fontSize: 14,
  fontFamily: 'var(--font-body)',
  width: '100%',
};
