const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied, no token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // { id, email }
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

