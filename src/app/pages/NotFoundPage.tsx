import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>٤٠٤</h1>
      <p>الصفحة غير موجودة</p>
      <Link to="/">العودة للرئيسية</Link>
    </main>
  );
}
