'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { Category, FALLBACK_CATEGORIES } from '@/lib/categories';

// categories loaded from DB

type SortKey = 'featured' | 'new' | 'price-asc' | 'price-desc';

export default function AllProductsClient({
  products,
  categories = [],
}: {
  products: Product[];
  categories?: Category[];
}) {
  const categoryList: { label: string; slug: string }[] = [
    { label: 'All', slug: 'All' },
    ...(categories.length > 0
      ? categories.map((c) => ({ label: c.name, slug: c.slug }))
      : FALLBACK_CATEGORIES.map((c) => ({ label: c.name, slug: c.slug }))),
    { label: 'Sale', slug: 'Sale' },
  ];
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  /* Sync from URL params */
  useEffect(() => {
    const catParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');
    const saleParam = searchParams.get('sale');

    if (catParam) setActiveCategory(catParam);
    if (sortParam === 'new') {
      setSort('new');
      setActiveCategory('New In');
    }
    if (saleParam === '1') {
      setActiveCategory('Sale');
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory === 'Sale') {
      list = list.filter(
        (p) => p.category?.toLowerCase() === 'sale'
      );
    } else if (activeCategory === 'New In') {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      list = list.filter((p) => {
        const c = (p as any).created_at;
        return c && new Date(c).getTime() >= cutoff;
      });
      if (list.length === 0) list = [...products].slice(0, 8);
    } else if (activeCategory !== 'All') {
      list = list.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'new':
        list.sort(
          (a, b) =>
            new Date((b as any).created_at || 0).getTime() -
            new Date((a as any).created_at || 0).getTime()
        );
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        break;
    }

    return list;
  }, [products, activeCategory, query, sort]);

  function selectCategory(slug: string) {
    setActiveCategory(slug);
  }

  return (
    <main className="container ap-main">
      {/* Header */}
      <div className="ap-head">
        <div className="ap-head-copy">
          <p className="ap-eyebrow">The collection</p>
          <h1 className="ap-title">All Products</h1>
          <p className="ap-sub">Explore our curated beauty essentials.</p>
        </div>

        <div className="ap-head-actions">
          <div className="ap-search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="ap-clear"
              >
                ×
              </button>
            )}
          </div>

          <div className="ap-sort">
            <label htmlFor="ap-sort" className="ap-sort-label">
              Sort
            </label>
            <select
              id="ap-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>

          <div className="ap-view" role="group" aria-label="View mode">
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-label="Grid view"
              className={view === 'grid' ? 'is-active' : ''}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="3" y="3" width="8" height="8" rx="1.5" />
                <rect x="13" y="3" width="8" height="8" rx="1.5" />
                <rect x="3" y="13" width="8" height="8" rx="1.5" />
                <rect x="13" y="13" width="8" height="8" rx="1.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-label="List view"
              className={view === 'list' ? 'is-active' : ''}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="3" y="4" width="18" height="3" rx="1.5" />
                <rect x="3" y="10.5" width="18" height="3" rx="1.5" />
                <rect x="3" y="17" width="18" height="3" rx="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="ap-pills hide-scrollbar" role="tablist" aria-label="Categories">
        {categoryList.map((c) => (
          <button
            key={c.slug}
            type="button"
            role="tab"
            aria-selected={activeCategory === c.slug}
            className={`pill ${activeCategory === c.slug ? 'active' : ''}`}
            onClick={() => selectCategory(c.slug)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      {(query || activeCategory !== 'All') && (
        <p className="ap-count">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          {query ? ` for "${query}"` : ''}
          {activeCategory !== 'All' && !query ? ` in ${activeCategory}` : ''}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="ap-empty">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>
            Nothing here yet
          </p>
          <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 20 }}>
            {query
              ? 'Try a different search or category.'
              : 'Products will appear here soon.'}
          </p>
          {(query || activeCategory !== 'All') && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setQuery('');
                setActiveCategory('All');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
                <div className={`ap-grid ap-grid-${view} anim-fade-in all-products-page-grid`} key={`${activeCategory}-${sort}-${view}`}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .ap-main {
          padding-top: 48px;
          padding-bottom: 96px;
        }

        .ap-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 32px;
        }

        .ap-eyebrow {
          font-size: 12.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-blush-deep);
          font-weight: 600;
          margin-bottom: 10px;
        }

        .ap-title {
          font-size: clamp(28px, 3.6vw, 40px);
          margin-bottom: 8px;
        }

        .ap-sub {
          font-size: 15px;
          color: var(--color-muted);
        }

        .ap-head-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ap-search {
          position: relative;
          min-width: 240px;
        }

        .ap-search svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .ap-search input {
          width: 100%;
          border: 1px solid var(--color-hairline);
          border-radius: 999px;
          padding: 13px 40px 13px 46px;
          font-size: 14px;
          background: var(--color-cream);
          color: var(--color-ink);
          transition: border-color 200ms var(--ease-out), background 200ms var(--ease-out);
        }

        .ap-search input:focus {
          outline: none;
          border-color: var(--color-blush-deep);
          background: var(--color-white);
          box-shadow: 0 0 0 3px rgba(201,166,143,0.15);
        }

        .ap-clear {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          line-height: 1;
          color: var(--color-muted);
          padding: 2px 6px;
        }

        .ap-sort {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ap-sort-label {
          font-size: 12.5px;
          color: var(--color-muted);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .ap-sort select {
          border: 1px solid var(--color-hairline);
          border-radius: 999px;
          padding: 11px 34px 11px 16px;
          font-size: 13.5px;
          background: var(--color-white);
          color: var(--color-ink);
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237a6d64' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          transition: border-color 200ms var(--ease-out);
        }

        .ap-sort select:focus {
          outline: none;
          border-color: var(--color-blush-deep);
        }

        .ap-view {
          display: flex;
          border: 1px solid var(--color-hairline);
          border-radius: 999px;
          overflow: hidden;
          background: var(--color-white);
        }

        .ap-view button {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-muted);
          transition: background 200ms var(--ease-out), color 200ms var(--ease-out);
        }

        .ap-view button.is-active {
          background: var(--color-ink);
          color: var(--color-white);
        }

        .ap-view button:not(.is-active):hover {
          background: var(--color-blush-pale);
          color: var(--color-ink);
        }

        .ap-pills {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
          margin-bottom: 28px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .ap-pills::-webkit-scrollbar { display: none; }

        .ap-count {
          font-size: 13px;
          color: var(--color-muted);
          margin-bottom: 22px;
          letter-spacing: 0.01em;
        }

        .ap-empty {
          padding: 80px 0;
          text-align: center;
          border: 1px dashed var(--color-hairline);
          border-radius: var(--radius);
          background: var(--color-cream);
        }

        .ap-grid {
          display: grid;
          gap: 40px 28px;
        }

        .ap-grid-grid {
          grid-template-columns: repeat(4, 1fr);
        }

        .ap-grid-list {
          grid-template-columns: repeat(2, 1fr);
        }

        .ap-grid-list > * {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 22px;
          align-items: start;
        }

        @media (max-width: 1000px) {
          .ap-grid-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 900px) {
          .ap-head {
            flex-direction: column;
            align-items: stretch;
          }

          .ap-head-actions {
            width: 100%;
          }

          .ap-search { flex: 1; min-width: 0; }

          .ap-grid-grid { grid-template-columns: repeat(2, 1fr); }
          .ap-grid-list { grid-template-columns: 1fr; }
        }

        @media (max-width: 560px) {
          .ap-main { padding-top: 28px; padding-bottom: 64px; }
          .ap-grid-grid { gap: 26px 16px; }
          .ap-search input { padding: 12px 40px 12px 42px; font-size: 13.5px; }
          .ap-sort-label { display: none; }
          .ap-view { display: none; }
          
          /* Make buttons full width ONLY on All Products page */
          .all-products-page-grid .pc-price-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .all-products-page-grid .pc-price-wrap {
            flex-direction: column !important;
            gap: 2px !important;
          }
          .all-products-page-grid .pc-add-btn {
            width: 100% !important;
            padding: 8px 13px !important;
          }
        }
      ` }} />
    </main>
  );
}