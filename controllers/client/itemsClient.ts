import * as ccd from 'ccd'
import { _PostRequest, _GetRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router, User } from './../refs';
import * as http from "http";
import { Item } from "../../lib/models/item";
import * as request from 'request'
import {CustomResponces} from "../../lib/baseController"
import * as helper from "./../../lib/requestHelper";
//import * as Promise from 'bluebird';


export class ItemsClientController extends BaseController<Item>{

    /**
     *
     * @param req 
     * @param res 
     */
    @get("/")
    async getItemsPage(req, res){
        //let option = buildOption("GET", "/api/1/items/");
        
        //var hello = "lol";
        //console.log(hello);

        //List of all categories
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
     * 
     * @param req 
     * @param res 
     */
    @get("/:id")
    async itemDetail(req, res){
        await _GetRequest("http://localhost:3001/api/1/items/" + req.params.id).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
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

    

}

/**
 * NOT USED FOR NOW
 * @param method 
 * @param path 
 */
function buildOption (method: string, path: string){
    return {
        host: "localhost",
        path: path,
        method: method,
        port: 3001

    };
}


function __fixJsonArray (data){
    for (var i = 0; i < data.length; i++){
        let str_date = data[i].DateAdded;
        let date = new Date(str_date);
        date[i].DateAdded = date;
        data[i].id = data[i]._id;
    }

    return data;
}

export let controller = new ItemsClientController(Factory.Item, Router());
