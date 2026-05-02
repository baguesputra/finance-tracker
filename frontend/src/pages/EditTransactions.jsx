import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  // 🔥 ambil data lama
useEffect(() => {
  const fetchData = async () => {
    const res = await API.get(`/transactions/${id}`);

    const data = res.data;

    setForm({
      ...data,
      date: data.date ? data.date.substring(0, 10) : ''
    });
  };

  fetchData();
}, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/transactions/${id}`, form);
      alert('Berhasil update');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Gagal update');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">Edit Transaksi</h2>

        <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Jumlah"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Kategori"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi"
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditTransaction;