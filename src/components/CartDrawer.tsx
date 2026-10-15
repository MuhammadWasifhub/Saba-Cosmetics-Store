'use client';

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { useEffect } from 'react';

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

// no free shipping — removed

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCart();

  /* Lock body scroll when drawer open */
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  // shipping progress removed

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        aria-hidden={!isOpen}
        className={`cart-overlay ${isOpen ? 'is-open' : ''}`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
        className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
      >
        {/* Header */}
        <div className="cart-header">
          <div>
            <h2 className="cart-title">Your Bag</h2>
            <p className="cart-subtitle">
              {items.length === 0
                ? 'Nothing here yet'
                : `${items.length} item${items.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button onClick={closeCart} aria-label="Close bag" className="cart-close">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-blush-deep)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="cart-empty-title">Your bag is empty</p>
              <p className="cart-empty-sub">
                Add a few things you love. They&apos;ll show up here.
              </p>
              <Link href="/all-products" onClick={closeCart} className="btn btn-primary btn-sm">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <div className="cart-item-media">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt={item.name} />
                    ) : (
                      <div className="cart-item-placeholder" aria-hidden="true">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <p className="cart-item-name">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        aria-label={`Remove ${item.name}`}
                        className="cart-item-remove"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        >
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        </svg>
                      </button>
                    </div>

                    <p className="cart-item-price">{formatPKR(item.price)}</p>

                    <div className="cart-item-bottom">
                      <div className="qty-pill">
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <p className="cart-item-line-total">
                        {formatPKR(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span className="cart-summary-total">{formatPKR(totalPrice)}</span>
            </div>
            <p className="cart-summary-note">
              Shipping &amp; taxes calculated at checkout.
            </p>
            <Link href="/checkout" onClick={closeCart} className="cart-checkout-btn">
              Pay Now Checkout →
            </Link>
            <button onClick={closeCart} className="cart-continue-btn">
              Continue shopping
            </button>
          </div>
        )}
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(36,28,24,0.42);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 320ms var(--ease-out);
          z-index: 50;
        }

        .cart-overlay.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100dvh;
          width: min(440px, 100vw);
          background: var(--color-white);
          transform: translateX(105%);
          transition: transform 380ms var(--ease-out);
          z-index: 51;
          display: flex;
          flex-direction: column;
          box-shadow: -16px 0 48px rgba(36,28,24,0.14);
        }

        .cart-drawer.is-open {
          transform: translateX(0);
        }

        /* Header */
        .cart-header {
          padding: 22px 24px 18px;
          border-bottom: 1px solid var(--color-hairline);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-shrink: 0;
        }

        .cart-title {
          font-size: 20px;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .cart-subtitle {
          font-size: 12.5px;
          color: var(--color-muted);
          margin-top: 3px;
          letter-spacing: 0.02em;
        }

        .cart-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-muted);
          background: var(--color-cream);
          transition: background 200ms var(--ease-out), color 200ms var(--ease-out), transform 200ms var(--ease-out);
        }

        .cart-close:hover {
          background: var(--color-ink);
          color: var(--color-white);
          transform: rotate(90deg);
        }

        /* Body */
        .cart-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
        }

        .cart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 12px;
        }

        .cart-empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--color-blush-pale);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }

        .cart-empty-title {
          font-family: var(--font-display);
          font-size: 20px;
          margin-bottom: 6px;
        }

        .cart-empty-sub {
          font-size: 14px;
          color: var(--color-muted);
          margin-bottom: 24px;
          line-height: 1.6;
          max-width: 260px;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .cart-item {
          display: flex;
          gap: 14px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--color-hairline);
        }

        .cart-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .cart-item-media {
          width: 84px;
          height: 84px;
          border-radius: var(--radius);
          background: var(--color-blush-pale);
          overflow: hidden;
          flex-shrink: 0;
        }

        .cart-item-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 28px;
          color: var(--color-blush-deep);
        }

        .cart-item-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .cart-item-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: flex-start;
        }

        .cart-item-name {
          font-size: 14.5px;
          font-weight: 500;
          color: var(--color-ink);
          line-height: 1.35;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .cart-item-remove {
          color: var(--color-muted);
          padding: 4px;
          flex-shrink: 0;
          border-radius: 6px;
          transition: color 200ms var(--ease-out), background 200ms var(--ease-out);
        }

        .cart-item-remove:hover {
          color: var(--color-sale);
          background: rgba(194,80,74,0.08);
        }

        .cart-item-price {
          font-size: 13px;
          color: var(--color-muted);
          margin-top: 4px;
        }

        .cart-item-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          gap: 8px;
        }

        .qty-pill {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--color-hairline);
          border-radius: 999px;
          background: var(--color-white);
        }

        .qty-pill button {
          width: 30px;
          height: 30px;
          font-size: 15px;
          color: var(--color-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 160ms var(--ease-out);
        }

        .qty-pill button:hover {
          background: var(--color-blush-pale);
        }

        .qty-pill button:first-child { border-radius: 999px 0 0 999px; }
        .qty-pill button:last-child { border-radius: 0 999px 999px 0; }

        .qty-pill span {
          font-size: 13px;
          min-width: 26px;
          text-align: center;
          font-weight: 500;
        }

        .cart-item-line-total {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-ink);
          white-space: nowrap;
        }

        /* Footer */
        .cart-footer {
          padding: 22px 24px 24px;
          border-top: 1px solid var(--color-hairline);
          background: var(--color-white);
          flex-shrink: 0;
        }

        .cart-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 15px;
          margin-bottom: 6px;
        }

        .cart-summary-total {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .cart-summary-note {
          font-size: 12px;
          color: var(--color-muted);
          margin-bottom: 18px;
          letter-spacing: 0.01em;
        }

        .cart-checkout-btn {
          display: block;
          text-align: center;
          background: var(--color-ink);
          color: var(--color-white);
          padding: 16px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.01em;
          transition: background 240ms var(--ease-out), transform 200ms var(--ease-out), box-shadow 240ms var(--ease-out);
          box-shadow: 0 6px 18px rgba(36,28,24,0.16);
        }

        .cart-checkout-btn:hover {
          background: var(--color-plum);
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(36,28,24,0.22);
        }

        .cart-continue-btn {
          display: block;
          width: 100%;
          text-align: center;
          margin-top: 10px;
          padding: 12px;
          font-size: 13.5px;
          color: var(--color-muted);
          background: transparent;
          transition: color 200ms var(--ease-out);
        }

        .cart-continue-btn:hover {
          color: var(--color-ink);
        }

        @media (max-width: 480px) {
          .cart-header { padding: 18px 18px 14px; }
          .cart-body { padding: 16px 18px; }
          .cart-footer { padding: 18px 18px 20px; }
          .cart-item-media { width: 72px; height: 72px; }
        }
      ` }} />
    </>
  );
}