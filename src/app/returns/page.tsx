'use client';

import { useState } from 'react';

export default function ReturnsPage() {
  const [form, setForm] = useState({
    customer_id: '',
    order_number: '',
    type: 'return',
    reason: '',
    description: '',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function updateField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
        setError(data.error || 'Image upload failed.');
      } else {
        setImageUrl(data.url);
      }
    } catch {
      setError('Image upload failed.');
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.customer_id.trim()) return setError('Please enter your Customer ID.');
    if (!form.reason.trim()) return setError('Please enter a reason.');

    setSubmitting(true);
    try {
      const res = await fetch('/api/support-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image_url: imageUrl || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="container" style={{ paddingTop: 100, paddingBottom: 100, textAlign: 'center', maxWidth: 480 }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--color-blush)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28,
          }}
        >
          ✓
        </div>
        <h1 style={{ fontSize: 26, marginBottom: 12 }}>Request submitted</h1>
        <p style={{ color: 'var(--color-muted)' }}>
          Thank you. Our team will review your request and get back to you shortly.
        </p>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: 56, paddingBottom: 80, maxWidth: 560 }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Return / Complaint request</h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 32 }}>
        Your Customer ID was provided on your packaging and on your order confirmation page.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Customer ID *</label>
          <input
            placeholder="e.g. SC-2026-00123"
            value={form.customer_id}
            onChange={(e) => updateField('customer_id', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Order number (optional)</label>
          <input
            placeholder="e.g. SC260928-1234"
            value={form.order_number}
            onChange={(e) => updateField('order_number', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Request type *</label>
          <select
            value={form.type}
            onChange={(e) => updateField('type', e.target.value)}
            style={{ ...inputStyle, appearance: 'auto' as const }}
          >
            <option value="return">Product return</option>
            <option value="complaint">Complaint</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Reason *</label>
          <input
            placeholder="e.g. Wrong product received"
            value={form.reason}
            onChange={(e) => updateField('reason', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Additional details</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' as const }}
          />
        </div>
        <div>
          <label style={labelStyle}>Attach photo (optional)</label>
          <label
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px dashed var(--color-hairline)', borderRadius: 12,
              padding: imageUrl ? 0 : '24px 16px', cursor: 'pointer', overflow: 'hidden',
            }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 13.5, color: 'var(--color-muted)' }}>
                {uploading ? 'Uploading…' : 'Tap to upload photo'}
              </span>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {error && <p style={{ color: '#b3413a', fontSize: 14 }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting || uploading}
          style={{
            background: 'var(--color-ink)', color: 'var(--color-white)', border: 'none',
            borderRadius: 999, padding: '16px', fontSize: 15, opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'Submitting…' : 'Submit request'}
        </button>
      </form>
    </main>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid var(--color-hairline)', borderRadius: 10,
  padding: '13px 16px', fontSize: 14, fontFamily: 'var(--font-body)',
};