import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function AddTransaction() {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.category || !form.date) {
      return alert('Semua field wajib diisi');
    }

    try {
      await API.post('/transactions', form);
      alert('Transaksi berhasil ditambahkan');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Gagal tambah transaksi');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Tambah Transaksi</h2>
          <p className="text-gray-500 text-sm">Catat pemasukan atau pengeluaran kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TYPE */}
          <div>
            <label className="block text-sm mb-1">Tipe</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block text-sm mb-1">Jumlah</label>
            <input
              type="number"
              name="amount"
              placeholder="Contoh: 50000"
              value={form.amount}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm mb-1">Kategori</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Pilih</option>
              <option value="Makan">Makan</option>
              <option value="Transport">Transport</option>
              <option value="Belanja">Belanja</option>
              <option value="Gaji">Gaji</option>
              <option value="Bonus">Bonus</option>
              <option value="Tagihan">Tagihan</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm mb-1">Deskripsi</label>
            <input
              type="text"
              name="description"
              placeholder="Opsional"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm mb-1">Tanggal</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddTransaction;