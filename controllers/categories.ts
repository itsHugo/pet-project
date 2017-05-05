import { PermissionError, UnauthorizedError } from '../lib/errors';
import { BaseController, del, Factory, get, post, put, Router} from './refs';
import { Request, Response } from 'ccd';
import * as utils from '../lib/utils'
import * as validators from '../lib/validators'
import errors from '../lib/errors'
import { Category, CategoryService } from "../lib/models/category";
import * as http from 'http'

const apiSessionCheck = utils.requiresUserSession('api');

export class ItemsController extends BaseController<Category> {

    svc: CategoryService

    /**
     * Action to fetch all category instances
     * @param req 
     * @param res 
     */
    @get("/")
    getAll(req, res){
        return this.svc.getAllAlphabetically();
    }

    /**
     * Action to create a Category
     * @param req 
     * @param res 
     */
    @post('/', apiSessionCheck)
    createCategory(req, res){
        return this.svc.createAndSave(req.body);
    }

    /**
     * Action to get a Category by id
     * @param req 
     * @param res 
     */
    @get("/:id")
    getById(req, res){
        return this.svc.byId(req.params.id);
    }

    /**
     * Update action
     * 
     * Note: May want to restrict that action to admins only or not have this module all together
     * Need to discuss
     * For now, don't use.
     * @param req 
     * @param res 
     */
    @put("/:id", apiSessionCheck)
    updateById(req, res){
        return this.svc.updateById(req.params.id, req.body);
    }

    /**
     * Delete action
     * 
     * Note: Not sure we should allow to delete. May want to delete that delete module.
     * Need to discuss
     * For now, don't use.
     * @param req 
     * @param res 
     */
    @del("/:id", apiSessionCheck)
    deleteById(req, res){
        //TODO Need to implement Delete
        return this.svc.deleteById(req.params.id);
    }

    @get("/test/:name")
    async testByValue(req, res){
        return await this.svc.categoryExists(req.params.name);
    }
    

}

export let controller = new ItemsController(Factory.Category, Router());