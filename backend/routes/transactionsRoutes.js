const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.post('/', authMiddleware, transactionController.createTransaction);
router.put('/:id', authMiddleware, transactionController.updateTransaction);
router.get('/', authMiddleware, transactionController.getTransactions);
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);
router.get('/summary', authMiddleware, transactionController.getSummary);
router.get('/monthly', authMiddleware, transactionController.getMonthlySummary);
router.get('/summary/filter', authMiddleware, transactionController.getSummaryByFilter);
router.get('/summary/monthly', authMiddleware, transactionController.getMonthlyBreakdown);
router.get('/:id', authMiddleware, transactionController.getTransactionById);

module.exports = router;