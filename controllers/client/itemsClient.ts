import * as ccd from 'ccd'

import { _PostRequest, _GetRequest, _PutRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router, User } from './../refs';
import * as http from "http";
import { Item } from "../../lib/models/item";
import * as request from 'request'
import {CustomResponces} from "../../lib/baseController"


/**
 * Application level controller which handles the task of send HTTP request to the RESTful API controllers and directing the data to the Views
 * 
 */
export class ItemsClientController extends BaseController<Item>{

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

        //Fetch all Items and pass Items and Categories
        await _GetRequest("http://localhost:3001/api/1/items/").then(function(result){
            console.log("//////////// Results " + result);
            res.render("items.ejs",{items: result, categories: categories});
            console.log("////////////////////////");
            return CustomResponces.DO_NOTHING;
             
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })
        
    }

    /**
     * Renders the Item page based on the Item ID
     * 
     * @param req 
     * @param res 
     */
    @get("/:id")
    async itemDetail(req, res){
        await _GetRequest("http://localhost:3001/api/1/items/" + req.params.id).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
            console.log("LOL");
            console.log("////////////////////////");
            return res.render("item.ejs",{item: result});
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })

        //res.render("items.ejs");
    }

     @get("/category/:id")
    async getByCategory(req, res){
        await _GetRequest("http://localhost:3001/api/1/items/category/" + req.params.id).then(function(result){
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
     * 
     * @param req 
     * @param res 
     */
    @get("/user/:id")
    async getByUser(req, res){
        await _GetRequest("http://localhost:3001/api/1/items/user/" + req.params.id).then(function(result){
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
    @post("/")
    async createItem(req, res){
        let data = req.body;

        data.CreatedBy = req.session.user;


        await _PostRequest("http://localhost:3001/api/1/items/", data).then(function(result){
            console.log("//////////// Results " + result);
            res.render("items.ejs",{items: result});
            console.log("////////////////////////");
            return CustomResponces.DO_NOTHING;
             
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP, there was an error somewhere in your request.");
        })
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
     * NOT WORKING FOR NOW
     * Updates an Item
     * @param req 
     * @param res 
     */
    @post("/update/:id")
    async updateItem(req, res){
        let data = req.body;
        data.CreatedBy = req.session.user
        await _PutRequest("http://localhost:3001/api/1/items/" + req.params.id, data).then(function(result){
            
            console.log("//////////// Results ");
            console.log(result);
            res.redirect("back");
            return CustomResponces.DO_NOTHING;
        }).catch(function(err){
            return res.status(400).send("RIP");
        })
    }

    @put("/test")
    testValues(req, res){
        return res.send(req.body);
    }
    

}


   
export let controller = new ItemsClientController(Factory.Item, Router());
