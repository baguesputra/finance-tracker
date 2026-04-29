require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());    

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Finance Tracker API!');
});

// Importing routes
const routes = require('./routes');
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});