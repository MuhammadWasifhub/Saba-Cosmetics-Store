'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Banner } from '@/lib/types';

export default function HeroBannerSlider({
  banners,
}: {
  banners: (Banner & { product_slug?: string | null })[];
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div
        style={{
          background: 'var(--color-blush)',
          borderRadius: 20,
          aspectRatio: '4 / 5',
          display: 'flex',
          alignItems: 'flex-end',
          padding: 32,
        }}
      >
        <div>
          <p style={{ fontSize: 13, color: 'var(--color-ink)', opacity: 0.7, marginBottom: 8 }}>
            This month
          </p>
          <h2 style={{ fontSize: 32, color: 'var(--color-ink)' }}>
            New Radiance
            <br />
            Serum
          </h2>
        </div>
      </div>
    );
  }

  const current = banners[active];
  const content = (
    <div
      style={{
        position: 'relative',
        borderRadius: 20,
        aspectRatio: '4 / 5',
        overflow: 'hidden',
        background: 'var(--color-blush)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.image_url}
        alt={current.title || 'Banner'}
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
      />
      {(current.title || current.subtitle) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(36,28,24,0.55), transparent 50%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: 32,
          }}
        >
          <div>
            {current.subtitle && (
              <p style={{ fontSize: 13, color: 'var(--color-white)', opacity: 0.85, marginBottom: 8 }}>
                {current.subtitle}
              </p>
            )}
            {current.title && (
              <h2 style={{ fontSize: 32, color: 'var(--color-white)' }}>{current.title}</h2>
            )}
          </div>
        </div>
      )}

      {banners.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            zIndex: 2,
          }}
        >
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive(i);
              }}
              aria-label={`Show slide ${i + 1}`}
              style={{
                width: i === active ? 20 : 8,
                height: 8,
                borderRadius: 999,
                border: 'none',
                background: i === active ? 'var(--color-white)' : 'rgba(255,255,255,0.5)',
                transition: 'width 0.2s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (current.product_id && current.product_slug) {
    return (
      <Link href={`/products/${current.product_slug}`} style={{ display: 'block', width: '100%' }}>
        {content}
      </Link>
    );
  }

  return content;
}
