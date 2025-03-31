const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bookingRoutes = require('./routes/bookingRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const uri = process.env.MONGODB_URI;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        
        await client.connect();
        console.log('Connected to MongoDB');
        return client;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Initialize MongoDB connection
let mongoClient;

async function initializeServer() {
    try {
        // Connect to MongoDB
        mongoClient = await connectToMongoDB();
        
        // Make client available to routes
        app.locals.mongoClient = mongoClient;

        // Create collections if they don't exist
        try {
            await mongoClient.db("tarot-readings").createCollection("bookings", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["name", "email", "phone", "date", "time", "readingType"],
                        properties: {
                            name: { bsonType: "string" },
                            email: { bsonType: "string" },
                            phone: { bsonType: "string" },
                            date: { bsonType: "string" },
                            time: { bsonType: "string" },
                            readingType: { bsonType: "string" }
                        }
                    }
                }
            }).catch(err => {
                console.log("Collection already exists or other error:", err);
            });
        } catch (error) {
            console.error('Error creating collection:', error);
            throw error;
        }

        // Routes
        app.use('/api/bookings', bookingRoutes);

        // Serve index.html for all GET requests
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
                    console.log(`Server is running on port 3001`);
                });
            } else {
                console.error('Failed to start server:', error);
                throw error;
            }
        }

        // Handle graceful shutdown
        const shutdown = async () => {
            await mongoClient.close();
            server.close(() => {
                console.log('Server and MongoDB connection closed');
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

// Start the server
initializeServer();

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
