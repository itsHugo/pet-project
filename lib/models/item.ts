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

/**
 * Replaces spaces with a '.*' to increase matches for the search
 * 
 * @param search string
 */
function searchifyString(search: string){
    return search.replace(" ", ".*");
}

export class ItemService extends BaseService<Item>{
    async search(filters, pagePreferences?: number, page?: number, callback?: Clb<Item[]>) {
        let searchString = filters.filter || "";
        
        var q = this.model.find({}).where('IsDeleted').in([false, null, undefined])
                .populate({path: "Categories", select: "Name _id"})
                .populate({path: "CreatedBy", select: "_id FirstName LastName Email"})
        q = this._setSearchFilter(q, searchString);

        if (pagePreferences && page) {
            q = q.skip((page - 1) * pagePreferences).limit(Number(pagePreferences));
        }
        return q.sort('-DateModified').exec(callback);
    }
    _setSearchFilter(q: mongoose.DocumentQuery<Item[], Item>, searchString) {
        if (searchString) {
            var filter = new RegExp('.*' + searchifyString(searchString.toLowerCase()) + '.*', 'i')
            q = q.or([{ 'Title': filter }, {'Description': filter} ])
        }
        return q;
    }
    ItemExists(title: string, callback?: Clb<Item>) {
        return this.model.findOne({ Title: title }).exec(callback);
    }

    ItemsByUser(id, callback?: Clb<Item>){
        return this.model.find({}).where("CreatedBy", id);
    }

    byId(id: Id, callback?: Clb<Item>): Promise<Item>{
        return this.model.findById(id).populate({path: "Categories", select: "Name _id"} ).populate({path: "CreatedBy", select: "_id FirstName LastName Email"}).exec(callback);
    }

    getAll(callback?: Clb<Item[]>): Promise<Item[]>{
        return this.model.find({}).sort('-DateModified').populate({path: "Categories", select: "Name _id"}).populate({path: "CreatedBy", select: "_id FirstName LastName Email"}).exec(callback);
    }

    getCount(filters?,callback?: Clb<Item>): Promise<number>{
        
        let searchString = filters.filter || "";
        var q = this.model.find({});
        q = this._setSearchFilter(q, searchString);

        return q.count().exec(callback);
    }

    ItemsByCategory(id, pagePreferences?: number, page?: number, callback?: Clb<Item>): Promise<Item[]>{
        var q = this.model.find({}).in("Categories", [id]).populate({
            path: 'Categories'
        }).sort('-DateModified');

        if (pagePreferences && page) {
            q = q.skip((page - 1) * pagePreferences).limit(Number(pagePreferences));
        }
        
        return q.exec(callback);
    }

    perCategoryCount(id, callback?: Clb<Item>): Promise<number>{
        return this.model.find({}).in("Categories", [id]).count().exec(callback);
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