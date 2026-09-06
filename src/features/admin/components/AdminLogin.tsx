import { useState, type FormEvent } from 'react';
import { signInAdmin } from '@/lib/supabase/auth.service';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInAdmin(email, password);
    } catch {
      setError('بيانات الدخول غير صحيحة.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-login" onSubmit={handleSubmit}>
      <label>
        البريد
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        كلمة المرور
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'جاري الدخول…' : 'دخول'}
      </button>
      {error && <p className="admin-login__error">{error}</p>}
    </form>
  );
}
