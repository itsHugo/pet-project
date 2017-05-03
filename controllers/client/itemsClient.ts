import * as ccd from 'ccd'
import { AbstractError } from "./../../lib/errors";
import { ItemService } from "./../../lib/models/item";

import { _PostRequest, _GetRequest, _PutRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router, User } from './../refs';
import * as http from "http";
import * as utils from '../../lib/utils'
import { Item } from "../../lib/models/item";
import * as request from 'request';
import {CustomResponces} from "../../lib/baseController";
import * as multer from 'multer';

let upload = multer().single('Image');

const fs = require('fs');
//import * as Promise from 'bluebird';

/**
 * Application level controller which handles the task of send HTTP request to the RESTful API controllers and directing the data to the Views
 * 
 */
const webSessionCheck = utils.requiresUserSession('web');
export class ItemsClientController extends BaseController<Item>{

    svc: ItemService

    /**
     * Renders the Items page
     * @param req 
     * @param res 
     */
    @get("/")
    async getItemsPage(req, res){
        
        var categories;

        await _GetRequest("http://localhost:3001/api/1/categories/").then(function(result){
            console.log("////////////////////Fetching Categories - Results")
            console.log(result);
            categories = result;
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })

        let itemsArray = await this.svc.getAll();
        res.render('items.ejs',{items: itemsArray});
        return CustomResponces.DO_NOTHING;
        
    }

    /**
     * Renders the Item page based on the Item ID
     * 
     * @param req 
     * @param res 
     */
    @get("/:id")
    async itemDetail(req, res){
        let item = await this.svc.byId(req.params.id);

        res.render("item.ejs", { item: item});
        
        return CustomResponces.DO_NOTHING;
    }

     @get("/category/:id")
    async getByCategory(req, res){

        var categories;

        await _GetRequest("http://localhost:3001/api/1/categories/").then(function(result){
            console.log("////////////////////Fetching Categories - Results")
            console.log(result);
            categories = result;
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })

        await _GetRequest("http://localhost:3001/api/1/items/category/" + req.params.id).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
            console.log("////////////////////////");
            return res.render("items.ejs",{items: result, categories: categories});
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })
    }

    @get("/users/:id")
    async getByUser(req, res){
        await _GetRequest("http://localhost:3001/api/1/items/users/" + req.params.id).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
            console.log("////////////////////////");
            return res.render("items.ejs",{items: result});
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })
    }



    /**
     * Creates an items
     * @param req 
     * @param res 
     */
    @post("/", webSessionCheck)
    async createItem(req, res){
        // Upload image using multer
        upload;

        // Set Image name string
        req.body.Image = req.files[0].filename;

        if(req.body.CreatedBy){
            //DO NOTHING
        }else{
            req.body.CreatedBy = req.session.user;
        }

        await this.svc.createAndSave(req.body);

        res.redirect("/items");

        // Return a message instead?
        return CustomResponces.DO_NOTHING;
    }

    /**
     * Dummy data testing
     * @param req 
     * @param res 
     */
    @post("/donothing")
    async doNothing(req, res){

        let user: User = req.session.user;
        let data = {
	        "Title": "Evil Stuff",
	        "Description": "Drugs are bad okay?",
	        "Price": 22,
            "CreatedBy": user,
	        "Categories":  [
                { _id:"58f8b48513d6172a7c23ba1b"},
                { _id: "58f8b4a513d6172a7c23ba1c"}
            ] 
        
         };

        await _PostRequest("http://localhost:3001/api/1/items/",data).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
            console.log("////////////////////////");
            return res.redirect("http://localhost:3001/");
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })

    }

    /**
     * Action to delete an item
     * Notes: Need to check for user
     * May want to implement a "isDeleted" field on Model
     *
     * @param req 
     * @param res 
     */
    @del("/:id", webSessionCheck)
    async deleteItem(req, res) {
        let id = req.params.id;
        let item: Item = await this.svc.byId(req.params.id);
        // TODO: CheckPoster
        if (checkPoster(item, req)) {
            fs.unlink("/uploads/" + item.Image, (err) => {
                if (err) 
                    throw err;
                console.log('successfully deleted image');
            });
            return this.svc.deleteById(id);
        }
        else {
            res.status(401).send({ status: "error", message: "You are not authorized to perform this action" });
        }
    }

    @put("/:id")
    async updateItem(req, res){
        let data = req.body;
        data.CreatedBy = req.session.user;

        let item = await this.svc.byId(req.params.id);
        
        if(checkPoster(item, req)){
            console.log("Request body in update ////////////")
            console.log(req.body);
        
            await _PutRequest("http://localhost:3001/api/1/items/" + req.params.id, data).then(function(result){
            
                console.log("//////////// Results");
                console.log(result);
                res.redirect("back");
                return CustomResponces.DO_NOTHING;
            }).catch(function(err){
                return res.status(400).send("RIP");
            })   

        }else{
            res.status(401).send({status: "error", message: "You are not authorized to perform this action" });
        }

    }

}

/**
 * Validates if the Item belongs to the User
 * @param item 
 * @param req 
 */
function checkPoster(item: Item, req) {
    let user = req.session.user;
    console.log(user._id);
    if (item.CreatedBy == user || item.CreatedBy == user._id) {
        return true;
    }
    return false;
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
   
export let controller = new ItemsClientController(Factory.Item, Router());
