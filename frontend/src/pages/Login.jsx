import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert('Email dan password wajib diisi');
    }

    try {
      setLoading(true);

      const res = await API.post('/auth/login', form);

      localStorage.setItem('token', res.data.token);

      navigate('/dashboard');
    } catch (err) {
      alert('Login gagal, cek email/password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE (Branding) */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Finance Tracker</h1>
          <p className="text-blue-100">Kelola keuanganmu dengan mudah</p>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6">

        <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <p className="text-gray-500 text-sm mb-6">
            Masuk ke akun kamu
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="contoh@mail.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;