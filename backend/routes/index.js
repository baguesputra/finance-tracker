const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionsRoutes');

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);

// test api
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

module.exports = router;