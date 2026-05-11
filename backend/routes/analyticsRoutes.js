const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.get('/monthly-expense', authMiddleware, analyticsController.monthlyExpenseTrend);
router.get('/expense-category', authMiddleware, analyticsController.expenseByCategory);
router.get('/savings-rate', authMiddleware, analyticsController.savingsRate);
router.get('/top-category', authMiddleware, analyticsController.topSpendingCategory);

module.exports = router;
