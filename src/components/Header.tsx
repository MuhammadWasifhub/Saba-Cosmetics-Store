'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { getCategories, FALLBACK_CATEGORIES, Category } from '@/lib/categories';

// categories loaded from DB

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/all-products', label: 'All Products' },
  { href: '/about', label: 'Our Story' },
  { href: '/returns', label: 'Report' },
  { href: '/policies', label: 'Policy' },
];

export default function Header() {
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [scrolled, setScrolled] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    getCategories().then((rows) => {
      if (rows.length > 0) setCategories(rows);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (totalItems === 0) return;
    setCartPulse(true);
    const t = setTimeout(() => setCartPulse(false), 600);
    return () => clearTimeout(t);
  }, [totalItems]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: scrolled ? 'rgba(255,255,255,0.86)' : 'var(--color-white)',
        backdropFilter: scrolled ? 'saturate(140%) blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(140%) blur(14px)' : 'none',
        borderBottom: '1px solid var(--color-hairline)',
        transition: 'background 320ms var(--ease-out), box-shadow 320ms var(--ease-out)',
        boxShadow: scrolled ? '0 4px 20px rgba(36,28,24,0.05)' : 'none',
      }}
    >
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Saba Cosmetics home">
          Saba Cosmetics
        </Link>

        <nav className="header-nav" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link ${isActive(l.href) ? 'is-active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            onClick={openCart}
            aria-label="Open bag"
            className={`bag-btn ${cartPulse ? 'pulse' : ''}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="bag-label">Bag</span>
            <span className="bag-count">{totalItems}</span>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Category strip */}
      <div className="category-strip">
        <div className="container category-strip-inner hide-scrollbar">
          {categories.map((c) => {
            const href =
              c.slug === 'New In'
                ? '/all-products?sort=new'
                : c.slug.toLowerCase() === 'sale'
                ? '/all-products?sale=1'
                : `/all-products?category=${encodeURIComponent(c.slug)}`;
            return (
              <Link key={c.id} href={href} className="category-link">
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile panel */}
      <div className={`mobile-panel ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-panel-inner">
          <nav aria-label="Mobile primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`mobile-link ${isActive(l.href) ? 'is-active' : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-divider" />

          <p className="mobile-section-label">Shop by category</p>
          <div className="mobile-cats">
            {categories.map((c) => {
              const href =
                c.slug === 'New In'
                  ? '/all-products?sort=new'
                  : c.slug.toLowerCase() === 'sale'
                  ? '/all-products?sale=1'
                  : `/all-products?category=${encodeURIComponent(c.slug)}`;
              return (
                <Link key={c.id} href={href} className="pill">
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {mobileOpen && <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />}

            <style dangerouslySetInnerHTML={{ __html: `
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 76px;
          gap: 24px;
        }

        .brand {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.015em;
          flex-shrink: 0;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 30px;
          font-size: 14px;
          margin-left: auto;
        }

        .nav-link {
          color: var(--color-muted);
          position: relative;
          padding: 6px 0;
          font-weight: 400;
        }

        .nav-link:hover {
          color: var(--color-ink);
        }

        .nav-link.is-active {
          color: var(--color-ink);
          font-weight: 600;
        }

        .nav-link.is-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--color-blush-deep);
          border-radius: 2px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: 24px;
          flex-shrink: 0;
        }

        .bag-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--color-ink);
          color: var(--color-white);
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 500;
          transition: transform 220ms var(--ease-out), background 220ms var(--ease-out);
        }

        .bag-btn:hover {
          background: var(--color-plum);
        }

        .bag-btn.pulse {
          animation: bagPulse 600ms var(--ease-out);
        }

        @keyframes bagPulse {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.08); }
          70%  { transform: scale(0.98); }
          100% { transform: scale(1); }
        }

        .bag-count {
          background: var(--color-blush);
          color: var(--color-ink);
          border-radius: 999px;
          min-width: 20px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          padding: 0 5px;
        }

        .mobile-menu-btn {
          display: none;
          padding: 6px;
        }

        .category-strip {
          border-top: 1px solid var(--color-hairline);
          background: inherit;
        }

        .category-strip-inner {
          display: flex;
          align-items: center;
          gap: 26px;
          padding-top: 11px;
          padding-bottom: 11px;
          overflow-x: auto;
          white-space: nowrap;
          font-size: 13.5px;
          -webkit-overflow-scrolling: touch;
        }

        .category-link {
          color: var(--color-muted);
          font-weight: 500;
          letter-spacing: 0.005em;
          position: relative;
          padding: 2px 0;
          flex-shrink: 0;
          transition: color 200ms var(--ease-out);
        }

        .category-link:hover {
          color: var(--color-ink);
        }

        .category-link:hover::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 1.5px;
          background: var(--color-blush-deep);
          border-radius: 2px;
        }

        .mobile-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100dvh;
          width: min(340px, 88vw);
          background: var(--color-white);
          transform: translateX(105%);
          transition: transform 340ms var(--ease-out);
          z-index: 60;
          overflow-y: auto;
          box-shadow: -12px 0 40px rgba(36,28,24,0.14);
          padding: 96px 24px 32px;
          display: none;
        }

        .mobile-panel.open {
          transform: translateX(0);
        }

        .mobile-panel-inner {
          display: flex;
          flex-direction: column;
        }

        .mobile-link {
          display: block;
          padding: 14px 0;
          font-size: 16px;
          color: var(--color-muted);
          border-bottom: 1px solid var(--color-hairline);
        }

        .mobile-link.is-active {
          color: var(--color-ink);
          font-weight: 600;
        }

        .mobile-divider {
          height: 20px;
        }

        .mobile-section-label {
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-muted);
          margin-bottom: 14px;
        }

        .mobile-cats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(36,28,24,0.35);
          backdrop-filter: blur(2px);
          z-index: 55;
          animation: fadeIn 240ms var(--ease-out);
        }

        @media (max-width: 900px) {
          .header-nav { display: none; }
          .mobile-menu-btn { display: inline-flex; }
          .mobile-panel { display: block; }
          .bag-label { display: none; }
          .bag-btn { padding: 10px 14px; }
          .header-actions { margin-left: auto; }
          .category-strip-inner { gap: 20px; font-size: 13px; }
        }

        @media (max-width: 420px) {
          .brand { font-size: 19px; }
          .header-inner { height: 68px; }
        }
      ` }} />
    </header>
  );
}