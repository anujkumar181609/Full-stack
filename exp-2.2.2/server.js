// server.js
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bankingRoutes from './routes/bankingRoutes.js';
import {
    ValidationError,
    AuthenticationError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InsufficientFundsError,
} from './utils/errors.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// ─── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json());

// ─── Request Logger ────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    res.on('finish', () => {
        console.log(`[${timestamp}] ${req.method} ${req.url} → ${res.statusCode}`);
    });
    next();
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/banking', bankingRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: '🏦 Banking API with JWT Authentication',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                refresh: 'POST /api/auth/refresh',
                logout: 'POST /api/auth/logout',
                profile: 'GET /api/auth/profile',
            },
            banking: {
                balance: 'GET /api/banking/balance',
                transactions: 'GET /api/banking/transactions',
                deposit: 'POST /api/banking/deposit',
                withdraw: 'POST /api/banking/withdraw',
                transfer: 'POST /api/banking/transfer',
            },
        },
    });
});

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// ─── Global Error Handler (must be last) ──────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);

    // Handle custom application errors
    if (
        err instanceof ValidationError ||
        err instanceof AuthenticationError ||
        err instanceof ForbiddenError ||
        err instanceof NotFoundError ||
        err instanceof ConflictError ||
        err instanceof InsufficientFundsError
    ) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ error: messages.join(', ') });
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ error: `${field} already exists` });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired. Please refresh your token.' });
    }

    // Default 500 error
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Banking API running on http://localhost:${PORT}`);
    console.log(`📋 API docs available at http://localhost:${PORT}/`);
});
