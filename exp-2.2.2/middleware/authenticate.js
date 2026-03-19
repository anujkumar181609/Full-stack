// middleware/authenticate.js
// Verifies the JWT access token on every protected request
import { verifyAccessToken } from '../utils/jwt.js';
import { AuthenticationError } from '../utils/errors.js';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided. Please login.');
        }

        const token = authHeader.substring(7); // Remove 'Bearer '

        // Verify token signature and expiry
        const decoded = verifyAccessToken(token);

        // Check if user still exists and is active
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new AuthenticationError('User no longer exists.');
        }
        if (!user.isActive) {
            throw new AuthenticationError('Account has been deactivated.');
        }

        // Attach user to request object for downstream use
        req.user = user.toPublicData();
        next();
    } catch (error) {
        next(error);
    }
};

export default authenticate;
