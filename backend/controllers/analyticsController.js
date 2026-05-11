const db = require('../config/db');

// Monthly Expense Trend
exports.monthlyExpenseTrend = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT 
            DATE_FORMAT(date, '%Y-%m') AS month,
            SUM(amount) AS total
        FROM transactions
        WHERE user_id = ?
        AND type = 'expense'
        GROUP BY month
        ORDER BY month ASC
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Expense by Category
exports.expenseByCategory = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT 
            category,
            SUM(amount) AS total
        FROM transactions
        WHERE user_id = ?
        AND type = 'expense'
        GROUP BY category
        ORDER BY total DESC
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 💰 Savings Rate
exports.savingsRate = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
        FROM transactions
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const income = results[0].income || 0;
        const expense = results[0].expense || 0;

        const savings = income - expense;

        const savingsRate =
            income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

        res.json({
            income,
            expense,
            savings,
            savingsRate
        });
    });
};


// 🔥 Top Spending Category
exports.topSpendingCategory = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT 
            category,
            SUM(amount) AS total
        FROM transactions
        WHERE user_id = ?
        AND type = 'expense'
        GROUP BY category
        ORDER BY total DESC
        LIMIT 1
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results[0] || {});
    });
};