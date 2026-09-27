'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-hairline)',
        position: 'sticky',
        top: 0,
        background: 'var(--color-white)',
        zIndex: 40,
      }}
    >
      <div
        className="container header-inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 76,
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          Saba Cosmetics
        </Link>

        <nav className="header-nav-center" style={{ display: 'flex', alignItems: 'center', gap: 36, fontSize: 14 }}>
          <Link href="/" style={{ color: pathname === '/' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/' ? 600 : 400 }}>Home</Link>
          <Link href="/all-products" style={{ color: pathname === '/all-products' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/all-products' ? 600 : 400 }}>All Products</Link>
          <Link href="/about" style={{ color: pathname === '/about' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/about' ? 600 : 400 }}>Our Story</Link>
          <Link href="/returns" style={{ color: pathname === '/returns' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/returns' ? 600 : 400 }}>Report</Link>
          <Link href="/policies" style={{ color: pathname === '/policies' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/policies' ? 600 : 400 }}>Policy</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={openCart}
            aria-label="Open bag"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-ink)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: 999,
              padding: '10px 18px',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="bag-label">Bag</span>
            <span
              style={{
                background: 'var(--color-blush)',
                color: 'var(--color-ink)',
                borderRadius: 999,
                minWidth: 20,
                height: 20,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                padding: '0 4px',
              }}
            >
              {totalItems}
            </span>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              padding: 6,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="mobile-nav-panel"
          style={{
            borderTop: '1px solid var(--color-hairline)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            fontSize: 15,
          }}
        >
          <Link href="/" onClick={() => setMobileOpen(false)} style={{ color: pathname === '/' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/' ? 600 : 400 }}>Home</Link>
          <Link href="/all-products" onClick={() => setMobileOpen(false)} style={{ color: pathname === '/all-products' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/all-products' ? 600 : 400 }}>All Products</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} style={{ color: pathname === '/about' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/about' ? 600 : 400 }}>Our Story</Link>
          <Link href="/returns" onClick={() => setMobileOpen(false)} style={{ color: pathname === '/returns' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/returns' ? 600 : 400 }}>Report</Link>
          <Link href="/policies" onClick={() => setMobileOpen(false)} style={{ color: pathname === '/policies' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/policies' ? 600 : 400 }}>Policy</Link>
        </div>
      )}

      <style>{`
        .header-nav-center { margin-left: auto; margin-right: 310px; }
        .mobile-nav-panel { display: none; }
        .bag-label { display: inline; }
        @media (max-width: 760px) {
          .header-nav-center { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
          .mobile-nav-panel { display: flex !important; }
          .bag-label { display: none; }
        }
      `}</style>
    </header>
  );
}
