import { PermissionError } from '../errors';
import { CategoryModel } from "./category";
import { Category } from "./category";
import { BaseDocument } from './baseModel';
import * as mongoose from 'mongoose'
import timestampsPlugin from '../timestampsPlugin.js'
import createdByPlugin from '../createdByPlugin.js'
import categoriesPlugin from '../categoriesPlugin.js'
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
            q = q.or([{ 'FirstName': filter }, { 'LastName': filter }, { 'Email': filter }])
        }
        return q;
    }
    ItemExists(title: string, callback?: Clb<Item>) {
        return this.model.findOne({ Title: title }).exec(callback);
    }

    CategoryExist(title: string, callback?: Clb<Item>){
        return CategoryModel.findOne({_id: title}, function(err, cat){
            if(cat)
                return true;
            else
                return false;
        })
    }

}

export interface Item extends BaseDocument {
    Title: string
    Description: string
    Price: number
    Image: string
    Categories: [ Id | Category ]
}

var ItemSchema = new mongoose.Schema({
    Title: String,
    Description: String,
    Price: Number,
    Image: String,
    Categories: [ {type: mongoose.SchemaTypes.ObjectId, ref: 'Category' } ]
}, { collection: 'items' });
ItemSchema.plugin(timestampsPlugin);
ItemSchema.plugin(createdByPlugin);
ItemSchema.plugin(categoriesPlugin);

export let ItemModel = mongoose.model(MODEL, ItemSchema);
export default new ItemService(MODEL)