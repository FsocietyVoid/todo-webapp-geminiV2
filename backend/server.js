// backend/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // Import cors package
import aiRoutes from './routes/aiRoutes.js';
import * as firebaseAdmin from './config/firebaseAdmin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS setup - USE THE CORS PACKAGE INSTEAD
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Routes
app.use('/api', aiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Productivity Dashboard Backend Running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        error: 'Internal server error', 
        details: err.message 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\nProductivity Dashboard Backend Server is running on port ${PORT}`);
    console.log(`API Key Status: ${process.env.GEMINI_API_KEY ? 'Loaded' : 'MISSING! Set GEMINI_API_KEY in .env'}`);
    console.log(`Firebase Admin Status: ${process.env.SERVICE_ACCOUNT_PATH ? 'Service account path loaded' : 'MISSING SERVICE_ACCOUNT_PATH in .env'}`);
});