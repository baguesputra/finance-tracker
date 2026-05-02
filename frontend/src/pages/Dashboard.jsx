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
    <div className="min-h-screen bg-slate-50 p-4">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-3">
    <div>
      <h1 className="text-base font-semibold text-slate-800 tracking-tight">Finance Dashboard</h1>
      <p className="text-xs text-slate-400">Mei 2026</p>
    </div>
    <button
      onClick={() => navigate('/add-transaction')}
      className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-700 active:scale-95 transition-all duration-150"
    >
      + Tambah
    </button>
  </div>

  {/* CHART */}
  <div className="bg-white border border-slate-100 rounded-2xl p-3 mb-2.5">
    <Chart />
  </div>

  {/* SUMMARY CARDS */}
  <div className="grid grid-cols-3 gap-2 mb-2.5">
    {[
      { label: 'Income', value: summary.total_income, color: 'text-emerald-600' },
      { label: 'Expense', value: summary.total_expense, color: 'text-rose-500' },
      { label: 'Balance', value: summary.balance, color: 'text-slate-800' },
    ].map(({ label, value, color }) => (
      <div key={label} className="bg-white border border-slate-100 rounded-xl px-3 py-2.5">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-sm font-semibold ${color}`}>Rp {value.toLocaleString()}</p>
      </div>
    ))}
  </div>

  {/* FILTER — satu baris */}
  <div className="bg-white border border-slate-100 rounded-xl px-3 py-2.5 mb-2.5">
    <div className="flex gap-2 items-center">
      <input
        type="text" name="search" placeholder="Cari..."
        value={filters.search} onChange={handleFilterChange}
        className="flex-[2] border border-slate-200 text-xs text-slate-700 placeholder-slate-300 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <select
        name="type" value={filters.type} onChange={handleFilterChange}
        className="flex-1 border border-slate-200 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
      >
        <option value="">Semua Tipe</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input
        type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange}
        className="flex-1 border border-slate-200 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <input
        type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange}
        className="flex-1 border border-slate-200 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <button
        onClick={resetFilters}
        className="px-3 py-1.5 text-xs text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all duration-150 whitespace-nowrap"
      >
        Reset
      </button>
      <button
        onClick={applyFilter}
        className="px-3 py-1.5 text-xs text-white bg-slate-800 rounded-lg hover:bg-slate-700 active:scale-95 transition-all duration-150 whitespace-nowrap"
      >
        Terapkan
      </button>
    </div>
  </div>

  {/* TABLE */}
  <div className="bg-white border border-slate-100 rounded-xl px-3 py-2.5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-slate-700">Transaksi</p>
      <div className="flex gap-1.5">
        <button
          onClick={() => exportToExcel(transactions, "finance-report")}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-700 text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 active:scale-95 transition-all duration-150"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Excel
        </button>
        <button
          onClick={() => exportToPDF(transactions, summary)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 text-[11px] font-medium bg-rose-50 hover:bg-rose-100 active:scale-95 transition-all duration-150"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          PDF
        </button>
      </div>
    </div>

    <table className="w-full text-left">
      <thead>
        <tr className="text-[10px] text-slate-400 uppercase tracking-wider">
          <th className="pb-2 font-medium">Tanggal</th>
          <th className="pb-2 font-medium">Tipe</th>
          <th className="pb-2 font-medium">Keterangan</th>
          <th className="pb-2 font-medium">Jumlah</th>
          <th className="pb-2 font-medium">Kategori</th>
          <th className="pb-2"></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((trx) => (
          <tr key={trx.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors duration-100">
            <td className="py-2 text-xs text-slate-400">
              {new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>
            <td className="py-2">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                trx.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
              }`}>
                {trx.type}
              </span>
            </td>
            <td className="py-2 text-xs text-slate-700">{trx.description}</td>
            <td className={`py-2 text-xs font-semibold whitespace-nowrap ${
                trx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                Rp {parseInt(trx.amount).toLocaleString()}
              </td>
            <td className="py-2 text-xs text-slate-400">{trx.category}</td>
            <td className="py-2">
              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedData(trx); setIsEditOpen(true); }}
                  className="text-[11px] rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-100 mr-1"
                >Edit</button>
                <button
                  onClick={() => handleDelete(trx.id)}
                  className="text-[11px] rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-700 transition-all duration-100"
                >Hapus</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* PAGINATION */}
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 text-[11px] text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all duration-150"
      >
        ← Prev
      </button>
      <span className="text-[11px] text-slate-400">Halaman {page}</span>
      <button
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 text-[11px] text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all duration-150"
      >
        Next →
      </button>
    </div>
  </div>

  <EditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} data={selectedData} refresh={fetchData} />
</div>
  );
}

export default Dashboard;