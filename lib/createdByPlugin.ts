import mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
// Plugin
export default function createdByPlugin (schema) {
  var fields = {}
    , createdBy = 'CreatedBy'

  // Add paths to schema if not present
  if (!schema.path(createdBy)) {
    fields[createdBy] = {type:ObjectId, ref:'User', default:null}
  }
  schema.add(fields)

  // Update the modified timestamp on save
  schema.pre('save', function (next) {
    next()
  });
}