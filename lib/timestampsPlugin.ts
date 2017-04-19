/// <reference path="../typings/index.d.ts" />
import * as mongoose from 'mongoose';
import * as _ from 'lodash'
export default function timestampsPlugin(schema:mongoose.Schema, options?:Object):void{
    let opt ={
        createdPath:"DateAdded",
        modifiedPath:"DateModified",
        useVirtual:false
    };
    opt = _.extend(opt, options||{});
    
    let fields = {}
        , createdPath = opt.createdPath
        , modifiedPath = opt.modifiedPath
        , useVirtual = opt.useVirtual
    // Add paths to schema if not present
    if (!schema.path(modifiedPath)) {
        fields[modifiedPath] = { type: Date }
    }

    if (useVirtual) {
        // Use the ObjectID for extracting the created time
        schema.virtual(createdPath).get(function () {
            return new Date(this._id.generationTime * 1000)
        })
    } else {
        if (!schema.path(createdPath)) {
            fields[createdPath] = {
                type: Date
                , default: Date.now
            }
        }
    }
    schema.add(fields)

    // Update the modified timestamp on save
    schema.pre('save', function (next) {
        this[modifiedPath] = new Date
        next()
    });
}
