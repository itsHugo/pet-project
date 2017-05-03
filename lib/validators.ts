import crypto = require('crypto');
import errors from './errors';
import * as util from 'util';
import { User } from './models/user'
import { Item } from "./models/item";

export function validatePasswordAndCreateHash(password, callback?): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (password) {
            if (password.length >= 5) {
                let hashed = crypto.createHash('md5').update(password).digest("hex");
                if (callback)
                    callback(null, hashed);
                resolve(hashed);
            } else {
                let err = new errors.InvalidData("Password must be at least 5 letters")
                if (callback)
                    callback(err, null);
                reject(err);
            }
        } else {
            let err = new errors.InvalidData("No Password Provided")
            if (callback)
                callback(err, null);
            reject(err);
        }
    })
}


export function validateAutoLoginData(data, callback) {
    if (!data.Id) {
        console.log("invalid data on autologin:" + util.inspect(data));
        callback(new errors.InvalidData("Invalid Parameters"), null);
    }
}

export function validateUser(user, callback?): Promise<User> {
    return new Promise<User>((resolve, reject) => {
        var error = null;
        var result = {};
        if (!user.Email) {
            error = new errors.InvalidData("Email is required");
        } else if (!user.FirstName) {
            error = new errors.InvalidData("Name is required");
        } else if (!user.LastName) {
            error = new errors.InvalidData('Lastname is required');
        }
        if (callback)
            callback(error, user);

        if (error)
            reject(error)
        else
            resolve(user)

    })
}

export function validateItem (item, callback): Promise<Item>{
        return new Promise<Item>((resolve, reject)=>{
            var error = null;
            var result = {};

            if (!item.Title){
                error = new errors.InvalidData("Title is required");
            }
            if(!item.Description){
                error = new errors.InvalidData("Description is required");
            }
            if (!item.Price){
                error = new errors.InvalidData("Description is required");
            }
            if (callback)
                callback(error, item);
            
            if (error)
                reject(error);
            else
                resolve(item);

        })
}