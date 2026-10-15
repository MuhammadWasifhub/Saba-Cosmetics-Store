'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CategoryForm from '@/components/admin/CategoryForm';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initial, setInitial] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => {
        const found = (d.categories || []).find((c: any) => c.id === id);
        if (found) setInitial(found);
      });
  }, [id]);

  async function handleSubmit(data: any) {
    setLoading(true);
    setError('');
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || 'Failed to update');
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
      <h1 style={{ fontSize: 26, margin: '14px 0 24px' }}>Edit category</h1>
      {initial ? (
        <CategoryForm
          initial={initial}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      ) : (
        <p style={{ color: 'var(--color-muted)' }}>Loading…</p>
      )}
    </div>
  );
}