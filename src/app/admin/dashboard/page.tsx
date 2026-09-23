import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'edge';
export const revalidate = 0;

async function getStats() {
  const supabase = createAdminClient();

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('order_status', 'pending');

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: allOrders } = await supabase.from('orders').select('total');
  const totalRevenue = (allOrders || []).reduce((sum, o) => sum + Number(o.total), 0);

  return { productCount: productCount || 0, pendingOrders: pendingOrders || 0, recentOrders: recentOrders || [], totalRevenue };
}

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export default async function AdminOverviewPage() {
  const { productCount, pendingOrders, recentOrders, totalRevenue } = await getStats();

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 28 }}>Overview</h1>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
        <StatCard label="Total products" value={productCount.toString()} />
        <StatCard label="Pending orders" value={pendingOrders.toString()} />
        <StatCard label="Total revenue" value={formatPKR(totalRevenue)} />
      </div>
      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <h2 style={{ fontSize: 18, marginBottom: 16 }}>Recent orders</h2>
      <div style={{ background: 'var(--color-white)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-hairline)' }}>
        {recentOrders.length === 0 ? (
          <p style={{ padding: 24, color: 'var(--color-muted)', fontSize: 14 }}>No orders yet.</p>
        ) : (
          recentOrders.map((order: any, i: number) => (
            <div
              key={order.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: i < recentOrders.length - 1 ? '1px solid var(--color-hairline)' : 'none',
                fontSize: 14,
              }}
            >
              <div>
                <strong>{order.order_number}</strong>
                <span style={{ color: 'var(--color-muted)', marginLeft: 10 }}>{order.customer_name}</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <span>{formatPKR(Number(order.total))}</span>
                <span style={{ color: 'var(--color-muted)', textTransform: 'capitalize' }}>{order.order_status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-hairline)', borderRadius: 12, padding: 20 }}>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 600 }}>{value}</p>
    </div>
  );
}
