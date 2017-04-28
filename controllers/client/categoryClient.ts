import * as ccd from 'ccd'
import { Category } from "./../../lib/models/category";
import { _PostRequest, _GetRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router } from './../refs';
import * as request from 'request'
import {CustomResponces} from "../../lib/baseController"
import * as helper from "./../../lib/requestHelper";

var apiUri = "http://localhost:3001/api/1/categories/";

/**
 * Application level controller which handles the task of send HTTP request to the RESTful API controllers
 * 
 */
export class CategoryClientController extends BaseController<Category>{


    @get("/")
    async getAllCategories(req, res){
        await _GetRequest(apiUri).then(function(result){
            console.log("//////////// Results " + result);
            res.render("categories.ejs", {categories : result});
            console.log("////////////////////////");
            
            return CustomResponces.DO_NOTHING;
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })
    }

    @post("/")
    async createCategory(req, res){
        
        await _PostRequest(apiUri, req.body).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
            console.log("////////////////////////");
            res.redirect('/categories');

            return CustomResponces.DO_NOTHING;
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })
    }
}

export let controller = new CategoryClientController(Factory.Category, Router());