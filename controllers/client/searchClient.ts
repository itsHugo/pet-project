import * as ccd from 'ccd'
import { AbstractError } from "./../../lib/errors";
import { ItemService } from "./../../lib/models/item";

import { _PostRequest, _GetRequest, _PutRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router, User } from './../refs';
import * as http from "http";
import { Item } from "../../lib/models/item";
import * as request from 'request'
import { CustomResponces } from "../../lib/baseController"
import { BaseService } from "../../lib/services/baseService";

import * as querystring from 'querystring';
import * as slug from 'slug'



/**
 * Application level controller which handles the task of send HTTP request to the RESTful API controllers and directing the data to the Views
 * 
 */
export class SearchClientController extends BaseController<Item>{

    svc: ItemService

    @get("/")
    empty(req, res){
        res.render("search.ejs", {items: []});
        return CustomResponces.DO_NOTHING;
    }

    @get("/val")
    process(req, res){
        var str = req.url.split('?')[1];
        var qs = querystring.parse(str);

        var filter = qs.search;

        var slug_str = slug(filter);


        res.redirect('/search/res/' + slug_str);
        return CustomResponces.DO_NOTHING;
    }

    @get("/res/:slug")
    async search(req, res){
        var search = (req.params.slug as string).replace("-", " ");
        var result = await this.svc.search({filter: search});
        
        res.render('search.ejs', {items: result});

    }

}



/**
 * Validation module to check if an item was created by the session user
 * @param item Item
 * @param req Request
 */
function checkUser(item: Item, req){
    let user: User = req.session.user;

    if(user == null){
        return false;
    }

    console.log("///////Currently in CheckUser");
    console.log(user);

    let itemUser: User = item.CreatedBy as User;
    console.log(itemUser)
    console.log("///////////////////////")
    if (itemUser._id == user._id) {
        return true;
    }else{
        return false;
    }
    
}

async function getAllCategories(){
    var categories;

        await _GetRequest("http://localhost:3001/api/1/categories/").then(function(result){
            console.log("////////////////////Fetching Categories - Results")
            console.log(result);
            return result;
        }).catch(function(err){
            console.error("Error", err);
            throw new AbstractError("Sorry");
        })

}


export let controller = new SearchClientController(Factory.Item, Router());
