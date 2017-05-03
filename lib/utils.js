"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async = require("async");
const mongoose = require("mongoose");
function send(req, res, dataFunction) {
    let sendData = (err, data) => {
        if (!err && !res)
            return this;
        if (err) {
            if (err.name == 'MongooseError') {
                res.sendStatus(500);
            }
            else {
                res.header('Title', 'Invalid Data');
                console.log(err);
                if (err instanceof mongoose.Error) {
                    res.header('Message', err.toString());
                }
                else {
                    res.header('Message', err.message);
                }
                res.send(400);
            }
        }
        else {
            res.json(data);
        }
    };
    if (dataFunction) {
        if (typeof (dataFunction) == 'function') {
            async.waterfall([
                function (callback) {
                    try {
                        dataFunction(callback);
                    }
                    catch (ex) {
                        callback(ex, null);
                    }
                }
            ], sendData);
        }
        else {
            res.json(dataFunction);
        }
    }
    else {
        return sendData;
    }
}
exports.send = send;
function sendNotAuthorized(req, res, profile) {
    //profile == 'web' ? res.redirect('login.html') : res.sendStatus(401);
    profile == 'web' ? res.redirect('/login') : res.sendStatus(401);
}
exports.sendNotAuthorized = sendNotAuthorized;
function generateCsvResponse(req, res, data) {
    res.header('content-type', 'text/csv');
    res.header('content-disposition', 'attachment; filename=products.csv');
    res.write(data);
    res.end();
}
exports.generateCsvResponse = generateCsvResponse;
function requiresUserSession(profile) {
    return function (req, res, next) {
        if (!req.session.user) {
            sendNotAuthorized(req, res, profile);
        }
        else {
            next();
        }
    };
}
exports.requiresUserSession = requiresUserSession;
function setClbSuccess(callback) {
    return function (result) {
        return new Promise((resolve, reject) => {
            if (callback) {
                callback(null, result);
            }
            resolve(result);
        });
    };
}
exports.setClbSuccess = setClbSuccess;
function setClbError(callback) {
    return function (reason) {
        return new Promise((resolve, reject) => {
            if (callback) {
                callback(reason, null);
            }
            reject(reason);
        });
    };
}
exports.setClbError = setClbError;
function validatesId(req, res, next) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        next();
    }
    else {
        res.sendStatus(400);
    }
}
exports.validatesId = validatesId;
//# sourceMappingURL=utils.js.map