import { useEffect, useState } from "react";
import API from "../services/API";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [data, setData] = useState({
        total_income: 0,
        total_expense: 0,
        balance: 0
    });

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const res = await API.get("/transactions/summary");
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch summary:", err);
        }
    };

    const navigate = useNavigate();

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Total Income: {data.total_income}</p>
            <p>Total Expense: {data.total_expense}</p>
            <p>Balance: {data.balance}</p>
            <button onClick={() => navigate("/add-transaction")}>Add Transaction</button>
        </div>
    );
}   

export default Dashboard;