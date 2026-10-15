'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CategoryForm from '@/components/admin/CategoryForm';
export const runtime = 'edge';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(data: any) {
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || 'Failed to create');
      setLoading(false);
      return;
    }
    router.push('/admin/dashboard/categories');
    router.refresh();
  }

  return (
    <div>
      <Link
        href="/admin/dashboard/categories"
        style={{ fontSize: 13, color: 'var(--color-muted)' }}
      >
        ← Back to categories
      </Link>
      <h1 style={{ fontSize: 26, margin: '14px 0 24px' }}>New category</h1>
      <CategoryForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
}