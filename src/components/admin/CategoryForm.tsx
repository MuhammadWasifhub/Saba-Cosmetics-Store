'use client';

import { useState } from 'react';


type CategoryFormData = {
  name: string;
  slug: string;
  tag: string;
  icon_url: string;
  sort_order: number;
  is_active: boolean;
};

export default function CategoryForm({
  initial,
  onSubmit,
  loading,
  error,
}: {
  initial?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => void;
  loading?: boolean;
  error?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<CategoryFormData>({
    name: initial?.name || '',
    slug: initial?.slug || '',
    tag: initial?.tag || '',
    icon_url: initial?.icon_url || '',
    sort_order: initial?.sort_order ?? 0,
    is_active: initial?.is_active ?? true,
  });

  function update<K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      style={{
        background: 'var(--color-white)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 12,
        padding: 28,
        maxWidth: 640,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div>
        <label style={lbl}>Name *</label>
        <input
          value={form.name}
          onChange={(e) => {
            update('name', e.target.value);
            if (!initial) update('slug', autoSlug(e.target.value));
          }}
          placeholder="e.g. Nail Paints"
          style={inp}
        />
      </div>

      <div>
        <label style={lbl}>Slug *</label>
        <input
          value={form.slug}
          onChange={(e) => update('slug', e.target.value)}
          placeholder="e.g. nail-paints"
          style={inp}
        />
        <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>
          It will use in URL, Product slug should be matched with it.
        </p>
      </div>

      <div>
        <label style={lbl}>Tagline</label>
        <input
          value={form.tag}
          onChange={(e) => update('tag', e.target.value)}
          placeholder="e.g. Colour story"
          style={inp}
        />
      </div>

            <div>
        <label style={lbl}>Icon</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              background: 'var(--color-blush-pale)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {form.icon_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.icon_url} alt="" style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 20, color: 'var(--color-blush-deep)' }}>+</span>
            )}
          </div>
          <label
            style={{
              ...inp,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: uploading ? 'wait' : 'pointer',
              textAlign: 'center',
            }}
          >
            {uploading ? 'Uploading…' : form.icon_url ? 'Replace icon' : 'Choose icon'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setUploading(true);
                const fd = new FormData();
                fd.append('file', f);
                const res = await fetch('/api/admin/upload-icon', { method: 'POST', body: fd });
                const json = await res.json();
                setUploading(false);
                if (res.ok && json.url) update('icon_url', json.url);
                else alert(json.error || 'Upload failed');
              }}
            />
          </label>
          {form.icon_url && (
            <button
              type="button"
              onClick={() => update('icon_url', '')}
              style={{
                fontSize: 12.5,
                color: '#b3413a',
                padding: '6px 10px',
                border: '1px solid #b3413a33',
                borderRadius: 999,
              }}
            >
              Remove
            </button>
          )}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>
          PNG / JPG / SVG. Auto store.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={lbl}>Sort order</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => update('sort_order', parseInt(e.target.value) || 0)}
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Status</label>
          <button
            type="button"
            onClick={() => update('is_active', !form.is_active)}
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 10,
              border: '1px solid var(--color-hairline)',
              background: form.is_active ? 'var(--color-success)' : 'var(--color-hairline)',
              color: form.is_active ? '#fff' : 'var(--color-muted)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {form.is_active ? 'Active (visible on store)' : 'Hidden'}
          </button>
        </div>
      </div>

      {error && <p style={{ color: '#b3413a', fontSize: 13 }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          background: 'var(--color-ink)',
          color: 'var(--color-white)',
          padding: '14px',
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 500,
          marginTop: 6,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Saving…' : 'Save category'}
      </button>
    </form>
  );
}

const lbl: React.CSSProperties = {
  fontSize: 13,
  display: 'block',
  marginBottom: 6,
  fontWeight: 500,
};

const inp: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--color-hairline)',
  borderRadius: 10,
  padding: '12px 15px',
  fontSize: 14,
  fontFamily: 'var(--font-body)',
};