import { useEffect, useState } from "react";
import API from "../services/API";
import { useNavigate } from "react-router-dom";

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
        try {
            const res = await API.get("/transactions/summary");
            setSummary(res.data);
        } catch (err) {
            console.error("Failed to fetch summary:", err);
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await API.get(`/transactions?page=${page}&limit=5`); 
            setTransactions(res.data.data);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;

        try {
            await API.delete(`/transactions/${id}`);
            fetchTransactions();
            fetchSummary();
        } catch (err) {
            console.error("Failed to delete transaction:", err);
        }
    };

    return (
        <div>
            <h2>Dashboard</h2>

            <h3>Summary</h3>
            <p>Income: {summary.total_income}</p>
            <p>Expense: {summary.total_expense}</p>
            <p>Balance: {summary.balance}</p>

            <button onClick={() => navigate('/add-transaction')}>
                Tambah Transaksi
            </button>

            <h3>Daftar Transaksi</h3>

            <table border="1" cellPadding="10">
                <thead>
                <tr>
                    <th>Tanggal</th>
                    <th>Tipe</th>
                    <th>Jumlah</th>
                    <th>Kategori</th>
                    <th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((trx) => (
                    <tr key={trx.id}>
                    <td>{trx.date}</td>
                    <td>{trx.type}</td>
                    <td>{trx.amount}</td>
                    <td>{trx.category}</td>
                    <td>
                        <button onClick={() => handleDelete(trx.id)}>
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <br />

            {/* Pagination */}
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Prev
            </button>

            <span> Page {page} </span>

            <button onClick={() => setPage(page + 1)}>
                Next
            </button>
        </div>
    );
}   

export default Dashboard;