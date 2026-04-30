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

    const sql = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC';

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
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
