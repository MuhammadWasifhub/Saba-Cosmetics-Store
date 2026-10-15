'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

type Announcement = {
  message: string;
  link_text?: string | null;
  link_url?: string | null;
};

export default function AnnouncementBar() {
  const [data, setData] = useState<Announcement | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        const { data: row, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'announcement')
          .maybeSingle();

        if (error || !row) return;

        const value = row.value as any;
        if (!value || value.enabled === false || !value.message) return;

        if (!cancelled) setData(value);
      } catch {
        /* silent — bar simply won't show */
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data || hidden) return null;

  const inner = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 13.5 }}>{data.message}</span>
      {data.link_text && (
        <span
          style={{
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {data.link_text} →
        </span>
      )}
    </span>
  );

  return (
    <div
      role="region"
      aria-label="Announcement"
      style={{
        background: 'var(--color-ink)',
        color: 'var(--color-white)',
        position: 'relative',
        zIndex: 45,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 44px 10px 20px',
          minHeight: 42,
          textAlign: 'center',
        }}
      >
        {data.link_url ? (
          <a href={data.link_url} style={{ color: 'inherit' }}>
            {inner}
          </a>
        ) : (
          inner
        )}
      </div>

      <button
        onClick={() => setHidden(true)}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-white)',
          opacity: 0.75,
          padding: 6,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}