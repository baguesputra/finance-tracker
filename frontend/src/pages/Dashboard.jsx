import { useEffect, useState } from "react";
import API from "../services/API";

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

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Total Income: {data.total_income}</p>
            <p>Total Expense: {data.total_expense}</p>
            <p>Balance: {data.balance}</p>
        </div>
    );
}   

export default Dashboard;