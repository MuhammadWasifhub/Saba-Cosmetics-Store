'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/lib/types';

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#f5efe0', text: '#8a6d1f' },
  confirmed: { bg: '#e0eef0', text: '#1f6b7a' },
  shipped: { bg: '#e5e0f0', text: '#4d3a8a' },
  delivered: { bg: '#dff0e0', text: '#2d6a34' },
  cancelled: { bg: '#f0e0e0', text: '#8a3a3a' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  async function updateStatus(orderId: string, order_status: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, order_status: order_status as any } : o)));
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 28 }}>Orders</h1>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Loading…</p>
      ) : orders.length === 0 ? (
        <div style={{ background: 'var(--color-white)', border: '1px dashed var(--color-hairline)', borderRadius: 12, padding: 60, textAlign: 'center' }}>
          <p style={{ color: 'var(--color-muted)' }}>No orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order) => {
            const expanded = expandedId === order.id;
            const statusStyle = STATUS_COLORS[order.order_status] || STATUS_COLORS.pending;
            return (
              <div
                key={order.id}
                style={{ background: 'var(--color-white)', border: '1px solid var(--color-hairline)', borderRadius: 12, overflow: 'hidden' }}
              >
                <div
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                  className="order-row-header"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <strong style={{ fontSize: 14.5 }}>{order.order_number}</strong>
                      <span
                        style={{
                          fontSize: 11.5,
                          padding: '3px 10px',
                          borderRadius: 999,
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          textTransform: 'capitalize',
                        }}
                      >
                        {order.order_status}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
                      {order.customer_name} · {order.customer_phone} · {new Date(order.created_at).toLocaleDateString('en-PK')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <strong style={{ fontSize: 15 }}>{formatPKR(Number(order.total))}</strong>
                    <span style={{ color: 'var(--color-muted)' }}>{expanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--color-hairline)' }}>
                    <div className="order-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 20 }}>
                      <div>
                        <h4 style={{ fontSize: 12.5, color: 'var(--color-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                          Delivery details
                        </h4>
                        <p style={{ fontSize: 14, marginBottom: 4 }}>{order.customer_name}</p>
                        <p style={{ fontSize: 14, marginBottom: 4 }}>
                          {order.customer_phone}
                          {order.customer_phone_alt ? ` / ${order.customer_phone_alt}` : ''}
                        </p>
                        <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>{order.shipping_address}</p>
                      </div>

                      <div>
                        <h4 style={{ fontSize: 12.5, color: 'var(--color-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                          Items
                        </h4>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                            <span>{item.name} × {item.quantity}</span>
                            <span>{formatPKR(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <label style={{ fontSize: 13, color: 'var(--color-muted)' }}>Update status:</label>
                      <select
                        value={order.order_status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={{
                          border: '1px solid var(--color-hairline)',
                          borderRadius: 8,
                          padding: '6px 10px',
                          fontSize: 13,
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <style>{`
        @media (max-width: 640px) {
          .order-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
