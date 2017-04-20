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
    getAll(){

    }

    @get("/:id")
    getById(){
        
    }

    @put("/:id")
    updateById(){

    }

    @del("/:id")
    deleteById(){
        
    }
    

}

export let controller = new ItemsController(Factory.Category, Router());