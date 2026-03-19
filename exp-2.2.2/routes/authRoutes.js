// routes/authRoutes.js
import express from 'express';
import { register, login, refreshToken, logout, getProfile } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';
import authenticate from '../middleware/authenticate.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Public routes (no token required)
router.post('/register', validateRegister, asyncHandler(register));
router.post('/login', validateLogin, asyncHandler(login));
router.post('/refresh', asyncHandler(refreshToken));   // Uses refresh token to get new access token

// Protected routes (token required)
router.post('/logout', authenticate, asyncHandler(logout));
router.get('/profile', authenticate, asyncHandler(getProfile));

export default router;
