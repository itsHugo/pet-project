'use strict';
// in ApplicationErrors.js
var util = require('util');

export class AbstractError extends Error {
    name = 'AbstractError';
    constructor(msg) {
        super(msg)
        Error.captureStackTrace(this);
        this.message = msg || 'Error';
    }
}

export class DatabaseError extends AbstractError {
    name = 'Database Error'
}

export class UnauthorizedError extends AbstractError {
    name = "Unauthorized Error"
}

export class PermissionError extends AbstractError {
    name = "Permission Error"
}

export class InvalidDataError extends AbstractError {
    name = 'Invalid Data Error'
}

export default {
    Database: DatabaseError,
    InvalidData: InvalidDataError,
    Unauthorized: UnauthorizedError,
    Permission: PermissionError
}