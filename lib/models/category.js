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
const MODEL = 'Category';
class CategoryService extends baseService_1.BaseService {
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
            q = q.or([{ 'Name': filter }]);
        }
        return q;
    }
    userExists(name, callback) {
        return this.model.findOne({ Name: name }).exec(callback);
    }
    deleteById(id, callback) {
        return this.updateById(id, { IsDeleted: true }, callback);
    }
}
exports.CategoryService = CategoryService;
var categorySchema = new mongoose.Schema({
    Name: String,
}, { collection: 'categories' });
categorySchema.plugin(timestampsPlugin_js_1.default);
exports.CategoryModel = mongoose.model(MODEL, categorySchema);
exports.default = new CategoryService(MODEL);
//# sourceMappingURL=category.js.map