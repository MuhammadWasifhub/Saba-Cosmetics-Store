'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Link
        href={`/products/${product.slug}`}
        style={{
          display: 'block',
          aspectRatio: '1 / 1.1',
          background: 'var(--color-blush-pale)',
          borderRadius: 10,
          overflow: 'hidden',
          marginBottom: 14,
          position: 'relative',
        }}
      >
        {(product.image_url || product.images?.[0]) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url || product.images[0]}
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
              color: 'var(--color-blush-deep)',
              fontFamily: 'var(--font-display)',
              fontSize: 28,
            }}
          >
            {product.name.charAt(0)}
          </div>
        )}
        {outOfStock && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'var(--color-white)',
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 999,
              color: 'var(--color-muted)',
            }}
          >
            Sold out
          </span>
        )}
      </Link>

      <Link href={`/products/${product.slug}`}>
        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{product.name}</p>
      </Link>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 12 }}>
        {product.category}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{formatPKR(product.price)}</span>
          {product.compare_at_price && (
            <span
              style={{
                fontSize: 13,
                color: 'var(--color-muted)',
                textDecoration: 'line-through',
              }}
            >
              {formatPKR(product.compare_at_price)}
            </span>
          )}
        </div>
        <button
          disabled={outOfStock}
          onClick={() =>
            addItem({
              product_id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
            })
          }
          style={{
            border: '1px solid var(--color-ink)',
            background: outOfStock ? 'var(--color-hairline)' : 'transparent',
            color: outOfStock ? 'var(--color-muted)' : 'var(--color-ink)',
            borderRadius: 999,
            padding: '8px 16px',
            fontSize: 13,
            opacity: outOfStock ? 0.6 : 1,
            cursor: outOfStock ? 'not-allowed' : 'pointer',
          }}
        >
          {outOfStock ? 'Sold out' : 'Add to bag'}
        </button>
      </div>
    </div>
  );
}
