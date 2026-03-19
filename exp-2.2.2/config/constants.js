// config/constants.js
export default {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'banking-access-secret-key',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'banking-refresh-secret-key',
    JWT_ACCESS_EXPIRES: '15m',       // Access token expires in 15 minutes
    JWT_REFRESH_EXPIRES: '7d',       // Refresh token expires in 7 days
    BCRYPT_ROUNDS: 12,               // Higher rounds = more secure for banking
};
