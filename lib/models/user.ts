import { PermissionError } from '../errors';
import { BaseDocument } from './baseModel';
import * as mongoose from 'mongoose'
import timestampsPlugin from '../timestampsPlugin.js'
import EnumValues from '../enumValues'
import { BaseService, Clb, Id } from '../services/baseService'
import {ItemModel} from './item';
let ObjectId = mongoose.Schema.Types.ObjectId;
const MODEL = 'User'

export class UserService extends BaseService<User>{
    async search(filters, user: User, pagePreferences?: number, page?: number, callback?: Clb<User[]>) {
        let searchString = filters.filter || "";
        let roleType = filters.roleType;
        var q = this.model.find({}).where('IsDeleted').in([false, null])
        q = this._setSearchFilter(q, searchString);

        if (pagePreferences && page) {
            q = q.skip((page - 1) * pagePreferences).limit(Number(pagePreferences));
        }
        return q.exec(callback);
    }
    _setSearchFilter(q, searchString) {
        if (searchString) {
            var filter = new RegExp('.*' + searchString.toLowerCase() + '.*', 'i')
            q = q.or([{ 'FirstName': filter }, { 'LastName': filter }, { 'Email': filter }])
        }
        return q;
    }
    userExists(email: string, callback?: Clb<User>) {
        return this.model.findOne({ Email: email }).exec(callback);
    }
    deleteById(id: Id, callback?: Clb<User>) {
        return this.updateById(id, { IsDeleted: true }, callback);
    }
    login(email: string, password: string, callback?: Clb<User>) {
        var q = this.model.findOneAndUpdate(
            { Email: email, Password: password },
            { LastLoginDate: new Date() });

        return q.exec(callback).then(result => {
            return result;
        }, reason => {
            throw reason;
        });
    }
    itemsByUser(id: Id, callback?: Clb<User>) {
        return ItemModel.find({CreatedBy: id}).exec(callback);
    }
}

export interface User extends BaseDocument {
    Email: string
    FirstName: string
    LastName: string
    Password: string
    Image: string
}

var userSchema = new mongoose.Schema({
    Email: String,
    FirstName: String,
    LastName: String,
    Password: String,
    Image: String,
}, { collection: 'users' });
userSchema.plugin(timestampsPlugin);

export let UserModel = mongoose.model(MODEL, userSchema);
export default new UserService(MODEL)