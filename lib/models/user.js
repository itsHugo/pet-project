"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const timestampsPlugin_js_1 = require("../timestampsPlugin.js");
const baseService_1 = require("../services/baseService");
let ObjectId = mongoose.Schema.Types.ObjectId;
const MODEL = 'User';
class UserService extends baseService_1.BaseService {
    search(filters, user, pagePreferences, page, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let searchString = filters.filter || "";
            let roleType = filters.roleType;
            var q = this.model.find({}).where('IsDeleted').in([false, null]);
            q = this._setSearchFilter(q, searchString);
            if (pagePreferences && page) {
                q = q.skip((page - 1) * pagePreferences).limit(Number(pagePreferences));
            }
            return q.exec(callback);
        });
    }
    _setSearchFilter(q, searchString) {
        if (searchString) {
            var filter = new RegExp('.*' + searchString.toLowerCase() + '.*', 'i');
            q = q.or([{ 'FirstName': filter }, { 'LastName': filter }, { 'Email': filter }]);
        }
        return q;
    }
    userExists(email, callback) {
        return this.model.findOne({ Email: email }).exec(callback);
    }
    deleteById(id, callback) {
        return this.updateById(id, { IsDeleted: true }, callback);
    }
    login(email, password, callback) {
        var q = this.model.findOneAndUpdate({ Email: email, Password: password }, { LastLoginDate: new Date() });
        return q.exec(callback).then(result => {
            return result;
        }, reason => {
            throw reason;
        });
    }
    items(id, callback) {
        return this.model.findById(id).select("Items").exec(callback);
    }
    allItems(callback) {
        return this.model.find().select("Items").exec(callback);
    }
}
exports.UserService = UserService;
//  // Unsure for nesting documents
// var categorySchema = new mongoose.Schema({
//     Name: String,
// }, { collection: 'categories' });
// categorySchema.plugin(timestampsPlugin);
// var ItemSchema = new mongoose.Schema({
//     Title: String,
//     Description: String,
//     Price: Number,
//     Category: {Name: String},
// }, { collection: 'Items' });
// ItemSchema.plugin(timestampsPlugin);
// // End of unsure part
var userSchema = new mongoose.Schema({
    Email: String,
    FirstName: String,
    LastName: String,
    Password: String,
    Items: [{
            Title: String,
            Description: String,
            Price: Number,
            Category: { Name: String },
        }],
}, { collection: 'users' });
userSchema.plugin(timestampsPlugin_js_1.default);
exports.UserModel = mongoose.model(MODEL, userSchema);
exports.default = new UserService(MODEL);
//# sourceMappingURL=user.js.map