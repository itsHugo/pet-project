import { User } from './user';
import { Id } from 'ccd-mongo';
import * as mongoose from 'mongoose';

export interface BaseDocument extends mongoose.Document {
    id: string
    CreatedBy: Id | User
    DateAdded: Date
    DateModified: Date
}

export interface BaseModel<T extends BaseDocument> extends mongoose.Model<T> {

}