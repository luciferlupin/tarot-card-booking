const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bookingRoutes = require('./routes/bookingRoutes');

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/bookings', bookingRoutes);

// Serve index.html for all GET requests that don't match API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
let server;

try {
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    if (error.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is in use, trying port 3001...`);
        server = app.listen(3001, () => {
            console.log('Server is running on port 3001');
        });
    } else {
        console.error('Failed to start server:', error);
    }
}

// Handle graceful shutdown
const shutdown = () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
