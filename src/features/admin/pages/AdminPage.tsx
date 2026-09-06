import { AdminLogin } from '@/features/admin/components/AdminLogin';
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { useAdminSession } from '@/features/admin/hooks/useAdminSession';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const { session, loading } = useAdminSession();

  if (loading) {
    return (
      <main className="admin-page">
        <p>جاري التحقق…</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <Link to="/">← الرئيسية</Link>
        <h1>لوحة العريس</h1>
        <p>رفع الصور وإدارة محتوى الصفحة</p>
      </header>

      {session ? <AdminDashboard /> : <AdminLogin />}
    </main>
  );
}
