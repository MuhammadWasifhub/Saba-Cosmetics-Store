'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

export default function AllProductsClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <main className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>All Products</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 15 }}>
          Explore our curated beauty essentials.
        </p>
      </div>

      <div style={{ position: 'relative', marginBottom: 40, maxWidth: 480 }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="2"
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by name, category..."
          style={{
            width: '100%',
            border: '1px solid var(--color-hairline)',
            borderRadius: 999,
            padding: '14px 16px 14px 46px',
            fontSize: 14,
            fontFamily: 'var(--font-body)',
            background: 'var(--color-cream)',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: 18,
              color: 'var(--color-muted)',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {query && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"
        </p>
      )}

      {filtered.length === 0 ? (
        <div
          style={{
            padding: '60px 0',
            textAlign: 'center',
            color: 'var(--color-muted)',
            border: '1px dashed var(--color-hairline)',
            borderRadius: 12,
          }}
        >
          <p>{query ? 'No products match your search.' : 'No products yet.'}</p>
        </div>
      ) : (
        <div className="all-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px 28px' }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .all-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .all-products-grid { grid-template-columns: 1fr 1fr !important; gap: 24px 16px !important; }
        }
      `}</style>
    </main>
  );
}