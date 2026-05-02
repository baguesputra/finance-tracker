import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Chart from '../components/Charts';
import EditModal from "../components/EditModal";
import { exportToExcel } from "../utils/exportExcel";
import { exportToPDF } from "../utils/exportPDF";

function Dashboard() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0
  });

  const [filters, setFilters] = useState({
    type: '',
    search: '',
    startDate: '',
    endDate: ''
  });

  const handleFilterChange = (e) => {
    setFilters({
        ...filters,
        [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
        type: '',
        search: '',
        startDate: '',
        endDate: ''
    });
    setPage(1);
  };

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);

  const applyFilter = () => {
  setPage(1);
  fetchData();
};
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
  try {
    const query = new URLSearchParams({
      page,
      limit: 5,
      ...filters
    }).toString();

    console.log("FETCH QUERY:", query);

    const [trxRes, sumRes] = await Promise.all([
      API.get(`/transactions?${query}`),
      API.get(`/transactions/summary?${query}`)
    ]);

    setTransactions(trxRes.data.data);
    setSummary(sumRes.data);

  } catch (err) {
    console.error(err);
  }
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

      {/* SUMMARY CHARTS */}
      <div className="grid grid-cols-1 mb-6">
        
        <Chart />

      </div>

      <div className="bg-white p-4 rounded-2xl shadow mb-4">

  <h3 className="font-semibold mb-3">Filter</h3>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

    {/* SEARCH */}
    <input
      type="text"
      name="search"
      placeholder="Cari..."
      value={filters.search}
      onChange={handleFilterChange}
      className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
    />

    {/* TYPE */}
    <select
      name="type"
      value={filters.type}
      onChange={handleFilterChange}
      className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Semua Tipe</option>
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>

    {/* START DATE */}
    <input
      type="date"
      name="startDate"
      value={filters.startDate}
      onChange={handleFilterChange}
      className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
    />

    {/* END DATE */}
    <input
      type="date"
      name="endDate"
      value={filters.endDate}
      onChange={handleFilterChange}
      className="border p-2 rounded-xl focus:ring-2 focus:ring-blue-500"
    />

  </div>

  {/* BUTTON */}
  <div className="flex justify-end gap-2 mt-3">
    <button
      onClick={resetFilters}
      className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300"
    >
      Reset
    </button>

    <button
      onClick={applyFilter}
      className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
    >
      Apply
    </button>
  </div>

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
      

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Transaksi</h3>
          <div className="flex gap-2">
             <button
              onClick={() => exportToExcel(transactions, "finance-report")}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-green-200 text-green-700 text-sm font-medium bg-green-50 hover:bg-green-100 hover:border-green-300 active:scale-95 transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Excel
            </button>
            <button
              onClick={() => exportToPDF(transactions, summary)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-red-200 text-red-700 text-sm font-medium bg-red-50 hover:bg-red-100 hover:border-red-300 active:scale-95 transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              PDF
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="pb-2">Tanggal</th>
              <th>Tipe</th>
              <th>Keterangan</th>
              <th>Jumlah</th>
              <th>Kategori</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((trx) => (
              <tr key={trx.id} className="border-b hover:bg-gray-50">
                <td className="py-2">
                  {new Date(trx.date).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </td>

                <td>
                  <span className={`px-2 py-1 rounded-lg text-sm ${
                    trx.type === 'income'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {trx.type}
                  </span>
                </td>
                <td>{trx.description}</td>
                <td className="font-semibold">
                  Rp {parseInt(trx.amount).toLocaleString()}
                </td>

                <td>{trx.category}</td>

                <td>
                  <button
                    onClick={() => {
                      
                          setSelectedData(trx);
                          setIsEditOpen(true);
                        }}
                        className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
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
      <EditModal
      isOpen={isEditOpen}
      onClose={() => setIsEditOpen(false)}
      data={selectedData}
      refresh={fetchData}
      />
    </div>
  );
}

export default Dashboard;