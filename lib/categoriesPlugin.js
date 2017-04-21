"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let ObjectId = mongoose.Schema.Types.ObjectId;
// Plugin
function categoriesPlugin(schema) {
    var fields = {}, categories = 'Categories';
    // Add paths to schema if not present
    if (!schema.path(categories)) {
        fields[categories] = [{ type: ObjectId, ref: 'User', default: null }];
    }
    schema.add(fields);
    // Update the modified timestamp on save
    schema.pre('save', function (next) {
        next();
    });
}
exports.default = categoriesPlugin;
//# sourceMappingURL=categoriesPlugin.js.map