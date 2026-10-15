'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

function isNew(createdAt?: string) {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - created < sevenDays;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;

  const img = product.image_url || product.images?.[0] || null;

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) / product.compare_at_price) * 100
        )
      : 0;

  const productIsNew = isNew((product as any).created_at);

  return (
    <div className="pc-root">
      <Link href={`/products/${product.slug}`} className="pc-media product-media">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.name} loading="lazy" />
        ) : (
          <div className="pc-placeholder" aria-hidden="true">
            {product.name.charAt(0)}
          </div>
        )}

        <div className="pc-badges">
          {discountPercent > 0 && !outOfStock && (
            <span className="badge badge-sale">-{discountPercent}%</span>
          )}
          {productIsNew && !outOfStock && <span className="badge badge-new">New</span>}
        </div>

        {outOfStock && (
          <span className="badge badge-soldout pc-soldout">Sold out</span>
        )}

        {!outOfStock && (
          <div className="pc-quick-add">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({
                  product_id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: img,
                });
              }}
              aria-label={`Add ${product.name} to bag`}
            >
              Quick add +
            </button>
          </div>
        )}
      </Link>

      <div className="pc-info">
        <Link href={`/products/${product.slug}`} className="pc-name-link">
          <p className="pc-name">{product.name}</p>
        </Link>
        <p className="pc-category">{product.category}</p>

        <div className="pc-price-row">
          <div className="pc-price-wrap">
            <span className="pc-price">{formatPKR(product.price)}</span>
            {discountPercent > 0 && (
              <span className="pc-compare">{formatPKR(product.compare_at_price!)}</span>
            )}
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() =>
              addItem({
                product_id: product.id,
                name: product.name,
                price: product.price,
                image_url: img,
              })
            }
            aria-label={`Add ${product.name} to bag`}
            className={`pc-add-btn ${outOfStock ? 'is-disabled' : ''}`}
          >
            {outOfStock ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>

            <style dangerouslySetInnerHTML={{ __html: `
        .pc-root {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .pc-media {
          display: block;
          position: relative;
          margin-bottom: 14px;
        }

        .pc-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-blush-deep);
          font-family: var(--font-display);
          font-size: 40px;
          background: var(--color-blush-pale);
        }

        .pc-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: flex-start;
        }

        .pc-soldout {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .pc-quick-add {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 12px;
          transform: translateY(calc(100% + 20px));
          transition: transform 380ms var(--ease-out), opacity 320ms var(--ease-out);
          opacity: 0;
        }

        .pc-media:hover .pc-quick-add,
        .pc-media:focus-visible .pc-quick-add {
          transform: translateY(0);
          opacity: 1;
        }

        .pc-quick-add button {
          width: 100%;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: var(--color-ink);
          font-size: 13.5px;
          font-weight: 600;
          padding: 12px;
          border-radius: 999px;
          letter-spacing: 0.01em;
          transition: background 220ms var(--ease-out), color 220ms var(--ease-out);
        }

        .pc-quick-add button:hover {
          background: var(--color-ink);
          color: var(--color-white);
        }

        @media (hover: none) {
          .pc-quick-add {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .pc-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .pc-name-link {
          display: block;
          min-width: 0;
        }

        .pc-name {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 4px;
          color: var(--color-ink);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.35;
          transition: color 200ms var(--ease-out);
        }

        .pc-name-link:hover .pc-name {
          color: var(--color-blush-deep);
        }

        .pc-category {
          font-size: 12.5px;
          color: var(--color-muted);
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }

        .pc-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: auto;
        }

        .pc-price-wrap {
          display: flex;
          align-items: baseline;
          gap: 8px;
          min-width: 0;
        }

        .pc-price {
          font-size: 15px;
          font-weight: 600;
          color: var(--color-ink);
          white-space: nowrap;
        }

        .pc-compare {
          font-size: 12.5px;
          color: var(--color-muted);
          text-decoration: line-through;
          white-space: nowrap;
        }

        .pc-add-btn {
          border: 1px solid var(--color-ink);
          background: transparent;
          color: var(--color-ink);
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 12.5px;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 220ms var(--ease-out);
        }

        .pc-add-btn:hover:not(.is-disabled) {
          background: var(--color-ink);
          color: var(--color-white);
          transform: translateY(-1px);
        }

        .pc-add-btn.is-disabled {
          background: var(--color-hairline);
          color: var(--color-muted);
          border-color: var(--color-hairline);
          opacity: 0.7;
        }

        @media (max-width: 480px) {
          .pc-name { font-size: 14px; }
          .pc-price { font-size: 14px; }
          .pc-add-btn { padding: 7px 13px; font-size: 12px; }
        }
      ` }} />
    </div>
  );
}