// routes/bankingRoutes.js
import express from 'express';
import {
    getBalance,
    getTransactions,
    deposit,
    withdraw,
    transfer,
} from '../controllers/bankingController.js';
import authenticate from '../middleware/authenticate.js';
import { validateTransfer, validateTransaction } from '../middleware/validate.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// All banking routes require authentication
router.use(authenticate);

router.get('/balance', asyncHandler(getBalance));
router.get('/transactions', asyncHandler(getTransactions));
router.post('/deposit', validateTransaction, asyncHandler(deposit));
router.post('/withdraw', validateTransaction, asyncHandler(withdraw));
router.post('/transfer', validateTransfer, asyncHandler(transfer));

export default router;
