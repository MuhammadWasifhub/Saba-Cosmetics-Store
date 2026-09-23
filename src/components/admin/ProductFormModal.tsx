'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';

export default function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: (product: Product) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    compare_at_price: product?.compare_at_price?.toString() || '',
    category: product?.category || '',
    stock: product?.stock?.toString() || '0',
    is_active: product?.is_active ?? true,
  });
  const [images, setImages] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : product?.image_url
      ? [product.image_url]
      : []
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function updateField(key: keyof typeof form, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Upload failed for one of the images.');
        } else {
          uploaded.push(data.url);
        }
      } catch {
        setError('Upload failed. Please try again.');
      }
    }
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = '';
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveImageToFront(idx: number) {
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      return [item, ...copy];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.price) {
      setError('Name and price are required.');
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      category: form.category || 'General',
      stock: parseInt(form.stock, 10) || 0,
      is_active: form.is_active,
      image_url: images[0] || null,
      images,
    };

    const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
    const method = product ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Could not save product.');
      setSaving(false);
      return;
    }

    onSaved(data.product);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(36,28,24,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="product-modal"
        style={{
          background: 'var(--color-white)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 560,
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 32,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 24 }}>
          {product ? 'Edit product' : 'Add new product'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Product images (first image is the main thumbnail)</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt=""
                    onClick={() => moveImageToFront(i)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: i === 0 ? '2px solid var(--color-ink)' : '2px solid var(--color-hairline)',
                      cursor: 'pointer',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Remove image"
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--color-ink)',
                      color: 'var(--color-white)',
                      border: 'none',
                      fontSize: 12,
                      lineHeight: 1,
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                  {i === 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: -6,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 9,
                        background: 'var(--color-ink)',
                        color: 'var(--color-white)',
                        padding: '1px 6px',
                        borderRadius: 999,
                      }}
                    >
                      Main
                    </span>
                  )}
                </div>
              ))}
              <label
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 8,
                  border: '1px dashed var(--color-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: 'var(--color-muted)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {uploading ? '…' : '+ Add'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              Tap an image to make it the main thumbnail. You can select multiple files at once.
            </p>
          </div>

          <div>
            <label style={labelStyle}>Product name *</label>
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' as const }}
            />
          </div>

          <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Price (PKR) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Compare-at price (optional)</label>
              <input
                type="number"
                value={form.compare_at_price}
                onChange={(e) => updateField('compare_at_price', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <input
                placeholder="e.g. Skincare"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Stock quantity</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => updateField('stock', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => updateField('is_active', e.target.checked)}
            />
            Visible in store
          </label>

          {error && <p style={{ color: '#b3413a', fontSize: 13 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                border: '1px solid var(--color-hairline)',
                background: 'var(--color-white)',
                borderRadius: 999,
                padding: '13px',
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              style={{
                flex: 1,
                border: 'none',
                background: 'var(--color-ink)',
                color: 'var(--color-white)',
                borderRadius: 999,
                padding: '13px',
                fontSize: 14,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .product-modal { padding: 22px !important; border-radius: 12px !important; }
          .modal-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--color-hairline)',
  borderRadius: 10,
  padding: '11px 14px',
  fontSize: 14,
  fontFamily: 'var(--font-body)',
};
