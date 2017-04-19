'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// in ApplicationErrors.js
var util = require('util');
class AbstractError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'AbstractError';
        Error.captureStackTrace(this);
        this.message = msg || 'Error';
    }
}
exports.AbstractError = AbstractError;
class DatabaseError extends AbstractError {
    constructor() {
        super(...arguments);
        this.name = 'Database Error';
    }
}
exports.DatabaseError = DatabaseError;
class UnauthorizedError extends AbstractError {
    constructor() {
        super(...arguments);
        this.name = "Unauthorized Error";
    }
}
exports.UnauthorizedError = UnauthorizedError;
class PermissionError extends AbstractError {
    constructor() {
        super(...arguments);
        this.name = "Permission Error";
    }
}
exports.PermissionError = PermissionError;
class InvalidDataError extends AbstractError {
    constructor() {
        super(...arguments);
        this.name = 'Invalid Data Error';
    }
}
exports.InvalidDataError = InvalidDataError;
exports.default = {
    Database: DatabaseError,
    InvalidData: InvalidDataError,
    Unauthorized: UnauthorizedError,
    Permission: PermissionError
};
//# sourceMappingURL=errors.js.map