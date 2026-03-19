// middleware/validate.js
import { ValidationError } from '../utils/errors.js';

// Validate user registration input
export const validateRegister = (req, res, next) => {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || fullName.trim().length < 3) {
        return next(new ValidationError('Full name must be at least 3 characters long'));
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) {
        return next(new ValidationError('Please provide a valid email address'));
    }

    if (!password || password.length < 8) {
        return next(new ValidationError('Password must be at least 8 characters long'));
    }

    // Password strength check for banking security
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasUppercase || !hasNumber) {
        return next(new ValidationError('Password must contain at least one uppercase letter and one number'));
    }

    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return next(new ValidationError('Please provide a valid 10-digit phone number'));
    }

    // Sanitize input
    req.body.fullName = fullName.trim();
    req.body.email = email.trim().toLowerCase();
    next();
};

// Validate login input
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ValidationError('Email and password are required'));
    }

    req.body.email = email.trim().toLowerCase();
    next();
};

// Validate transfer input
export const validateTransfer = (req, res, next) => {
    const { toAccountNumber, amount } = req.body;

    if (!toAccountNumber || typeof toAccountNumber !== 'string') {
        return next(new ValidationError('Destination account number is required'));
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
        return next(new ValidationError('Amount must be a positive number'));
    }

    req.body.amount = parsedAmount;
    next();
};

// Validate deposit/withdrawal input
export const validateTransaction = (req, res, next) => {
    const { amount } = req.body;

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
        return next(new ValidationError('Amount must be a positive number'));
    }

    req.body.amount = parsedAmount;
    next();
};
