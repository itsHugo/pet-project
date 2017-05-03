import * as ccd from 'ccd'
import { CategoryService } from "./../../lib/models/category";
import { Category } from "./../../lib/models/category";
import { _PostRequest, _GetRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router } from './../refs';
import * as request from 'request'
import {CustomResponces} from "../../lib/baseController"


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

    @post("/")
    createCategory(req, res){
        this.svc.createAndSave(req.body);
        res.redirect('categories');
        return CustomResponces.DO_NOTHING;
    }
}

export let controller = new CategoryClientController(Factory.Category, Router());