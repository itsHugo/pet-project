import * as ccd from 'ccd'
import { Category } from "./../../lib/models/category";
import { _PostRequest, _GetRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router } from './../refs';
import * as request from 'request'
import {CustomResponces} from "../../lib/baseController"
import * as helper from "./../../lib/requestHelper";

var apiUri = "http://localhost:3001/api/1/categories/";

export class CategoryClientController extends BaseController<Category>{


    @get("/")
    getAllCategories(req, res){
        _GetRequest(apiUri).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
            console.log("////////////////////////");
            //TODO RENDER, probably a Browser Category page

            return CustomResponces.DO_NOTHING;
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })
    }

    @post("/")
    createCategory(req, res){
        
        _PostRequest(apiUri, req.body).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
            console.log("////////////////////////");
            //TODO RENDER, probably a Browser Category page

            return CustomResponces.DO_NOTHING;
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })
    }
}

export let controller = new CategoryClientController(Factory.Category, Router());