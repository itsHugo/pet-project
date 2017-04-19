"use strict";
const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
// Plugin
function createdByPlugin(schema) {
    var fields = {}, createdBy = 'CreatedBy';
    // Add paths to schema if not present
    if (!schema.path(createdBy)) {
        fields[createdBy] = { type: ObjectId, ref: 'User', default: null };
    }
    schema.add(fields);
    // Update the modified timestamp on save
    schema.pre('save', function (next) {
        next();
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createdByPlugin;
//# sourceMappingURL=createdByPlugin.js.map