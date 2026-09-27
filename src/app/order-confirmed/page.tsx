'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmedContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');
  const customerId = params.get('cid');

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
        Thank you ☺️ your payment details have been received.
        <br />
        We'll verify your payment and your order will be delivered within 2–3 business days.
      </p>
      {orderNumber && (
        <p style={{ fontSize: 15, marginBottom: 8 }}>
          Order number: <strong>{orderNumber}</strong>
        </p>
      )}
      {customerId && (
        <div
          style={{
            background: 'var(--color-cream)',
            borderRadius: 12,
            padding: '16px 20px',
            marginTop: 16,
            marginBottom: 32,
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 6 }}>
            Your Customer ID
          </p>
          <p style={{ fontSize: 20, fontWeight: 600, letterSpacing: '0.03em' }}>{customerId}</p>
          <p style={{ fontSize: 12.5, color: 'var(--color-muted)', marginTop: 8, lineHeight: 1.5 }}>
            Please save this ID. You'll need it for any future order tracking, returns, or complaints.
          </p>
        </div>
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