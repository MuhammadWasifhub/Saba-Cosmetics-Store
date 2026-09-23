'use client';
export const runtime = 'edge';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import ProductFormModal from '@/components/admin/ProductFormModal';

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  async function loadProducts() {
    setLoading(true);
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      alert('Could not delete product.');
    }
  }

  async function handleToggleActive(product: Product) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !product.is_active }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      );
    }
  }

  function openNewProductModal() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  function handleSaved(saved: Product) {
    setModalOpen(false);
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    } else {
      setProducts((prev) => [saved, ...prev]);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }} className="products-header">
        <h1 style={{ fontSize: 26 }}>Products</h1>
        <button onClick={openNewProductModal} style={primaryButtonStyle}>
          + Add product
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Loading…</p>
      ) : products.length === 0 ? (
        <div style={{ background: 'var(--color-white)', border: '1px dashed var(--color-hairline)', borderRadius: 12, padding: 60, textAlign: 'center' }}>
          <p style={{ color: 'var(--color-muted)', marginBottom: 16 }}>No products yet.</p>
          <button onClick={openNewProductModal} style={primaryButtonStyle}>
            Add your first product
          </button>
        </div>
      ) : (
        <div style={{ background: 'var(--color-white)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-hairline)' }}>
          <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-hairline)', textAlign: 'left' }}>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 6,
                          background: 'var(--color-blush-pale)',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        {product.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <span style={{ fontWeight: 500 }}>{product.name}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{product.category}</td>
                  <td style={tdStyle}>{formatPKR(product.price)}</td>
                  <td style={tdStyle}>{product.stock}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleToggleActive(product)}
                      style={{
                        fontSize: 12,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border: 'none',
                        background: product.is_active ? '#dff0e0' : '#f0e0e0',
                        color: product.is_active ? '#2d6a34' : '#8a3a3a',
                      }}
                    >
                      {product.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEditModal(product)} style={smallButtonStyle}>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        style={{ ...smallButtonStyle, color: '#b3413a', borderColor: '#e5c5c0' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  background: 'var(--color-ink)',
  color: 'var(--color-white)',
  border: 'none',
  borderRadius: 999,
  padding: '10px 20px',
  fontSize: 14,
};

const thStyle: React.CSSProperties = { padding: '12px 20px', fontSize: 12, color: 'var(--color-muted)', fontWeight: 500 };
const tdStyle: React.CSSProperties = { padding: '12px 20px' };
const smallButtonStyle: React.CSSProperties = {
  fontSize: 12.5,
  padding: '6px 12px',
  borderRadius: 8,
  border: '1px solid var(--color-hairline)',
  background: 'var(--color-white)',
};
