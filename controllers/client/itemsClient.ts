import * as ccd from 'ccd'
import { BaseController, del, Factory, get, post, put, Router} from './../refs';
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
    async getAllItems(req, res){
        //let option = buildOption("GET", "/api/1/items/");
        
        //var hello = "lol";
        //console.log(hello);

        await _GetRequest("http://localhost:3001/api/1/items/").then(function(result){
            console.log("//////////// Results " + result);
            res.render("items.ejs",{items: result});
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
            return res.render("item.ejs",{item: {result}});
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

    @post("/test")
    async test(req, res){
        let data = {
	"Title": "Evil Stuff",
	"Description": "Drugs are bad okay?",
	"Price": 22,
	"Categories":  [
        { id:"58f8b48513d6172a7c23ba1b"},
        { id: "58f8b4a513d6172a7c23ba1c"}] 
        
    };
        await helper._PostRequest("http://localhost:3001/api/1/items/", data).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
            console.log("////////////////////////");
            return res.render("item.ejs",{item: result});
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

/**
 * GET Request Promise
 * @param uri 
 */
function _GetRequest(uri: string){
    
    return new Promise((resolve, reject) => {

        var body = "";
        
        request.get(uri)
        .on("data", function (chunck){
            console.log(chunck)
            body += chunck;
        })
        .on('end', function(response){
            let jsonObject = JSON.parse(body);
            //console.log(body);
            console.log (jsonObject);
            resolve(jsonObject);
        }).on("error", function(err){
            console.log(err);
            reject(err);
        })
    });
}


function __fixJson (data: JSON){
}

export let controller = new ItemsClientController(Factory.Item, Router());
