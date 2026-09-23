'use client';

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(36,28,24,0.35)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
          zIndex: 50,
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 'min(420px, 100vw)',
          background: 'var(--color-white)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 51,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(36,28,24,0.08)',
        }}
      >
        <div
          style={{
            padding: '24px 24px 20px',
            borderBottom: '1px solid var(--color-hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: 20 }}>Your Bag</h2>
          <button
            onClick={closeCart}
            aria-label="Close bag"
            style={{
              background: 'none',
              border: 'none',
              fontSize: 22,
              lineHeight: 1,
              color: 'var(--color-muted)',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {items.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-muted)' }}>
              <p>Your bag is empty.</p>
              <p style={{ fontSize: 14, marginTop: 8 }}>Add a few things you love. They'll show up here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {items.map((item) => (
                <div key={item.product_id} style={{ display: 'flex', gap: 14 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      background: 'var(--color-blush-pale)',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {item.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</p>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        aria-label={`Remove ${item.name}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-muted)',
                          fontSize: 13,
                          padding: 0,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
                      {formatPKR(item.price)}
                    </p>
                    <div
                      style={{
                        marginTop: 10,
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid var(--color-hairline)',
                        borderRadius: 999,
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        style={{
                          background: 'none',
                          border: 'none',
                          width: 28,
                          height: 28,
                          fontSize: 15,
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: 13, minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        style={{
                          background: 'none',
                          border: 'none',
                          width: 28,
                          height: 28,
                          fontSize: 15,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid var(--color-hairline)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 15,
                marginBottom: 16,
              }}
            >
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatPKR(totalPrice)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: 'block',
                textAlign: 'center',
                background: 'var(--color-ink)',
                color: 'var(--color-white)',
                padding: '15px',
                borderRadius: 999,
                fontSize: 15,
              }}
            >
              Pay Now Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
