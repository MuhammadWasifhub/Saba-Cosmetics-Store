import Link from 'next/link';

export default function OrderConfirmedPage() {
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
      <p style={{ color: 'var(--color-muted)', marginBottom: 32 }}>
        Thank you ☺️ your payment details have been received.
        <br />
        Orders within Karachi are delivered in 2–3 business days. Orders outside Karachi can take up to 7 business days.
      </p>
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