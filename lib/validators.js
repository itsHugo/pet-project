"use strict";
const crypto = require('crypto');
const errors_1 = require('./errors');
const util = require('util');
function validatePasswordAndCreateHash(password, callback) {
    return new Promise((resolve, reject) => {
        if (password) {
            if (password.length >= 5) {
                let hashed = crypto.createHash('md5').update(password).digest("hex");
                if (callback)
                    callback(null, hashed);
                resolve(hashed);
            }
            else {
                let err = new errors_1.default.InvalidData("Password must be at least 5 letters");
                if (callback)
                    callback(err, null);
                reject(err);
            }
        }
        else {
            let err = new errors_1.default.InvalidData("No Password Provided");
            if (callback)
                callback(err, null);
            reject(err);
        }
    });
}
exports.validatePasswordAndCreateHash = validatePasswordAndCreateHash;
function validateAutoLoginData(data, callback) {
    if (!data.Id) {
        console.log("invalid data on autologin:" + util.inspect(data));
        callback(new errors_1.default.InvalidData("Invalid Parameters"), null);
    }
}
exports.validateAutoLoginData = validateAutoLoginData;
function validateUser(user, callback) {
    return new Promise((resolve, reject) => {
        var error = null;
        var result = {};
        if (!user.Email) {
            error = new errors_1.default.InvalidData("Email is required");
        }
        else if (!user.FirstName) {
            error = new errors_1.default.InvalidData("Name is required");
        }
        else if (!user.LastName) {
            error = new errors_1.default.InvalidData('Lastname is required');
        }
        if (callback)
            callback(error, user);
        if (error)
            reject(error);
        else
            resolve(user);
    });
}
exports.validateUser = validateUser;
//# sourceMappingURL=validators.js.map