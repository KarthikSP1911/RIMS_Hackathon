const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Hello from Express Backend Structure!" });
});

app.use('/api', apiRoutes);

module.exports = app;
