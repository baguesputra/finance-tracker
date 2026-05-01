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
    <div>
      <h2>Tambah Transaksi</h2>

      <form onSubmit={handleSubmit}>
        <select name="type" onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Jumlah"
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Kategori"
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Deskripsi"
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          onChange={handleChange}
        />

        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}

export default AddTransaction;