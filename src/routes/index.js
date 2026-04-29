const express = require('express');
const router = express.Router();

// test api
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

module.exports = router;