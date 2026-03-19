// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: String,
        required: true,
    },
    toAccount: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [1, 'Amount must be at least 1'],
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer'],
        required: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success',
    },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
