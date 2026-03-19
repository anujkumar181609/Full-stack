// controllers/authController.js
import User from '../models/User.js';
import Account from '../models/Account.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ConflictError, AuthenticationError, NotFoundError } from '../utils/errors.js';

// POST /api/auth/register
export const register = async (req, res) => {
    const { fullName, email, password, phone, accountType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ConflictError('An account with this email already exists');
    }

    // Create user (password is auto-hashed by User model pre-save hook)
    const user = await User.create({ fullName, email, password, phone });

    // Auto-create a bank account for the new user
    const account = await Account.create({
        userId: user._id,
        accountNumber: Account.generateAccountNumber(),
        accountType: accountType || 'savings',
        balance: 1000, // Welcome bonus for new accounts
    });

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
        message: 'Account registered successfully',
        user: user.toPublicData(),
        account: {
            accountNumber: account.accountNumber,
            accountType: account.accountType,
            balance: account.balance,
        },
        tokens: {
            accessToken,
            refreshToken,
            expiresIn: '15m',
        },
    });
};

// POST /api/auth/login
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Find user with password field (excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        // Use same message for both cases to prevent user enumeration
        throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
    }

    // Check account status
    if (!user.isActive) {
        throw new AuthenticationError('Your account has been deactivated. Contact support.');
    }

    // Generate new tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Update refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
        message: 'Login successful',
        user: user.toPublicData(),
        tokens: {
            accessToken,
            refreshToken,
            expiresIn: '15m',
        },
    });
};

// POST /api/auth/refresh
// Uses refresh token to generate a new access token (without requiring login again)
export const refreshToken = async (req, res) => {
    const { refreshToken: token } = req.body;

    if (!token) {
        throw new AuthenticationError('Refresh token is required');
    }

    // Verify refresh token signature
    const decoded = verifyRefreshToken(token);

    // Find user and check stored refresh token matches
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
        throw new AuthenticationError('Invalid refresh token. Please login again.');
    }

    // Generate new access token (refresh token stays the same)
    const newAccessToken = generateAccessToken({ id: user._id, email: user.email });

    res.json({
        message: 'Token refreshed successfully',
        tokens: {
            accessToken: newAccessToken,
            expiresIn: '15m',
        },
    });
};

// POST /api/auth/logout
export const logout = async (req, res) => {
    // Invalidate refresh token in DB
    const user = await User.findById(req.user.id);
    if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
    }

    res.json({ message: 'Logged out successfully' });
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const accounts = await Account.find({ userId: user._id, isActive: true });

    res.json({
        user: user.toPublicData(),
        accounts: accounts.map(acc => ({
            accountNumber: acc.accountNumber,
            accountType: acc.accountType,
            balance: acc.balance,
        })),
    });
};
