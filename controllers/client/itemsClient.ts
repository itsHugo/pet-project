import * as ccd from 'ccd'
import { AbstractError } from "./../../lib/errors";
import { ItemService } from "./../../lib/models/item";

import { _PostRequest, _GetRequest, _PutRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router, User } from './../refs';
import * as http from "http";
import * as utils from '../../lib/utils'
import * as validators from '../../lib/validators'
import { Item } from "../../lib/models/item";
import * as request from 'request';
import { CustomResponces } from "../../lib/baseController";
import * as multer from 'multer';
import { paginate } from "./../../lib/paginationHelper"
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
    async getItemsPage(req, res) {

        let categories = null;

        await _GetRequest("http://localhost:3001/api/1/categories/").then(function (result) {
            categories = result;
        }).catch(function (err) {
            console.error("Error", err);
            throw new AbstractError("Sorry");
        })

        // //Pagination logic
        var count = await this.svc.getCount({filter: ""});
        var pagination = paginate(req, count, "/items/");

        let itemsArray = await this.svc.search({filter: ""}, pagination.perPage, pagination.page);
        res.render('items.ejs',{items: itemsArray, categories: categories, pagination: pagination});

        return CustomResponces.DO_NOTHING;
    }

    /**
     * Renders the Item page based on the Item ID
     * 
     * @param req 
     * @param res 
     */
    @get("/:id")
    async itemDetail(req, res) {

        var categories;

        await _GetRequest("http://localhost:3001/api/1/categories/").then(function (result) {
            categories = result;
        }).catch(function (err) {
            console.error("Error", err);
            throw new AbstractError("Sorry");
        })

        let item = await this.svc.byId(req.params.id);

        res.render("item.ejs", { item: item, categories: categories });

        return CustomResponces.DO_NOTHING;
    }

    @get("/category/:id")
    async getByCategory(req, res) {

        //Get all the categories because the page needs it for the create Item form
        var categories;

        await _GetRequest("http://localhost:3001/api/1/categories/").then(function(result){
            categories = result;
        }).catch(function(err){
            console.error("Error", err);
            return res.status(400).send("RIP");
        })

        console.log('Categories: ' + categories[0]._id);
        
        //Pagination logic
        var count = await this.svc.perCategoryCount(req.params.id);
        var pagination = paginate(req, count, "/items/category/" + req.params.id);

        var items = await this.svc.ItemsByCategory(req.params.id, pagination.perPage, pagination.page);
        res.render('items.ejs',{
                items: items, 
                categories: categories,
                categoryId: req.params.id,
                pagination: pagination    
            });
        return CustomResponces.DO_NOTHING;

    }

    @get("/users/:id")
    async getByUser(req, res) {
        await _GetRequest("http://localhost:3001/api/1/items/users/" + req.params.id).then(function (result) {
            console.log(result)
            return res.render("items.ejs", { items: result });
        }).catch(function (err) {
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
    async createItem(req, res) {
        let originalFileName: string = req.files[0].filename.toLocaleLowerCase();
        if (originalFileName.endsWith('.jpg') || originalFileName.endsWith('.png') || originalFileName.endsWith('.jpeg') || originalFileName.endsWith('.gif')) {

        // Set Image name string
        if (req.files && req.files.length > 0)
            req.body.Image = req.files[0].filename || "";
        else
            req.body.Image = "";
        }


        //Set the user
        req.body.CreatedBy = req.session.user;
        
        //Validate Item
        await validators.validateItem(req.body).then((item) => {
            console.log(item);
            this.svc.createAndSave(req.body);
            res.redirect("/items");
        }).catch((reason)=> {
            console.log(reason);
            res.redirect('items');
        });
        // Return a message instead?
        return CustomResponces.DO_NOTHING;
    }

    /**
     * Action to delete an item
     * Notes: Need to check for user
     * May want to implement a "isDeleted" field on Model
     *
     * @param req 
     * @param res 
     */
    @post("/:id/delete", webSessionCheck)
    async deleteItem(req, res) {
        let id = req.params.id;
        let item: Item = await this.svc.byId(req.params.id);
        // TODO: CheckPoster
        if (checkPoster(item, req)) {
            deleteImage(item);
            await this.svc.deleteById(id);
            
            console.log(req.path);
            
            //res.redirect('back');
            res.redirect("/items/");
        }
        else {
            res.status(401).send({ status: "error", message: "You are not the owner of this item." });
        }
    }

    @post("/:id", webSessionCheck)
    async updateItem(req, res) {
        let data = req.body;

        let item = await this.svc.byId(req.params.id);

        if (checkPoster(item, req)) {
            item = await this.svc.updateById(req.params.id, data);
            res.redirect("back");
        } else {
            res.status(401).send({ status: "error", message: "You are not authorized to perform this action" });
        }

    }

}

/**
 * Validates if the Item belongs to the User
 * @param item 
 * @param req 
 */
function checkPoster(item: Item, req) {
    let user: User = req.session.user;

    if (item.CreatedBy['_id'] == user._id) {
        return true;
    } else
        return false;
}

/**
 * Upload image from the request body to the fileserver. 
 * @param req Request
 */
function uploadImage(req) {
    // Upload image using multer
    upload;

    // Set Image name string
    req.body.Image = req.files[0].filename;
}

/**
 * Delete an image from the fileserver. 
 * @param item Item object
 */
function deleteImage(item) {
    fs.unlink("./uploads/" + item.Image, (err) => {
        if (err)
            console.log(err);
        console.log('successfully deleted image');
    });
}




async function getAllCategories() {
    var categories;

    await _GetRequest("http://localhost:3001/api/1/categories/").then(function (result) {
        console.log("////////////////////Fetching Categories - Results")
        console.log(result);
        return result;
    }).catch(function (err) {
        console.error("Error", err);
        throw new AbstractError("Sorry");
    })

}

export let controller = new ItemsClientController(Factory.Item, Router());
