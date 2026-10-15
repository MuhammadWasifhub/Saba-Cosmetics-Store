'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
export const runtime = 'edge';

type Category = {
  id: string;
  name: string;
  slug: string;
  tag: string;
  icon_url: string;
  sort_order: number;
  is_active: boolean;
};

export default function CategoriesAdminPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setItems(data.categories || []);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(c: Category) {
    const res = await fetch(`/api/admin/categories/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !c.is_active }),
    });
    if (res.ok) load();
  }

  async function remove(c: Category) {
    if (!confirm(`Delete "${c.name}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: 'DELETE' });
    if (res.ok) load();
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Categories</h1>
          <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Manage shop categories. Toggle to hide/show on store.
          </p>
        </div>
        <Link
          href="/admin/dashboard/categories/new"
          style={{
            background: 'var(--color-ink)',
            color: 'var(--color-white)',
            padding: '12px 22px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          + New category
        </Link>
      </div>

      {error && <p style={{ color: '#b3413a', marginBottom: 16 }}>{error}</p>}

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Loading…</p>
      ) : items.length === 0 ? (
        <div
          style={{
            padding: 40,
            background: 'var(--color-white)',
            border: '1px dashed var(--color-hairline)',
            borderRadius: 12,
            textAlign: 'center',
            color: 'var(--color-muted)',
          }}
        >
          No categories yet.
        </div>
      ) : (
        <div
          style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-hairline)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {items.map((c, i) => (
            <div
              key={c.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 1fr 100px 160px',
                alignItems: 'center',
                gap: 16,
                padding: '14px 18px',
                borderTop: i === 0 ? 'none' : '1px solid var(--color-hairline)',
              }}
              className="cat-row"
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'var(--color-blush-pale)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {c.icon_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.icon_url} alt="" style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ color: 'var(--color-blush-deep)', fontSize: 18 }}>{c.name.charAt(0)}</span>
                )}
              </div>

              <div>
                <p style={{ fontSize: 14.5, fontWeight: 500 }}>{c.name}</p>
                <p style={{ fontSize: 12.5, color: 'var(--color-muted)' }}>slug: {c.slug}</p>
              </div>

              <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>{c.tag || '—'}</p>

              <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>#{c.sort_order}</p>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => toggleActive(c)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 999,
                    fontSize: 12.5,
                    fontWeight: 500,
                    background: c.is_active ? 'var(--color-success)' : 'var(--color-hairline)',
                    color: c.is_active ? '#fff' : 'var(--color-muted)',
                  }}
                >
                  {c.is_active ? 'Active' : 'Hidden'}
                </button>
                <Link
                  href={`/admin/dashboard/categories/${c.id}`}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 999,
                    fontSize: 12.5,
                    border: '1px solid var(--color-hairline)',
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => remove(c)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 999,
                    fontSize: 12.5,
                    color: '#b3413a',
                    border: '1px solid #b3413a33',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 780px) {
          .cat-row {
            grid-template-columns: 50px 1fr !important;
            gap: 12px !important;
          }
          .cat-row > *:nth-child(n+3) {
            grid-column: 2;
          }
        }
      ` }} />
    </div>
  );
}