// utils/errors.js

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

export class AuthenticationError extends Error {
    constructor(message = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
    }
}

export class ForbiddenError extends Error {
    constructor(message = 'Access denied') {
        super(message);
        this.name = 'ForbiddenError';
        this.statusCode = 403;
    }
}

export class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export class ConflictError extends Error {
    constructor(message = 'Resource already exists') {
        super(message);
        this.name = 'ConflictError';
        this.statusCode = 409;
    }
}

export class InsufficientFundsError extends Error {
    constructor(message = 'Insufficient funds') {
        super(message);
        this.name = 'InsufficientFundsError';
        this.statusCode = 422;
    }
}
