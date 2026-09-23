'use client';

import { useEffect, useState } from 'react';
import { Banner, Product } from '@/lib/types';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const [bRes, pRes] = await Promise.all([
      fetch('/api/admin/banners'),
      fetch('/api/admin/products'),
    ]);
    const bData = await bRes.json();
    const pData = await pRes.json();
    setBanners(bData.banners || []);
    setProducts(pData.products || []);
    setLoading(false);
  }

  async function handleAddBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setError(uploadData.error || 'Upload failed.');
        setUploading(false);
        return;
      }

      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: uploadData.url,
          sort_order: banners.length,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBanners((prev) => [...prev, data.banner]);
      } else {
        setError(data.error || 'Could not create banner.');
      }
    } catch {
      setError('Something went wrong.');
    }
    setUploading(false);
    e.target.value = '';
  }

  async function updateBanner(id: string, updates: Partial<Banner>) {
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      setBanners((prev) => prev.map((b) => (b.id === id ? data.banner : b)));
    }
  }

  async function deleteBanner(id: string) {
    if (!confirm('Remove this banner slide?')) return;
    const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Homepage Banner</h1>
        <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>
          Add multiple images to create an auto-sliding banner on your homepage. Customers can tap the dots to
          navigate, or tap the banner to visit the linked product.
        </p>
      </div>

      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--color-ink)',
          color: 'var(--color-white)',
          borderRadius: 999,
          padding: '10px 20px',
          fontSize: 14,
          cursor: 'pointer',
          marginBottom: 24,
        }}
      >
        {uploading ? 'Uploading…' : '+ Add banner slide'}
        <input type="file" accept="image/*" onChange={handleAddBanner} style={{ display: 'none' }} />
      </label>

      {error && <p style={{ color: '#b3413a', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Loading…</p>
      ) : banners.length === 0 ? (
        <div style={{ background: 'var(--color-white)', border: '1px dashed var(--color-hairline)', borderRadius: 12, padding: 60, textAlign: 'center', color: 'var(--color-muted)' }}>
          No banner slides yet. Add one above — until then, the homepage shows a default placeholder banner.
        </div>
      ) : (
        <div className="banner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {banners.map((banner, index) => (
            <div key={banner.id} style={{ background: 'var(--color-white)', border: '1px solid var(--color-hairline)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '4/3', background: 'var(--color-blush-pale)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={banner.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 16 }}>
                <input
                  placeholder="Title (e.g. New Radiance Serum)"
                  defaultValue={banner.title}
                  onBlur={(e) => updateBanner(banner.id, { title: e.target.value })}
                  style={{ ...miniInput, marginBottom: 8 }}
                />
                <input
                  placeholder="Subtitle (e.g. This month)"
                  defaultValue={banner.subtitle}
                  onBlur={(e) => updateBanner(banner.id, { subtitle: e.target.value })}
                  style={{ ...miniInput, marginBottom: 8 }}
                />
                <select
                  defaultValue={banner.product_id || ''}
                  onChange={(e) => updateBanner(banner.id, { product_id: e.target.value || null })}
                  style={{ ...miniInput, marginBottom: 12 }}
                >
                  <option value="">No linked product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      Link to: {p.name}
                    </option>
                  ))}
                </select>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
                    <input
                      type="checkbox"
                      checked={banner.is_active}
                      onChange={(e) => updateBanner(banner.id, { is_active: e.target.checked })}
                    />
                    Active
                  </label>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    style={{ fontSize: 12.5, color: '#b3413a', background: 'none', border: 'none' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const miniInput: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--color-hairline)',
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 13,
  fontFamily: 'var(--font-body)',
};
