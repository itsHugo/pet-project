import { PermissionError } from './errors';
import async = require("async");
import mongoose = require('mongoose')
import express = require('express')
import { Factory } from './models/index';
type clb = (err: any, data?: any) => any

export function send(req: express.Request, res: express.Response, dataFunction: clb | Object) {
    let sendData = (err, data) => {
        if (!err && !res) return this;
        if (err) {
            if (err.name == 'MongooseError') {
                res.sendStatus(500);
            } else {
                res.header('Title', 'Invalid Data');
                console.log(err);
                if (err instanceof mongoose.Error) {
                    res.header('Message', err.toString());
                } else {
                    res.header('Message', err.message);
                }
                res.send(400);
            }
        } else {
            res.json(data);
        }
    };
    if (dataFunction) {
        if (typeof (dataFunction) == 'function') {
            async.waterfall([
                function (callback) {
                    try {
                        dataFunction(callback);
                    } catch (ex) {
                        callback(ex, null);
                    }
                }
            ], sendData);
        } else {
            res.json(dataFunction);
        }
    } else {
        return sendData;
    }
}

export function sendNotAuthorized(req: express.Request, res: express.Response, profile: string) {
    //profile == 'web' ? res.redirect('login.html') : res.sendStatus(401);
    profile == 'web' ? res.redirect('login.ejs') : res.sendStatus(401);
}

export function generateCsvResponse(req: express.Request, res: express.Response, data: any) {
    res.header('content-type', 'text/csv');
    res.header('content-disposition', 'attachment; filename=products.csv');
    res.write(data);
    res.end();
}

export function requiresUserSession(profile: string) {
    return function (req, res, next) {
        if (!req.session.user) {
            sendNotAuthorized(req, res, profile);
        } else {
            next();
        }
    };
}

export type Clb<T> = (err: any, result: T) => any;

export function setClbSuccess<T>(callback: Clb<any>): (any) => Promise<T> {
    return function (result) {
        return new Promise<T>((resolve, reject) => {
            if (callback) {
                callback(null, result);
            }
            resolve(result);
        })
    }
}

export function setClbError<T>(callback: Clb<any>): (any) => Promise<T> {
    return function (reason) {
        return new Promise<T>((resolve, reject) => {
            if (callback) {
                callback(reason, null);
            }
            reject(reason);
        })
    }
}

export function validatesId(req, res, next) {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        next();
    } else {
        res.sendStatus(400);
    }
}