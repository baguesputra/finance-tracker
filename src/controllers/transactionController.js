const db = require('../config/db');

// Create Transaction
exports.createTransaction = (req, res) => {
    const { type, amount, category, description, date } = req.body;
    const user_id = req.user.id;

    const sql = 'INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [user_id, type, amount, category, description, date], (err, result) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });

        res.json({ message: 'Transaction created successfully' });

    });
};

// Get Transactions
exports.getTransactions = (req, res) => {
    const user_id = req.user.id;

    const { type, startDate, endDate, search, sort = 'date_desc', page = 1, limit = 10 } = req.query;

    let sql = 'SELECT * FROM transactions WHERE user_id = ?';
    let params = [user_id];

    // Filter Type
    if (type && ['income', 'expense'].includes(type)) {
        sql += ' AND type = ?';
        params.push(type);
    }

    // Filter Date Range
    if (startDate) {
        sql += ' AND date >= ?';
        params.push(startDate);
    }

    if (endDate) {
        sql += ' AND date <= ?';
        params.push(endDate);
    }

    // Search
    if (search) {
        sql += ' AND (category LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }   

    // Sorting
    if (sort === 'amount_high') {
        sql += ' ORDER BY amount DESC';
    } else if (sort === 'amount_low') {
        sql += ' ORDER BY amount ASC';
    } else if (sort === 'date_asc') {
        sql += ' ORDER BY date ASC';
    } else {
        sql += ' ORDER BY date DESC';
    }

    // Pagination
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            data: results
        });
    }); 
};

// Delete Transaction
exports.deleteTransaction = (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    const sql = 'DELETE FROM transactions WHERE id = ? AND user_id = ?';

    db.query(sql, [id, user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: 'Transaction deleted successfully' });

    });
};

// Summary of Transactions
exports.getSummary = (req, res) => {
    const user_id = req.user.id;
    const { startDate, endDate } = req.query;

    const sql = `
        SELECT
            DATE_FORMAT(date, '%Y-%m') AS month,
            sum(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            sum(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
        FROM transactions
        WHERE user_id = ?
        GROUP BY month
        ORDER BY month ASC;
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const data = results[0];

        const total_income = data.total_income || 0;
        const total_expense = data.total_expense || 0;
        const balance = total_income - total_expense;

        res.json({
            total_income,
            total_expense,
            balance
        });
    });

    // Summary by date range
    let params = [user_id];

    if (startDate) {
        sql += ' AND date >= ?';
        params.push(startDate);
    }

    if (endDate) {
        sql += ' AND date <= ?';
        params.push(endDate);
    }
};
