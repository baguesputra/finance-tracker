import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Chart from '../components/Charts';

function Dashboard() {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [page]);

  const fetchSummary = async () => {
    const res = await API.get('/transactions/summary');
    setSummary(res.data);
  };

  const fetchTransactions = async () => {
    const res = await API.get(`/transactions?page=${page}&limit=5`);
    setTransactions(res.data.data);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi?')) return;
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
    fetchSummary();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Finance Dashboard</h1>
        <button
          onClick={() => navigate('/add-transaction')}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
        >
          + Tambah
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-gray-500">Income</p>
          <h2 className="text-green-600 text-xl font-bold">
            Rp {summary.total_income.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-gray-500">Expense</p>
          <h2 className="text-red-500 text-xl font-bold">
            Rp {summary.total_expense.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <p className="text-gray-500">Balance</p>
          <h2 className="text-blue-600 text-xl font-bold">
            Rp {summary.balance.toLocaleString()}
          </h2>
        </div>
      </div>
      <Chart />

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="mb-4 font-semibold">Transaksi</h3>

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="pb-2">Tanggal</th>
              <th>Tipe</th>
              <th>Jumlah</th>
              <th>Kategori</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((trx) => (
              <tr key={trx.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{trx.date}</td>

                <td>
                  <span className={`px-2 py-1 rounded-lg text-sm ${
                    trx.type === 'income'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {trx.type}
                  </span>
                </td>

                <td className="font-semibold">
                  Rp {parseInt(trx.amount).toLocaleString()}
                </td>

                <td>{trx.category}</td>

                <td>
                  <button
                    onClick={() => handleDelete(trx.id)}
                    className="text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">Page {page}</span>

          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;