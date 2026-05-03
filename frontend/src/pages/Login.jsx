import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Email dan password wajib diisi');
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError('Format email tidak valid');

    try {
      setLoading(true);
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch {
      setError('Email atau password salah, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
      title: 'Dashboard lengkap', desc: 'Grafik dan ringkasan keuangan',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
      title: 'Catat transaksi', desc: 'Income & expense terorganisir',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
      title: 'Export laporan', desc: 'Download Excel & PDF kapan saja',
    },
  ];

  return (
    <div className="min-h-screen flex">

      {/* LEFT — Branding */}
      <div className="hidden md:flex w-[44%] bg-slate-900 flex-col justify-between p-8">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white text-sm font-medium">Finance Tracker</p>
          </div>

          <p className="text-white text-xl font-medium leading-snug mb-2">
            Kelola keuanganmu<br />dengan mudah
          </p>
          <p className="text-white/40 text-xs leading-relaxed mb-8">
            Pantau pemasukan, pengeluaran,<br />dan saldo secara real-time.
          </p>

          <div className="space-y-5">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <div>
                  <p className="text-white/85 text-xs font-medium mb-0.5">{title}</p>
                  <p className="text-white/40 text-[11px]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/20 text-[10px]">© 2026 Finance Tracker</p>
      </div>

      {/* RIGHT — Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-7">

          <p className="text-base font-medium text-slate-800 mb-1">Selamat datang</p>
          <p className="text-xs text-slate-400 mb-5">Masuk ke akun Finance Tracker kamu</p>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4 text-xs">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1.5 tracking-wide">Email</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input
                  type="email" name="email" placeholder="contoh@mail.com"
                  value={form.email} onChange={handleChange} autoComplete="email"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 text-slate-700 placeholder-slate-300 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-slate-500 tracking-wide">Password</label>
                <button type="button" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" placeholder="Masukkan password"
                  value={form.password} onChange={handleChange} autoComplete="current-password"
                  className="w-full pl-9 pr-9 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 text-slate-700 placeholder-slate-300 transition-all"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox" id="remember" checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-slate-800 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-500 cursor-pointer select-none">
                Ingat saya
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 rounded-lg text-xs font-medium hover:bg-slate-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Masuk...
                </>
              ) : (
                <>
                  Masuk
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-5">
            Belum punya akun?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-slate-700 font-medium hover:text-slate-900 transition-colors"
            >
              Daftar sekarang
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;