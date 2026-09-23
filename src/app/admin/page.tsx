'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      setError('Incorrect password.');
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-cream)',
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--color-white)',
          padding: 40,
          borderRadius: 16,
          width: '100%',
          maxWidth: 380,
          boxShadow: '0 4px 24px rgba(36,28,24,0.06)',
        }}
      >
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>Saba Cosmetics</h1>
        <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 28 }}>
          Admin panel — please sign in.
        </p>

        <label style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            border: '1px solid var(--color-hairline)',
            borderRadius: 10,
            padding: '13px 16px',
            fontSize: 14,
            marginBottom: 16,
          }}
        />

        {error && <p style={{ color: '#b3413a', fontSize: 13, marginBottom: 16 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'var(--color-ink)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 999,
            padding: '14px',
            fontSize: 15,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
