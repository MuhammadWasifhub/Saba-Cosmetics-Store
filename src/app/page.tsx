import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import ProductCard from '@/components/ProductCard';
import HeroBannerSlider from '@/components/HeroBannerSlider';
import { Product, Banner } from '@/lib/types';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import Reveal from '@/components/Reveal';
import { getCategories, FALLBACK_CATEGORIES, Category } from '@/lib/categories';

export const runtime = 'edge';
export const revalidate = 0;

async function getProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data: featuredData } = await supabase
    .from('featured_products')
    .select('sort_order, products(*)')
    .order('sort_order', { ascending: true });

  if (featuredData && featuredData.length > 0) {
    return featuredData
      .map((f: any) => f.products)
      .filter((p: any) => p && p.is_active) as Product[];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error(error);
    return [];
  }
  return data as Product[];
}

async function getBanners(): Promise<(Banner & { product_slug?: string | null })[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('banners')
    .select('*, products(slug)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  return data.map((b: any) => ({
    ...b,
    product_slug: b.products?.slug || null,
  }));
}

// category cards loaded from DB

export default async function HomePage() {
  const [products, banners, categories] = await Promise.all([
    getProducts(),
    getBanners(),
    getCategories(),
  ]);

  const categoryCards =
    categories.length > 0
      ? categories.filter((c) => c.slug !== 'Sale').slice(0, 6)
      : FALLBACK_CATEGORIES;

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-orb orb orb-1" />
        <div className="hero-orb orb orb-2" />
        <div className="hero-orb orb orb-3" />

        <div className="container hero-container">
          <div className="hero-grid">
            <div className="hero-copy">
              <Reveal>
                <p className="hero-eyebrow">Branded &amp; Imported Beauty</p>
              </Reveal>

              <Reveal delay={1}>
                <h1 className="hero-title">
                  Everything beauty,
                  <br />
                  in one place.
                </h1>
              </Reveal>

              <Reveal delay={2}>
                <p className="hero-sub">
                  A carefully curated collection of branded beauty essentials, chosen by Saba
                  for quality, style, and everyday confidence.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="hero-ctas">
                  <Link href="/all-products" className="btn btn-primary btn-lg">
                    Shop the range
                  </Link>
                  <Link href="#categories" className="btn btn-outline btn-lg">
                    Explore categories
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={4}>
                <div className="hero-stats">
                  <div>
                    <span className="hero-stat-num">13+</span>
                    <span className="hero-stat-label">Years in beauty</span>
                  </div>
                  <div className="hero-stat-sep" aria-hidden="true" />
                  <div>
                    <span className="hero-stat-num">100%</span>
                    <span className="hero-stat-label">Authentic products</span>
                  </div>
                  <div className="hero-stat-sep" aria-hidden="true" />
                  <div>
                    <span className="hero-stat-num">2–3</span>
                    <span className="hero-stat-label">Days delivery</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="hero-banner-wrap">
              <HeroBannerSlider banners={banners} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE STRIP ============ */}
      <section className="marquee-strip">
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="marquee-row" aria-hidden={dup === 1}>
                {[
                  'Branded & Imported',
                  'Authentic Guarantee',
                  'Cash on Easypaisa',
                  'Fast Delivery',
                  'Salon Trusted',
                  'Curated by Saba',
                ].map((t) => (
                  <span key={t + dup} className="marquee-item">
                    {t}
                    <span className="marquee-dot" aria-hidden="true" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section id="categories" className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="section-label">Shop by category</span>
              <h2 className="section-title">Find your favourites.</h2>
              <p className="section-sub">
                Your favourite beauty essentials, thoughtfully curated for you.
              </p>
            </div>
          </Reveal>

          <div className="cat-grid">
            {categoryCards.map((c, i) => {
              const href =
                c.slug === 'New In'
                  ? '/all-products?sort=new'
                  : `/all-products?category=${encodeURIComponent(c.slug)}`;
              return (
                <Reveal key={c.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <Link href={href} className="cat-card">
                    <div className="cat-icon" aria-hidden="true">
                      {c.icon_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.icon_url} alt="" />
                      ) : (
                        <span className="cat-icon-fallback">{c.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="cat-body">
                      <p className="cat-name">{c.name}</p>
                      <p className="cat-tag">{c.tag}</p>
                    </div>
                    <span className="cat-arrow" aria-hidden="true">→</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ BEST SELLERS ============ */}
      <section className="section surface-cream">
        <div className="container">
          <Reveal>
            <div className="section-head section-head-row">
              <div>
                <span className="section-label">Best sellers</span>
                <h2 className="section-title">Our best selling products.</h2>
                <p className="section-sub">All things beauty, made for you.</p>
              </div>
              <Link href="/all-products" className="link-arrow">
                View all products →
              </Link>
            </div>
          </Reveal>

          {products.length === 0 ? (
            <Reveal>
              <div className="empty-state">
                <p>No products yet.</p>
                <p style={{ fontSize: 14, marginTop: 6, color: 'var(--color-muted)' }}>
                  Add your first product.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="product-scroll-row hide-scrollbar">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div className="product-scroll-item">
                    <ProductCard product={p} />
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className="story">
        <div className="container story-inner">
          <Reveal>
            <div className="story-copy">
              <span className="section-label" style={{ color: 'rgba(36,28,24,0.55)' }}>
                Our story
              </span>
              <h2 className="story-title">
                Built on experience, trust, and a love for beauty.
              </h2>
              <p className="story-text">
                With over <strong>13 years in the beauty industry</strong>, Saba has built lasting
                relationships with salons and beauty professionals by making quality, branded
                products easier to access.
              </p>
              <Link href="/about" className="story-cta">
                Read our story <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <WhatsAppCTA />

      <style dangerouslySetInnerHTML={{ __html: `
        /* ---------- HERO ---------- */
        .hero {
          position: relative;
          background: var(--grad-hero);
          overflow: hidden;
          padding: 48px 0 56px;
        }

        .hero-container { position: relative; z-index: 2; }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 56px;
          align-items: center;
          min-height: 520px;
        }

        .hero-copy { max-width: 560px; }

        .hero-eyebrow {
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-blush-deep);
          margin-bottom: 18px;
          font-weight: 600;
        }

        .hero-title {
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.05;
          margin-bottom: 16px;
          font-weight: 400;
          letter-spacing: -0.02em;
        }

        .hero-sub {
          font-size: 16.5px;
          color: var(--color-muted);
          line-height: 1.7;
          max-width: 480px;
          margin-bottom: 24px;
        }

        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 28px;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .hero-stat-num {
          display: block;
          font-family: var(--font-display);
          font-size: 26px;
          color: var(--color-ink);
          line-height: 1;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }

        .hero-stat-label {
          font-size: 12.5px;
          color: var(--color-muted);
          letter-spacing: 0.02em;
        }

        .hero-stat-sep {
          width: 1px;
          height: 32px;
          background: var(--color-hairline);
        }

        .hero-banner-wrap {
          max-width: 460px;
          width: 100%;
          margin-left: auto;
          align-self: stretch;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        /* ---------- MARQUEE ---------- */
        .marquee-strip {
          background: var(--color-ink);
          color: var(--color-white);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .marquee-track {
          display: flex;
          animation: marquee 40s linear infinite;
          padding: 14px 0;
        }

        .marquee-row {
          display: inline-flex;
          gap: 48px;
          padding-right: 48px;
          flex-shrink: 0;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 48px;
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.9;
          white-space: nowrap;
        }

        .marquee-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-blush);
          opacity: 0.8;
        }

        .marquee-wrap:hover .marquee-track {
          animation-play-state: paused;
        }

        /* ---------- SECTION HEAD ---------- */
        .section-head {
          margin-bottom: 44px;
        }

        .section-head-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
        }

        .link-arrow {
          font-size: 14px;
          color: var(--color-ink);
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 200ms var(--ease-out);
        }

        .link-arrow:hover { color: var(--color-blush-deep); }

        /* ---------- CATEGORY GRID ---------- */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .cat-card {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 24px;
          background: var(--color-white);
          border: 1px solid var(--color-hairline);
          border-radius: var(--radius-lg);
          transition: all 320ms var(--ease-out);
          position: relative;
          overflow: hidden;
        }

        .cat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--grad-hero);
          opacity: 0;
          transition: opacity 320ms var(--ease-out);
          z-index: 0;
        }

        .cat-card:hover {
          border-color: var(--color-blush);
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .cat-card:hover::before { opacity: 0.6; }

        .cat-card > * { position: relative; z-index: 1; }

        .cat-icon {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--color-blush-pale);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          transition: transform 320ms var(--ease-out);
        }

        .cat-icon img {
          width: 60%;
          height: 60%;
          object-fit: contain;
          display: block;
        }

        .cat-icon-fallback {
          font-family: var(--font-display);
          font-size: 22px;
          color: var(--color-blush-deep);
        }

        .cat-card:hover .cat-icon {
          transform: scale(1.08) rotate(-4deg);
        }

        .cat-body { flex: 1; min-width: 0; }

        .cat-name {
          font-family: var(--font-display);
          font-size: 18px;
          margin-bottom: 3px;
          letter-spacing: -0.01em;
        }

        .cat-tag {
          font-size: 12.5px;
          color: var(--color-muted);
          letter-spacing: 0.02em;
        }

        .cat-arrow {
          font-size: 18px;
          color: var(--color-muted);
          transition: transform 320ms var(--ease-out), color 320ms var(--ease-out);
        }

        .cat-card:hover .cat-arrow {
          transform: translateX(4px);
          color: var(--color-ink);
        }

        /* ---------- PRODUCT SCROLL ---------- */
        .product-scroll-row {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 12px;
        }

        .product-scroll-item {
          flex: 0 0 260px;
          scroll-snap-align: start;
        }

        /* ---------- STORY ---------- */
        .story {
          background: var(--color-blush);
          color: var(--color-ink);
          padding: 96px 0;
          position: relative;
          overflow: hidden;
        }

        .story::after {
          content: '';
          position: absolute;
          right: -100px;
          top: -100px;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
          pointer-events: none;
        }

        .story-inner { position: relative; z-index: 1; }

        .story-copy { max-width: 640px; }

        .story-title {
          font-size: clamp(28px, 3.6vw, 42px);
          margin-bottom: 20px;
          line-height: 1.15;
        }

        .story-text {
          font-size: 16.5px;
          line-height: 1.75;
          opacity: 0.88;
          margin-bottom: 26px;
        }

        .story-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          border-bottom: 1.5px solid var(--color-ink);
          padding-bottom: 3px;
          transition: gap 240ms var(--ease-out);
        }

        .story-cta:hover { gap: 14px; }

        /* ---------- EMPTY STATE ---------- */
        .empty-state {
          padding: 60px 0;
          text-align: center;
          color: var(--color-muted);
          border: 1px dashed var(--color-hairline);
          border-radius: var(--radius);
          background: var(--color-white);
        }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 900px) {
          .hero { padding: 24px 0 40px; }

          .hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-banner-wrap {
            order: -1;
            max-width: 100%;
            margin-left: 0;
          }

          .hero-copy { max-width: 100%; }

          .cat-grid { grid-template-columns: repeat(2, 1fr); }

          .product-scroll-item { flex: 0 0 220px; }
        }

        @media (max-width: 560px) {
          .hero-title { font-size: 36px; }
          .hero-sub { font-size: 15px; }
          .hero-stats { gap: 16px; }
          .hero-stat-num { font-size: 22px; }

          .cat-grid { grid-template-columns: 1fr; gap: 14px; }

          .cat-card { padding: 18px; }

          .product-scroll-item { flex: 0 0 180px; }

          .marquee-row { gap: 32px; padding-right: 32px; }
          .marquee-item { gap: 32px; font-size: 12px; }

          .story { padding: 56px 0; }
        }
      ` }} />
    </main>
  );
}