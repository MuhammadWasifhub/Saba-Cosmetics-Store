'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const outOfStock = product.stock <= 0;

  const gallery = product.images && product.images.length > 0
    ? product.images
    : product.image_url
    ? [product.image_url]
    : [];
  const [activeImg, setActiveImg] = useState(0);

  function handleTouchStart(e: React.TouchEvent) {
    (e.currentTarget as any)._touchStartX = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const startX = (e.currentTarget as any)._touchStartX;
    if (startX === undefined) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setActiveImg((i) => Math.min(gallery.length - 1, i + 1));
      else setActiveImg((i) => Math.max(0, i - 1));
    }
  }

  return (
    <main className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Link href="/all-products" style={{ fontSize: 14, color: 'var(--color-muted)' }}>
        ← Back to shop
      </Link>

      <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginTop: 28 }}>
        <div>
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'var(--color-blush-pale)',
              borderRadius: 16,
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {gallery.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gallery[activeImg]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 60,
                  color: 'var(--color-blush-deep)',
                }}
              >
                {product.name.charAt(0)}
              </div>
            )}

            {gallery.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 6,
                }}
              >
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    style={{
                      width: i === activeImg ? 18 : 7,
                      height: 7,
                      borderRadius: 999,
                      border: 'none',
                      background: i === activeImg ? 'var(--color-ink)' : 'rgba(36,28,24,0.3)',
                      transition: 'width 0.2s ease',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="thumb-row" style={{ display: 'flex', gap: 10, marginTop: 12, overflowX: 'auto' }}>
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: i === activeImg ? '2px solid var(--color-ink)' : '2px solid transparent',
                    flexShrink: 0,
                    padding: 0,
                    background: 'var(--color-blush-pale)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ paddingTop: 8 }}>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
            {product.category}
          </p>
          <h1 style={{ fontSize: 34, marginBottom: 16 }} className="detail-title">{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 22, fontWeight: 600 }}>{formatPKR(product.price)}</span>
            {product.compare_at_price && (
              <span
                style={{
                  fontSize: 16,
                  color: 'var(--color-muted)',
                  textDecoration: 'line-through',
                }}
              >
                {formatPKR(product.compare_at_price)}
              </span>
            )}
          </div>

          <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: 32 }}>
            {product.description || 'No description available for this product yet.'}
          </p>

          {outOfStock ? (
            <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>
              This product is currently out of stock.
            </p>
          ) : (
            <div className="detail-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 999,
                }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  style={{ background: 'none', border: 'none', width: 40, height: 44, fontSize: 18 }}
                >
                  −
                </button>
                <span style={{ minWidth: 24, textAlign: 'center', fontSize: 15 }}>{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  style={{ background: 'none', border: 'none', width: 40, height: 44, fontSize: 18 }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() =>
                  addItem(
                    {
                      product_id: product.id,
                      name: product.name,
                      price: product.price,
                      image_url: product.image_url || gallery[0] || null,
                    },
                    qty
                  )
                }
                style={{
                  flex: 1,
                  background: 'var(--color-ink)',
                  color: 'var(--color-white)',
                  border: 'none',
                  borderRadius: 999,
                  padding: '15px 24px',
                  fontSize: 15,
                }}
              >
                Add to bag
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .thumb-row::-webkit-scrollbar { height: 4px; }
        @media (max-width: 800px) {
          .detail-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .detail-title { font-size: 26px !important; }
        }
        @media (max-width: 420px) {
          .detail-actions { flex-wrap: wrap; }
        }
      `}</style>
    </main>
  );
}
