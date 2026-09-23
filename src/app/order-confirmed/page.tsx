'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmedContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');

  return (
    <main
      className="container"
      style={{ paddingTop: 100, paddingBottom: 100, textAlign: 'center', maxWidth: 520 }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--color-blush)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: 28,
        }}
      >
        ✓
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Order confirmed</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: 8 }}>
        Thank you ☺️ your order has been confirmed.
        <br />
        Your order will be delivered within 2–3 business days.
      </p>
      {orderNumber && (
        <p style={{ fontSize: 15, marginBottom: 32 }}>
          Order number: <strong>{orderNumber}</strong>
        </p>
      )}
      <Link
        href="/"
        style={{
          display: 'inline-block',
          background: 'var(--color-ink)',
          color: 'var(--color-white)',
          padding: '14px 28px',
          borderRadius: 999,
        }}
      >
        Continue shopping
      </Link>
    </main>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmedContent />
    </Suspense>
  );
}
