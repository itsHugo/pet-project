import { PermissionError, UnauthorizedError } from '../lib/errors';
import { BaseController, del, Factory, get, post, put, Router} from './refs';
import { Request, Response } from 'ccd';
import * as utils from '../lib/utils'
import * as validators from '../lib/validators'
import errors from '../lib/errors'
import { Category, CategoryService } from "../lib/models/category";


const apiSessionCheck = utils.requiresUserSession('api');

export class ItemsController extends BaseController<Category> {

    svc: CategoryService

    @get("/")
    getAll(req, res){
        return this.svc.getAll();
    }

    @get("/:id")
    getById(req, res){
        return this.svc.byId(req.params.id);
    }

    @put("/:id")
    updateById(req, res){
        return this.svc.updateById(req.params.id, req.body);
    }

    @del("/:id")
    deleteById(req, res){
        return this.svc.deleteById(req.params.id);
    }
    

}

export let controller = new ItemsController(Factory.Category, Router());