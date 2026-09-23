'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  }

  const links = [
    { href: '/admin/dashboard', label: 'Overview' },
    { href: '/admin/dashboard/products', label: 'Products' },
    { href: '/admin/dashboard/banners', label: 'Banner' },
    { href: '/admin/dashboard/featured', label: 'Best Sellers' },
    { href: '/admin/dashboard/orders', label: 'Orders' },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="admin-mobile-bar"
        style={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-hairline)',
          background: 'var(--color-white)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Saba Cosmetics</div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', padding: 4 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      <aside
        className="admin-sidebar"
        style={{
          width: 220,
          borderRight: '1px solid var(--color-hairline)',
          background: 'var(--color-white)',
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, marginBottom: 32 }} className="sidebar-title">
          Saba Cosmetics
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
            Admin panel
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  background: active ? 'var(--color-blush-pale)' : 'transparent',
                  color: active ? 'var(--color-ink)' : 'var(--color-muted)',
                  fontWeight: active ? 500 : 400,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid var(--color-hairline)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            color: 'var(--color-muted)',
          }}
        >
          Log out
        </button>
      </aside>

      <style>{`
        @media (max-width: 860px) {
          .admin-mobile-bar { display: flex !important; }
          .admin-sidebar {
            position: fixed;
            top: 57px;
            left: 0;
            bottom: 0;
            z-index: 60;
            transform: translateX(${mobileOpen ? '0' : '-100%'});
            transition: transform 0.25s ease;
            width: 240px !important;
          }
          .sidebar-title { display: none; }
        }
      `}</style>
    </>
  );
}
