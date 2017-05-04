import * as ccd from 'ccd'
import { CategoryService } from "./../../lib/models/category";
import { Category } from "./../../lib/models/category";
import { _PostRequest, _GetRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router } from './../refs';
import * as request from 'request'
import {CustomResponces} from "../../lib/baseController"
import * as utils from '../../lib/utils'
import errors from './../../lib/errors';

const webSessionCheck = utils.requiresUserSession('web');

/**
 * Application level controller which handles the task of send HTTP request to the RESTful API controllers
 * 
 */
export class CategoryClientController extends BaseController<Category>{

    svc: CategoryService
    @get("/")
    async getAllCategories(req, res){
        res.render("categories", {categories : await this.svc.getAllAlphabetically()});
        return CustomResponces.DO_NOTHING;
    }

    @post("/", webSessionCheck)
    createCategory(req, res){
        if (!req.body.Name){
            res.render('error.ejs', {error: new errors.InvalidData("Name is required for the creation of the Category")})
        }else{
            this.svc.createAndSave(req.body);
            res.redirect('categories');
        }   
        return CustomResponces.DO_NOTHING;
    }
}

export let controller = new CategoryClientController(Factory.Category, Router());