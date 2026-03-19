// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import constants from '../config/constants.js';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false, // Never return password in queries by default
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    refreshToken: {
        type: String,
        select: false, // Never return refresh token in queries by default
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash password if it was modified
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, constants.BCRYPT_ROUNDS);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to return public data (without sensitive fields)
userSchema.methods.toPublicData = function () {
    return {
        id: this._id,
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        isActive: this.isActive,
        createdAt: this.createdAt,
    };
};

const User = mongoose.model('User', userSchema);
export default User;
