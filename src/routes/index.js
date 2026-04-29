const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');

router.use('/auth', authRoutes);

// test api
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

module.exports = router;