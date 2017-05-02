import { BaseDocument } from './models/baseModel';
import * as ccd from 'ccd'
import { CCService } from 'ccd-mongo'
import * as express from 'express'
import * as mongoose from 'mongoose'
import { BaseService } from './services/baseService'
import { Factory } from './models/index'
import debug from '../config'
import errors from '../lib/errors'

export enum CustomResponces {
    DO_NOTHING = <any>'do_nothing'
}

export class BaseController<T extends BaseDocument> extends ccd.CCController {
    Factory = Factory
    constructor(public svc: BaseService<T>, router: express.IRouter) {
        super(router, debug)
    }
    senderFunction(res: express.Response, err: any, data: any) {
        if (err instanceof errors.Unauthorized) {
            res.status(401).send({ status: "error", message: err.message });
        } else if (err instanceof errors.InvalidData) {
            res.status(400).send({ status: "error", message: err.message });
        } else if (err instanceof errors.Permission) {
            res.status(403).send({ status: "error", message: err.message });
        } else if (data == CustomResponces.DO_NOTHING) {
            //do nothing
        }
        else super.senderFunction(res, err, data);
    }
}
