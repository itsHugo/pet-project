import * as ccd from 'ccd'
import { BaseController, del, Factory, get, post, put, Router} from './../refs';
import * as http from "http";
import { Item } from "../../lib/models/item";
import * as request from 'request'
import {CustomResponces} from "../../lib/baseController"
//import * as Promise from 'bluebird';


export class ItemsClientController extends BaseController<Item>{

    /**
     * DOES NOT FUNCTION
     * @param req 
     * @param res 
     */
    @get("/")
    async getAllDetails(req, res){
        //let option = buildOption("GET", "/api/1/items/");
        
        
        await _GetRequest("http://localhost:3001/api/1/items/").then(function(result){
            console.log("//////////// Results " + result);
            res.render("item.ejs",{items: result});
            return CustomResponces.DO_NOTHING;
             
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })
        
    }

    /**
     * WORKS!!!!!
     * @param req 
     * @param res 
     */
    @get("/:id")
    async itemDetail(req, res){
        await _GetRequest("http://localhost:3001/api/1/items/" + req.params.id).then(function(result){
            console.log("//////////// Results " + result);
            console.log (result)
            console.log("LOL");
            return res.render("item.ejs",{item: result});
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })

        //res.render("items.ejs");
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

export let controller = new ItemsClientController(Factory.Item, Router());
