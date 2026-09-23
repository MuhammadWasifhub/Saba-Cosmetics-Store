import { createClient } from '@/lib/supabase-browser';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

export const runtime = 'edge';
export const revalidate = 0;

async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data as Product[];
}

export default async function AllProductsPage() {
  const products = await getProducts();

  return (
    <main className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>All Products</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 15 }}>
          Explore our curated beauty essentials.
        </p>
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
        </div>
      ) : (
        <div className="all-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px 28px' }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .all-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .all-products-grid { grid-template-columns: 1fr 1fr !important; gap: 24px 16px !important; }
        }
      `}</style>
    </main>
  );
}
