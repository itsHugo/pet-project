import { PermissionError } from '../errors';
import { BaseDocument } from './baseModel';
import * as mongoose from 'mongoose'
import timestampsPlugin from '../timestampsPlugin.js'
import createdByPlugin from '../createdByPlugin.js'
import EnumValues from '../enumValues'
import { BaseService, Clb, Id } from '../services/baseService'
let ObjectId = mongoose.Schema.Types.ObjectId;
const MODEL = 'Item'

export class ItemService extends BaseService<Item>{
    async search(filters, item: Item, pagePreferences?: number, page?: number, callback?: Clb<Item[]>) {
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
            q = q.or([{ 'Title': filter }, { 'Description': filter }, { 'Price': filter }])
        }
        return q;
    }
    ItemExists(title: string, callback?: Clb<Item>) {
        return this.model.findOne({ Title: title }).exec(callback);
    }
    deleteById(id: Id, callback?: Clb<Item>) {
        return this.updateById(id, { IsDeleted: true }, callback);
    }
}

export interface Item extends BaseDocument {
    Title: string
    Description: string
    Price: number
}

var ItemSchema = new mongoose.Schema({
    Title: String,
    Description: String,
    Price: Number,
}, { collection: 'Items' });
ItemSchema.plugin(timestampsPlugin);
ItemSchema.plugin(createdByPlugin);

export let ItemModel = mongoose.model(MODEL, ItemSchema);
export default new ItemService(MODEL)