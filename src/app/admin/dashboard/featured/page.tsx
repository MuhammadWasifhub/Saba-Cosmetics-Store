'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export default function AdminFeaturedPage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [fRes, pRes] = await Promise.all([
      fetch('/api/admin/featured'),
      fetch('/api/admin/products'),
    ]);
    const fData = await fRes.json();
    const pData = await pRes.json();
    setFeatured(fData.featured || []);
    setAllProducts(pData.products || []);
    setLoading(false);
  }

  async function addFeatured() {
    if (!selectedId) return;
    const res = await fetch('/api/admin/featured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: selectedId }),
    });
    if (res.ok) {
      const data = await res.json();
      setFeatured((prev) => [...prev, data.featured]);
      setSelectedId('');
    } else {
      alert('Could not add. It may already be in the list.');
    }
  }

  async function removeFeatured(id: string) {
    const res = await fetch(`/api/admin/featured/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setFeatured((prev) => prev.filter((f) => f.id !== id));
    }
  }

  const featuredProductIds = featured.map((f) => f.product_id);
  const availableProducts = allProducts.filter((p) => !featuredProductIds.includes(p.id));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Best Selling Products</h1>
        <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>
          Choose which products appear in the "Our best selling products" section on your homepage.
          Add as many as you like — customers will be able to scroll through them.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{
            border: '1px solid var(--color-hairline)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 14,
            minWidth: 240,
          }}
        >
          <option value="">Select a product to feature…</option>
          {availableProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          onClick={addFeatured}
          disabled={!selectedId}
          style={{
            background: 'var(--color-ink)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 999,
            padding: '10px 20px',
            fontSize: 14,
            opacity: selectedId ? 1 : 0.5,
          }}
        >
          + Add to Best Sellers
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Loading…</p>
      ) : featured.length === 0 ? (
        <div
          style={{
            background: 'var(--color-white)',
            border: '1px dashed var(--color-hairline)',
            borderRadius: 12,
            padding: 60,
            textAlign: 'center',
            color: 'var(--color-muted)',
          }}
        >
          No featured products yet. Add at least one above — until then, the homepage shows your
          most recently added products automatically.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {featured.map((f) => (
            <div
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: 'var(--color-white)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 6,
                  background: 'var(--color-blush-pale)',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {f.products?.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.products.image_url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{f.products?.name}</p>
                <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                  {formatPKR(f.products?.price || 0)}
                </p>
              </div>
              <button
                onClick={() => removeFeatured(f.id)}
                style={{
                  fontSize: 12.5,
                  color: '#b3413a',
                  background: 'none',
                  border: '1px solid #e5c5c0',
                  borderRadius: 8,
                  padding: '6px 12px',
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}