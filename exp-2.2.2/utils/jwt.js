// utils/jwt.js
import jwt from 'jsonwebtoken';
import constants from '../config/constants.js';
import { AuthenticationError } from './errors.js';

// Generate access token (short-lived: 15 minutes)
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, constants.JWT_ACCESS_SECRET, {
        expiresIn: constants.JWT_ACCESS_EXPIRES,
    });
};

// Generate refresh token (long-lived: 7 days)
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, constants.JWT_REFRESH_SECRET, {
        expiresIn: constants.JWT_REFRESH_EXPIRES,
    });
};

// Verify access token
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, constants.JWT_ACCESS_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AuthenticationError('Access token has expired. Please refresh your token.');
        }
        throw new AuthenticationError('Invalid access token.');
    }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, constants.JWT_REFRESH_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AuthenticationError('Refresh token has expired. Please login again.');
        }
        throw new AuthenticationError('Invalid refresh token.');
    }
};
