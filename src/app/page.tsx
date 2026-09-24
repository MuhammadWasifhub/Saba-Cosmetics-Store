import { createClient } from '@/lib/supabase-browser';
import ProductCard from '@/components/ProductCard';
import HeroBannerSlider from '@/components/HeroBannerSlider';
import Link from 'next/link';
import { Product, Banner } from '@/lib/types';
import WhatsAppCTA from '@/components/WhatsAppCTA';

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

  if (error || !data) {
    return [];
  }
  return data.map((b: any) => ({
    ...b,
    product_slug: b.products?.slug || null,
  }));
}

export default async function HomePage() {
  const [products, banners] = await Promise.all([getProducts(), getBanners()]);

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--color-cream)' }} className="hero-section">
        <div className="container hero-container">
          <div className="hero-grid">
            <div>
              <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 16 }}>
                Discover Branded & Imported Beauty
              </p>
              <h1 className="hero-title">
                Everything beauty,
                <br />
                in one place.
              </h1>
              <p
                style={{
                  fontSize: 17,
                  color: 'var(--color-muted)',
                  maxWidth: 440,
                  marginBottom: 32,
                }}
                className="hero-subtitle"
              >
                A carefully selected collection of branded beauty essentials, chosen by Saba for quality,
                style, and everyday confidence.
              </p>
              <Link
                href="/all-products"
                style={{
                  display: 'inline-block',
                  background: 'var(--color-ink)',
                  color: 'var(--color-white)',
                  padding: '16px 32px',
                  borderRadius: 999,
                  fontSize: 15,
                }}
              >
                Shop the range
              </Link>
            </div>

            <div className="hero-banner-wrap">
              <HeroBannerSlider banners={banners} />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section style={{ borderBottom: '1px solid var(--color-hairline)' }}>
        <div className="container" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div className="benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { label: 'Branded & Imported', detail: 'Discover authentic beauty products from trusted international brands.' },
              { label: 'Carefully Curated', detail: 'A thoughtfully selected collection of makeup, skincare, nails, and beauty essentials.' },
              { label: 'Beauty, All in One Place', detail: 'Find your everyday favourites and new beauty essentials, all under one roof.' },
            ].map((b) => (
              <div key={b.label}>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{b.label}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>{b.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid - top picks only */}
      <section id="products">
        <div className="container" style={{ paddingTop: 64, paddingBottom: 80 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 40,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <h2 style={{ fontSize: 32, marginBottom: 8 }}>Our best selling products</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: 15 }}>
                All things beauty, made for you.
              </p>
            </div>
            <Link href="/all-products" style={{ fontSize: 14, color: 'var(--color-ink)', textDecoration: 'underline' }}>
              View all products →
            </Link>
          </div>

          {products.length === 0 ? (
            <div
              style={{
                padding: '60px 0',
                textAlign: 'center',
                color: 'var(--color-muted)',
                border: '1px dashed var(--color-hairline)',
                borderRadius: 12,
              }}
            >
              <p>No products yet.</p>
              <p style={{ fontSize: 14, marginTop: 6 }}>
                Add your first product.
              </p>
            </div>
          ) : (
            <div className="product-scroll-row">
              {products.map((p) => (
                <div key={p.id} className="product-scroll-item">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Story strip */}
      <section style={{ background: 'var(--color-blush)' }}>
        <div className="container" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ maxWidth: 640 }}>
            <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 16 }}>Our story</p>

            <h2 style={{ fontSize: 30, marginBottom: 16 }}>
              Built on experience, trust, and a love for beauty.
            </h2>

            <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.7, marginBottom: 24 }}>
              With over <strong>13 years in the beauty industry</strong>, Saba has built
              lasting relationships with salons and beauty professionals by making
              quality, branded products easier to access.
            </p>

            <a
              href="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              Read our story <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
      <WhatsAppCTA />

      <style>{`
        .hero-section { min-height: calc(100vh - 76px); display: flex; align-items: center; }
        .hero-container { padding-top: 48px; padding-bottom: 48px; width: 100%; }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; }
        .hero-title { font-size: clamp(36px, 5.5vw, 64px); margin-bottom: 24px; }
        .hero-banner-wrap { max-height: 64vh; width: 100%; max-width: 390px; margin-left: auto; }

        .product-scroll-row {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 12px;
          scroll-snap-type: x proximity;
        }
        .product-scroll-item {
          flex: 0 0 260px;
          scroll-snap-align: start;
        }
        @media (max-width: 560px) {
          .product-scroll-item { flex: 0 0 180px; }
        }
        
        @media (max-width: 900px) {
          .hero-section { min-height: auto; padding-top: 8px; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-banner-wrap { max-height: 48vh; order: -1; margin-left: 0; }
          .hero-banner-wrap div { max-height: 48vh; aspect-ratio: 16/10 !important; }
          .benefits-grid { grid-template-columns: 1fr !important; }
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .hero-title { font-size: 34px !important; }
          .hero-subtitle { font-size: 15px !important; }
          .product-grid { grid-template-columns: 1fr 1fr !important; gap: 24px 16px !important; }
        }
      `}</style>
    </main>
  );
}
