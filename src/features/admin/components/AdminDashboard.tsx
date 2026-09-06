import { useState, type ChangeEvent } from 'react';
import { signOutAdmin } from '@/lib/supabase/auth.service';
import { uploadGalleryImage } from '@/lib/supabase/gallery.service';

export function AdminDashboard() {
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus('');

    try {
      await uploadGalleryImage(file, caption.trim() || undefined);
      setStatus('تم رفع الصورة بنجاح.');
      setCaption('');
      event.target.value = '';
    } catch {
      setStatus('فشل رفع الصورة. تحقق من الاتصال وSupabase.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-dashboard">
      <button type="button" className="admin-dashboard__logout" onClick={() => void signOutAdmin()}>
        تسجيل خروج
      </button>

      <section className="admin-dashboard__panel">
        <h2>رفع صورة للمعرض</h2>
        <label>
          وصف الصورة (اختياري)
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="مثال: صورة من الخطوبة"
          />
        </label>
        <label>
          اختر صورة
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        </label>
        {uploading && <p>جاري الرفع…</p>}
        {status && <p>{status}</p>}
      </section>
    </div>
  );
}
