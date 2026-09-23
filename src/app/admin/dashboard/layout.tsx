import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect('/admin');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-cream)' }} className="admin-layout">
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px 40px' }} className="admin-main">{children}</main>
      <style>{`
        @media (max-width: 860px) {
          .admin-layout { flex-direction: column; }
          .admin-main { padding: 24px 18px !important; }
        }
      `}</style>
    </div>
  );
}
