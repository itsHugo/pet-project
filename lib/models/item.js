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
const createdByPlugin_js_1 = require("../createdByPlugin.js");
const baseService_1 = require("../services/baseService");
let ObjectId = mongoose.Schema.Types.ObjectId;
const MODEL = 'Item';
class ItemService extends baseService_1.BaseService {
    search(filters, item, pagePreferences, page, callback) {
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
            q = q.or([{ 'Title': filter }, { 'Description': filter }, { 'Price': filter }]);
        }
        return q;
    }
    ItemExists(title, callback) {
        return this.model.findOne({ Title: title }).exec(callback);
    }
    deleteById(id, callback) {
        return this.updateById(id, { IsDeleted: true }, callback);
    }
}
exports.ItemService = ItemService;
var ItemSchema = new mongoose.Schema({
    Title: String,
    Description: String,
    Price: Number,
}, { collection: 'Items' });
ItemSchema.plugin(timestampsPlugin_js_1.default);
ItemSchema.plugin(createdByPlugin_js_1.default);
exports.ItemModel = mongoose.model(MODEL, ItemSchema);
exports.default = new ItemService(MODEL);
//# sourceMappingURL=item.js.map