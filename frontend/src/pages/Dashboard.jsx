import { useEffect, useState, useRef } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Chart from '../components/Charts';
import EditModal from "../components/EditModal";
import { exportToExcel } from "../utils/exportExcel";
import { exportToPDF } from "../utils/exportPdf";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

function Dashboard() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0
  });

  const [monthlyExpense, setMonthlyExpense] = useState([]);
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [savingsRate, setSavingsRate] = useState({});
  const [topCategory, setTopCategory] = useState({});

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

    const [
      trxRes,
      sumRes,
      monthlyRes,
      categoryRes,
      savingsRes,
      topCategoryRes
    ] = await Promise.all([
      API.get(`/transactions?${query}`),
      API.get(`/transactions/summary?${query}`),

      // 🔥 ANALYTICS
      API.get("/analytics/monthly-expense"),
      API.get("/analytics/expense-category"),
      API.get("/analytics/savings-rate"),
      API.get("/analytics/top-category")
    ]);

    // TRANSACTIONS
    setTransactions(trxRes.data.data);

    // SUMMARY
    setSummary(sumRes.data);

    // ANALYTICS
    setMonthlyExpense(monthlyRes.data);
    setExpenseCategory(categoryRes.data);
    setSavingsRate(savingsRes.data);
    setTopCategory(topCategoryRes.data);

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

  // Tambah di state
const [toast, setToast] = useState(null);
const toastTimer = useRef(null);

const showToast = (msg) => {
  setToast(msg);
  clearTimeout(toastTimer.current);
  toastTimer.current = setTimeout(() => setToast(null), 2000);
};

const setQuickFilter = (type) => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const toStr = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

  let newFilters = { ...filters, type: '', startDate: '', endDate: '' };
  if (type === 'today') {
    const t = toStr(now);
    newFilters = { ...newFilters, startDate: t, endDate: t };
  } else if (type === 'week') {
    const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1);
    newFilters = { ...newFilters, startDate: toStr(mon), endDate: toStr(now) };
  } else if (type === 'month') {
    newFilters = { ...newFilters, startDate: `${now.getFullYear()}-${pad(now.getMonth()+1)}-01`, endDate: toStr(now) };
  } else if (type === 'income' || type === 'expense') {
    newFilters = { ...newFilters, type };
  }
  setFilters(newFilters);
  applyFilter(newFilters);
};

