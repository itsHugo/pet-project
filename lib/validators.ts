import crypto = require('crypto');
import errors from './errors';
import * as util from 'util';
import { User } from './models/user'
import { Item } from "./models/item";
import { Category } from "./models/category";

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

export function validateItem (item, callback?): Promise<Item>{
        return new Promise<Item>((resolve, reject)=>{
            var error = null;

            if (!item.Title){
                error = new errors.InvalidData("Title is required");
            }
            if(!item.Description){
                error = new errors.InvalidData("Description is required");
            }
            if (!item.Price || item.Price < 0 ){
                error = new errors.InvalidData("Price is required");
            }

            if (!item.CreatedBy){
                error = new errors.InvalidData("You need to be logged in");
            }

            if (!item.Categories || item.Categories.length <= 0){
                error = new errors.InvalidData("You need to choose a category");
            }
            if (callback)
                callback(error, item);
            
            if (error)
                reject(error);
            else
                resolve(item);

        })
}

export function validateCategory (category, callback?): Promise<Category>{
    return new Promise<Category>((resolve, reject)=> {
        var error = null;

        if (!category.Name)
            error = new errors.InvalidData("Name is required");

        if (callback)
            callback(error, category);

        if(error)
            reject(error);
        else
            resolve(category)
    })
}