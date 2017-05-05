"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const errors_1 = require("./errors");
const util = require("util");
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
function validateItem(item, callback) {
    return new Promise((resolve, reject) => {
        var error = null;
        if (!item.Title) {
            error = new errors_1.default.InvalidData("Title is required");
        }
        if (!item.Description) {
            error = new errors_1.default.InvalidData("Description is required");
        }
        if (!item.Price || item.Price < 0) {
            error = new errors_1.default.InvalidData("Price is required");
        }
        if (!item.CreatedBy) {
            error = new errors_1.default.InvalidData("You need to be logged in");
        }
        if (!item.Categories || item.Categories.length <= 0) {
            error = new errors_1.default.InvalidData("You need to choose a category");
        }
        if (callback)
            callback(error, item);
        if (error)
            reject(error);
        else
            resolve(item);
    });
}
exports.validateItem = validateItem;
function validateCategory(category, callback) {
    return new Promise((resolve, reject) => {
        var error = null;
        if (!category.Name)
            error = new errors_1.default.InvalidData("Name is required");
        if (callback)
            callback(error, category);
        if (error)
            reject(error);
        else
            resolve(category);
    });
}
exports.validateCategory = validateCategory;
//# sourceMappingURL=validators.js.map