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

const EASYPAISA_NUMBER = '03110261448';
const EASYPAISA_NAME = 'Sabah Rasheed';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_phone_alt: '',
    shipping_address: '',
    area: '',
    city: '',
    landmark: '',
  });
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validatePhone(phone: string) {
    const cleaned = phone.replace(/[\s-]/g, '');
    return /^(03\d{9}|\+923\d{9})$/.test(cleaned);
  }

  function validateAddressStep() {
    if (!form.customer_name.trim()) return 'Please enter your full name.';
    if (!validatePhone(form.customer_phone)) return 'Please enter a valid phone number (e.g. 03xx-xxxxxxx).';
    if (!form.shipping_address.trim()) return 'Please enter your street address / house details.';
    if (!form.area.trim()) return 'Please enter your area or neighbourhood.';
    if (!form.city.trim()) return 'Please select your city.';
    return '';
  }

  function goToPayment(e: React.FormEvent) {
    e.preventDefault();
    const err = validateAddressStep();
    if (err) return setError(err);
    setError('');
    setStep(2);
  }

  async function handleScreenshotUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-payment', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Screenshot upload failed. Please try again.');
      } else {
        setScreenshotUrl(data.url);
      }
    } catch {
      setError('Screenshot upload failed. Please try again.');
    }
    setUploading(false);
  }

  async function handleFinalSubmit() {
    setError('');
    if (!screenshotUrl) return setError('Please upload your payment screenshot to continue.');
    if (items.length === 0) return setError('Your bag is empty.');

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          payment_screenshot_url: screenshotUrl,
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
      router.push(`/order-confirmed?order=${data.order_number}&cid=${data.customer_id}`);
    } catch {
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
    <main className="container" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 720 }}>
      <h1 style={{ fontSize: 30, marginBottom: 24 }}>Checkout</h1>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
        {[
          { n: 1, label: 'Delivery details' },
          { n: 2, label: 'Payment' },
        ].map((s, idx) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: idx === 0 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  background: step >= s.n ? 'var(--color-ink)' : 'var(--color-hairline)',
                  color: step >= s.n ? 'var(--color-white)' : 'var(--color-muted)',
                  flexShrink: 0,
                }}
              >
                {step > s.n ? '✓' : s.n}
              </div>
              <span
                style={{
                  fontSize: 13.5,
                  color: step >= s.n ? 'var(--color-ink)' : 'var(--color-muted)',
                  fontWeight: step === s.n ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </span>
            </div>
            {idx === 0 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: step > 1 ? 'var(--color-ink)' : 'var(--color-hairline)',
                  margin: '0 16px',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={goToPayment}>
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
                    <option key={c} value={c}>{c}</option>
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

          {error && <p style={{ color: '#b3413a', fontSize: 14, marginTop: 16 }}>{error}</p>}

          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: 28,
              background: 'var(--color-ink)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: 999,
              padding: '16px',
              fontSize: 15,
            }}
          >
            Continue to payment
          </button>
        </form>
      )}

      {step === 2 && (
        <div>
          <div
            style={{
              background: 'var(--color-cream)',
              borderRadius: 14,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/easypaisa.png" alt="Easypaisa" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
              <h2 style={{ fontSize: 17 }}>Pay via Easypaisa</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14.5, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted)' }}>Easypaisa number</span>
                <strong>{EASYPAISA_NUMBER}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted)' }}>Account title</span>
                <strong>{EASYPAISA_NAME}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted)' }}>Amount to pay</span>
                <strong>{formatPKR(totalPrice)}</strong>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6 }}>
              Please send the above amount to this Easypaisa number, then upload a screenshot of your
              payment below. Your order will be confirmed once we verify the payment.
            </p>
            <p style={{ fontSize: 13, color: '#b3413a', lineHeight: 1.6, marginTop: 10, fontWeight: 500 }}>
              ⚠️ Please re-check the correct name and number before making the payment.
            </p>
          </div>

          <label style={labelStyle}>Upload payment screenshot *</label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed var(--color-hairline)',
              borderRadius: 12,
              padding: screenshotUrl ? 0 : '32px 16px',
              cursor: 'pointer',
              marginBottom: 20,
              overflow: 'hidden',
            }}
          >
            {screenshotUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={screenshotUrl} alt="Payment screenshot" style={{ width: '100%', maxHeight: 320, objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 13.5, color: 'var(--color-muted)' }}>
                {uploading ? 'Uploading…' : 'Tap to upload screenshot'}
              </span>
            )}
            <input type="file" accept="image/*" onChange={handleScreenshotUpload} style={{ display: 'none' }} />
          </label>

          {error && <p style={{ color: '#b3413a', fontSize: 14, marginBottom: 16 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                flex: 1,
                border: '1px solid var(--color-hairline)',
                background: 'var(--color-white)',
                borderRadius: 999,
                padding: '15px',
                fontSize: 14.5,
              }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={submitting || uploading || !screenshotUrl}
              style={{
                flex: 2,
                background: 'var(--color-ink)',
                color: 'var(--color-white)',
                border: 'none',
                borderRadius: 999,
                padding: '15px',
                fontSize: 14.5,
                opacity: submitting || uploading || !screenshotUrl ? 0.6 : 1,
              }}
            >
              {submitting ? 'Confirming order…' : `Confirm order ${formatPKR(totalPrice)}`}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 32,
          background: 'var(--color-cream)',
          borderRadius: 14,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 16, marginBottom: 18 }}>Order summary</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          {items.map((item) => (
            <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span>{item.name} × {item.quantity}</span>
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

      <style>{`
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