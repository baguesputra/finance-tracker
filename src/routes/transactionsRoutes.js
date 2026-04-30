const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/', authMiddleware, transactionController.getTransactions);
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);
router.get('/summary', authMiddleware, transactionController.getSummary);

module.exports = router;