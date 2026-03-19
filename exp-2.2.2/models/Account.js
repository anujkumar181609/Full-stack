// models/Account.js
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    accountNumber: {
        type: String,
        unique: true,
        required: true,
    },
    accountType: {
        type: String,
        enum: ['savings', 'checking'],
        default: 'savings',
    },
    balance: {
        type: Number,
        default: 0,
        min: [0, 'Balance cannot be negative'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Static method to generate a unique account number
accountSchema.statics.generateAccountNumber = function () {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    return `ACC${timestamp}${random}`;
};

const Account = mongoose.model('Account', accountSchema);
export default Account;
