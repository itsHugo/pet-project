import { BaseDocument, BaseModel } from '../models/baseModel';
export { CCService, Clb, ObjectId, Id } from 'ccd-mongo'
import { CCService, Clb, ObjectId, Id } from 'ccd-mongo'

export class BaseService<T extends BaseDocument> extends CCService<T>{
    model: BaseModel<T>
}