// summary dari filtered transactions
const income = transactions.filter(t => t.type === 'income');
const expense = transactions.filter(t => t.type === 'expense');
const totalIncome = income.reduce((s, t) => s + parseInt(t.amount), 0);
const totalExpense = expense.reduce((s, t) => s + parseInt(t.amount), 0);
const balance = totalIncome - totalExpense;

  return (
<div className="min-h-screen bg-slate-50 p-4">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-3">
    <div>
      <p className="text-base font-medium text-slate-800">Finance Dashboard</p>
      <p className="text-[11px] text-slate-400 mt-0.5">
        {new Date().toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
      </p>
    </div>
    <button
      onClick={() => navigate('/add-transaction')}
      className="flex items-center gap-1.5 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-700 active:scale-95 transition-all duration-150"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
      </svg>
      Tambah
    </button>
  </div>

  {/* CHART */}
  <div className="bg-white border border-slate-100 rounded-2xl p-3 mb-2.5">
    <Chart />
  </div>

  {/* SUMMARY CARDS — live dari filtered data */}
  <div className="grid grid-cols-3 gap-2 mb-2.5">
    <div className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Income</p>
      <p className="text-sm font-medium text-emerald-600">Rp {totalIncome.toLocaleString()}</p>
      <p className="text-[10px] text-slate-400 mt-1">{income.length} transaksi</p>
    </div>
    <div className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Expense</p>
      <p className="text-sm font-medium text-rose-500">Rp {totalExpense.toLocaleString()}</p>
      <p className="text-[10px] text-slate-400 mt-1">{expense.length} transaksi</p>
    </div>
    <div className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Balance</p>
      <p className={`text-sm font-medium ${balance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
        Rp {Math.abs(balance).toLocaleString()}
      </p>
      <p className="text-[10px] text-slate-400 mt-1">{balance >= 0 ? 'Surplus' : 'Defisit'}</p>
    </div>
  </div>

  <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-3">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-sm font-semibold text-slate-700">
      Monthly Expense Trend
    </h2>
  </div>

  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={monthlyExpense}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />

      <Line
        type="monotone"
        dataKey="total"
        stroke="#3B82F6"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

<div className="bg-white border border-slate-100 rounded-2xl p-4 mb-3">

  <h2 className="text-sm font-semibold text-slate-700 mb-4">
    Expense by Category
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <PieChart>

      <Pie
        data={expenseCategory}
        dataKey="total"
        nameKey="category"
        outerRadius={100}
        label
      >
        {expenseCategory.map((entry, index) => (
          <Cell
            key={index}
            fill={[
              "#3B82F6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
              "#EC4899"
            ][index % 6]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />

    </PieChart>
  </ResponsiveContainer>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">

  {/* SAVINGS RATE */}
  <div className="bg-white border border-slate-100 rounded-2xl p-4">

    <p className="text-xs text-slate-400 mb-2">
      Savings Rate
    </p>

    <h2 className="text-3xl font-bold text-emerald-600">
      {savingsRate.savingsRate || 0}%
    </h2>

    <p className="text-xs text-slate-400 mt-2">
      Persentase tabungan dari income
    </p>
  </div>


  {/* TOP CATEGORY */}
  <div className="bg-white border border-slate-100 rounded-2xl p-4">

    <p className="text-xs text-slate-400 mb-2">
      Top Spending Category
    </p>

    <h2 className="text-2xl font-bold text-rose-500">
      {topCategory.category || "-"}
    </h2>

    <p className="text-xs text-slate-400 mt-2">
      Rp {Number(topCategory.total || 0).toLocaleString()}
    </p>
  </div>

</div>

  {/* FILTER */}
  <div className="bg-white border border-slate-100 rounded-xl px-3 py-2.5 mb-2.5">
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative flex-1 min-w-[140px]">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text" name="search" placeholder="Cari keterangan atau kategori..."
          value={filters.search} onChange={handleFilterChange}
          className="w-full pl-7 pr-2.5 py-1.5 border border-slate-200 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-700 placeholder-slate-300"
        />
      </div>
      <select
        name="type" value={filters.type} onChange={handleFilterChange}
        className="border border-slate-200 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
      >
        <option value="">Semua tipe</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange}
        className="border border-slate-200 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange}
        className="border border-slate-200 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <button onClick={resetFilters}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-xs text-slate-500 rounded-lg hover:bg-slate-50 active:scale-95 transition-all duration-150 ml-auto"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Reset
      </button>
    </div>

    {/* QUICK FILTER CHIPS */}
    <div className="flex gap-1.5 mt-2 flex-wrap items-center">
      <p className="text-[11px] text-slate-400">Filter cepat:</p>
      {[
        { label: 'Hari ini', key: 'today' },
        { label: 'Minggu ini', key: 'week' },
        { label: 'Bulan ini', key: 'month' },
        { label: 'Income saja', key: 'income' },
        { label: 'Expense saja', key: 'expense' },
      ].map(({ label, key }) => (
        <button key={key} onClick={() => setQuickFilter(key)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150 active:scale-95 ${
            (key === 'income' && filters.type === 'income') || (key === 'expense' && filters.type === 'expense')
              ? 'bg-slate-800 text-white border-slate-800'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  </div>

  {/* TABLE */}
  <div className="bg-white border border-slate-100 rounded-xl px-3 py-2.5 relative">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium text-slate-700">Transaksi</p>
        <span className="text-[11px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">
          {transactions.length} data
        </span>
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => { exportToExcel(transactions, "finance-report"); showToast("Mengunduh file Excel..."); }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-700 text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 active:scale-95 transition-all duration-150"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Excel
        </button>
        <button onClick={() => { exportToPDF(transactions, summary); showToast("Mengunduh file PDF..."); }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 text-[11px] font-medium bg-rose-50 hover:bg-rose-100 active:scale-95 transition-all duration-150"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          PDF
        </button>
      </div>
    </div>

    <table className="w-full text-left" style={{ tableLayout: 'fixed' }}>
      <colgroup>
        <col style={{ width: '100px' }} />
        <col style={{ width: '80px' }} />
        <col />
        <col style={{ width: '110px' }} />
        <col style={{ width: '90px' }} />
        <col style={{ width: '80px' }} />
      </colgroup>
      <thead>
        <tr className="text-[10px] text-slate-400 uppercase tracking-wider">
          <th className="pb-2 font-medium">Tanggal</th>
          <th className="pb-2 font-medium">Tipe</th>
          <th className="pb-2 font-medium">Keterangan</th>
          <th className="pb-2 font-medium text-right">Jumlah</th>
          <th className="pb-2 font-medium">Kategori</th>
          <th className="pb-2"></th>
        </tr>
      </thead>
      <tbody>
        {transactions.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
              Tidak ada transaksi ditemukan
            </td>
          </tr>
        ) : transactions.map((trx) => (
          <tr key={trx.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors duration-100 group">
            <td className="py-2 text-[11px] text-slate-400">
              {new Date(trx.date).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })}
            </td>
            <td className="py-2">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium capitalize ${
                trx.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
              }`}>
                {trx.type}
              </span>
            </td>
            <td className="py-2 text-xs text-slate-700 truncate pr-2">{trx.description}</td>
            <td className={`py-2 text-xs font-medium text-right ${trx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'}`}>
              {trx.type === 'income' ? '+' : '−'}Rp {parseInt(trx.amount).toLocaleString()}
            </td>
            <td className="py-2 text-[11px] text-slate-400">{trx.category}</td>
            <td className="py-2">
              <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button onClick={() => { setSelectedData(trx); setIsEditOpen(true); }}
                  className="text-[11px] text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors"
                >Edit</button>
                <button onClick={() => handleDelete(trx.id)}
                  className="text-[11px] text-rose-500 border border-rose-200 px-2 py-0.5 rounded-md hover:bg-rose-50 transition-colors"
                >Hapus</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* PAGINATION */}
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}
        className="flex items-center gap-1 px-3 py-1 text-[11px] text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all duration-150"
      >← Prev</button>
      <p className="text-[11px] text-slate-400">Halaman {page}</p>
      <button onClick={() => setPage(page + 1)}
        className="flex items-center gap-1 px-3 py-1 text-[11px] text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all duration-150"
      >Next →</button>
    </div>

    {/* TOAST NOTIFICATION */}
    {toast && (
      <div className="absolute bottom-4 right-4 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg animate-fade-in shadow-sm">
        {toast}
      </div>
    )}
  </div>

  <EditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} data={selectedData} refresh={fetchData} />
</div>
);
}

export default Dashboard;