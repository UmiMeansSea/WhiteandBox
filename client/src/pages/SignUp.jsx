import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c]">
      <header className="bg-white border-b border-[#cfc4c5]">
        <nav className="flex justify-between items-center px-6 max-w-[1200px] mx-auto h-[80px]">
          <Link to="/" className="text-[32px] font-black text-black">EduPro</Link>
          <Link to="/signin" className="text-[14px] font-bold border-b border-black">Have an account?</Link>
        </nav>
      </header>

      <main className="max-w-[460px] mx-auto px-6 pt-16 pb-20">
        <h1 className="text-[40px] font-black tracking-tight mb-3">Create account</h1>
        <p className="text-[#4c4546] mb-8">Set up your instructor profile and publish courses.</p>

        <form onSubmit={onSubmit} className="bg-white border border-[#cfc4c5] p-6 space-y-5">
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-widest mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full border border-[#cfc4c5] px-3 py-2.5 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full border border-[#cfc4c5] px-3 py-2.5 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
              className="w-full border border-[#cfc4c5] px-3 py-2.5 focus:outline-none focus:border-black"
            />
          </div>
          {error ? <p className="text-[#ba1a1a] text-[14px]">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-black text-white text-[13px] font-bold uppercase tracking-widest disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </main>
    </div>
  );
}

