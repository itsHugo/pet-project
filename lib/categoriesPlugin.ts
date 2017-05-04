import mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
// Plugin
export default function categoriesPlugin (schema) {
  var fields = {}
    , category = 'Category'

  // Add paths to schema if not present
  if (!schema.path(category)) {
    fields[category] = [{type:ObjectId, ref:'Categories', default:null}]
  }
  schema.add(fields)

  // Update the modified timestamp on save
  schema.pre('save', function (next) {
    next()
  });
}