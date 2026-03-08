require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/urbanvoice-sentinel';

// Start server regardless of MongoDB connection
app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});

// Connect to MongoDB (non-blocking)
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✓ Connected to MongoDB');
    })
    .catch(err => {
        console.error('⚠ MongoDB connection error:', err.message);
        console.log('Server will continue running without database connection');
    });
