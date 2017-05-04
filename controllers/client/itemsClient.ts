import * as ccd from 'ccd'
import { AbstractError } from "./../../lib/errors";
import { ItemService } from "./../../lib/models/item";

import { _PostRequest, _GetRequest, _PutRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router, User } from './../refs';
import * as http from "http";
import * as utils from '../../lib/utils'
import { Item } from "../../lib/models/item";
import * as request from 'request';
import { CustomResponces } from "../../lib/baseController";
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
    async getItemsPage(req, res) {

        var categories;

        await _GetRequest("http://localhost:3001/api/1/categories/").then(function (result) {
            console.log("////////////////////Fetching Categories - Results")
            console.log(result);
            categories = result;
        }).catch(function (err) {
            console.error("Error", err);
            return res.status(400).send("RIP");
        })

        let itemsArray = await this.svc.getAll();
        res.render('items.ejs', { items: itemsArray });
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
        let item = await this.svc.byId(req.params.id);

        res.render("item.ejs", { item: item });

        return CustomResponces.DO_NOTHING;
    }

    @get("/category/:id")
    async getByCategory(req, res) {

        var categories;

        await _GetRequest("http://localhost:3001/api/1/items/category/" + req.params.id).then(function (result) {
            console.log("//////////// Results " + result);
            console.log(result)
            console.log("////////////////////////");
            return res.render("items.ejs", { items: result, categories: categories });
        }).catch(function (err) {
            console.error("Error", err);
            return res.status(400).send("RIP");
        })
    }

    @get("/users/:id")
    async getByUser(req, res) {
        await _GetRequest("http://localhost:3001/api/1/items/users/" + req.params.id).then(function (result) {
            console.log("//////////// Results " + result);
            console.log(result)
            console.log("////////////////////////");
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

            let extensionName = originalFileName.slice(originalFileName.lastIndexOf('.'));
            console.log(extensionName);

            //req.files[0].filename = await Date.now().toString() + extensionName;
            console.log(req.files[0].filename);

            console.log(req.body.Image);

            uploadImage(req);

            if (req.body.CreatedBy) {
                //DO NOTHING
            } else {
                req.body.CreatedBy = req.session.user;
            }

            let item: Item = await this.svc.createAndSave(req.body);

            res.redirect("/items/" + item._id);
        } else {
            res.redirect("/items");
        }

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
            res.redirect('back');
        }
        else {
            res.status(401).send({ status: "error", message: "You are not the owner of this item." });
        }
    }

    @post("/:id")
    async updateItem(req, res) {
        let data = req.body;

        let item = await this.svc.byId(req.params.id);

        if (checkPoster(item, req)) {
            item = await this.svc.updateById(req.params.id, data);
            res.redirect("items/" + req.params.id);
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
