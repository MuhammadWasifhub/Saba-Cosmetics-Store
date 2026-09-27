'use client';
export const runtime = 'edge';
import { useEffect, useState } from 'react';

type SupportRequest = {
  id: string;
  customer_id: string;
  order_id: string | null;
  type: string;
  reason: string;
  description: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  orders?: { order_number: string } | null;
};

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved'];

export default function AdminReturnsPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/support-requests');
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/support-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 28 }}>Returns & Complaints</h1>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Loading…</p>
      ) : requests.length === 0 ? (
        <div style={{ background: 'var(--color-white)', border: '1px dashed var(--color-hairline)', borderRadius: 12, padding: 60, textAlign: 'center' }}>
          <p style={{ color: 'var(--color-muted)' }}>No requests yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {requests.map((r) => (
            <div key={r.id} style={{ background: 'var(--color-white)', border: '1px solid var(--color-hairline)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                <div>
                  <strong style={{ fontSize: 14.5, textTransform: 'capitalize' }}>{r.type}</strong>
                  <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
                    Customer ID: {r.customer_id} {r.orders?.order_number ? `· Order: ${r.orders.order_number}` : ''}
                  </p>
                </div>
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  style={{ border: '1px solid var(--color-hairline)', borderRadius: 8, padding: '6px 10px', fontSize: 13, height: 'fit-content' }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <p style={{ fontSize: 14, marginBottom: 6 }}><strong>Reason:</strong> {r.reason}</p>
              {r.description && <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 10 }}>{r.description}</p>}
              {r.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image_url} alt="" style={{ maxWidth: 200, borderRadius: 8, border: '1px solid var(--color-hairline)' }} />
              )}
              <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 10 }}>
                {new Date(r.created_at).toLocaleString('en-PK')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}