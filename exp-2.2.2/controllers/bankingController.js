// controllers/bankingController.js
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { NotFoundError, ForbiddenError, InsufficientFundsError, ValidationError } from '../utils/errors.js';

// GET /api/banking/balance
export const getBalance = async (req, res) => {
    const account = await Account.findOne({ userId: req.user.id, isActive: true });
    if (!account) {
        throw new NotFoundError('No active bank account found for this user');
    }

    res.json({
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
        currency: 'INR',
    });
};

// GET /api/banking/transactions
export const getTransactions = async (req, res) => {
    const account = await Account.findOne({ userId: req.user.id, isActive: true });
    if (!account) {
        throw new NotFoundError('No active bank account found');
    }

    // Get all transactions involving this account
    const transactions = await Transaction.find({
        $or: [
            { fromAccount: account.accountNumber },
            { toAccount: account.accountNumber },
        ],
    }).sort({ createdAt: -1 }).limit(20); // Latest 20 transactions

    res.json({
        accountNumber: account.accountNumber,
        totalTransactions: transactions.length,
        transactions,
    });
};

// POST /api/banking/deposit
export const deposit = async (req, res) => {
    const { amount, description } = req.body;

    const account = await Account.findOne({ userId: req.user.id, isActive: true });
    if (!account) {
        throw new NotFoundError('No active bank account found');
    }

    // Update balance
    account.balance += amount;
    await account.save();

    // Record transaction
    const transaction = await Transaction.create({
        fromAccount: 'EXTERNAL',
        toAccount: account.accountNumber,
        amount,
        type: 'deposit',
        description: description || 'Deposit',
        status: 'success',
    });

    res.json({
        message: `₹${amount} deposited successfully`,
        newBalance: account.balance,
        transaction: {
            id: transaction._id,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            status: transaction.status,
            date: transaction.createdAt,
        },
    });
};

// POST /api/banking/withdraw
export const withdraw = async (req, res) => {
    const { amount, description } = req.body;

    const account = await Account.findOne({ userId: req.user.id, isActive: true });
    if (!account) {
        throw new NotFoundError('No active bank account found');
    }

    // Check sufficient funds
    if (account.balance < amount) {
        throw new InsufficientFundsError(`Insufficient funds. Available balance: ₹${account.balance}`);
    }

    // Update balance
    account.balance -= amount;
    await account.save();

    // Record transaction
    const transaction = await Transaction.create({
        fromAccount: account.accountNumber,
        toAccount: 'EXTERNAL',
        amount,
        type: 'withdrawal',
        description: description || 'Withdrawal',
        status: 'success',
    });

    res.json({
        message: `₹${amount} withdrawn successfully`,
        newBalance: account.balance,
        transaction: {
            id: transaction._id,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            status: transaction.status,
            date: transaction.createdAt,
        },
    });
};

// POST /api/banking/transfer
export const transfer = async (req, res) => {
    const { toAccountNumber, amount, description } = req.body;

    // Get sender's account
    const senderAccount = await Account.findOne({ userId: req.user.id, isActive: true });
    if (!senderAccount) {
        throw new NotFoundError('No active bank account found');
    }

    // Prevent self-transfer
    if (senderAccount.accountNumber === toAccountNumber) {
        throw new ValidationError('Cannot transfer to your own account');
    }

    // Get recipient's account
    const recipientAccount = await Account.findOne({ accountNumber: toAccountNumber, isActive: true });
    if (!recipientAccount) {
        throw new NotFoundError('Destination account not found or inactive');
    }

    // Check sufficient funds
    if (senderAccount.balance < amount) {
        throw new InsufficientFundsError(`Insufficient funds. Available balance: ₹${senderAccount.balance}`);
    }

    // Perform transfer atomically
    senderAccount.balance -= amount;
    recipientAccount.balance += amount;

    await senderAccount.save();
    await recipientAccount.save();

    // Record transaction
    const transaction = await Transaction.create({
        fromAccount: senderAccount.accountNumber,
        toAccount: toAccountNumber,
        amount,
        type: 'transfer',
        description: description || 'Fund Transfer',
        status: 'success',
    });

    res.json({
        message: `₹${amount} transferred successfully to ${toAccountNumber}`,
        newBalance: senderAccount.balance,
        transaction: {
            id: transaction._id,
            type: transaction.type,
            amount: transaction.amount,
            fromAccount: transaction.fromAccount,
            toAccount: transaction.toAccount,
            description: transaction.description,
            status: transaction.status,
            date: transaction.createdAt,
        },
    });
};
