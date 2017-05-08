import { PermissionError, UnauthorizedError } from '../lib/errors';
import { ItemService } from "./../lib/models/item";
import { Item } from "./../lib/models/item";
import { BaseController, del, Factory, get, post, put, Router, User, UserService } from './refs';
import { Request, Response } from 'ccd';
import * as utils from '../lib/utils'
import * as validators from '../lib/validators'
import errors from '../lib/errors'
import * as mongoose from 'mongoose'
import * as multer from 'multer'

import { CustomResponces } from '../lib/baseController';
const fs = require('fs');
let upload = multer().single('Image');


const apiSessionCheck = utils.requiresUserSession('api');

export class ItemsController extends BaseController<Item> {

    svc: ItemService

    /**
     * Action to get all the Item instances
     * @param req 
     * @param res 
     */
    @get("/")
    getAllItems (req, res){
        return this.svc.getAll();
    }

    /**
     * Action to create an Item
     * @param req 
     * @param res 
     */
    @post("/", apiSessionCheck)
    createItem(req, res){
        
        // Set Image name string
        if(req.files && req.files.length > 0)
            req.body.Image = req.files[0].filename;

        req.body.CreatedBy = req.session.user;
                
        return this.svc.createAndSave(req.body);
    }

    /**
     * Action to delete an item
     * Notes: Need to check for user
     * May want to implement a "isDeleted" field on Model
     *
     * @param req 
     * @param res 
     */
    @del("/:id", apiSessionCheck)
    async deleteItem(req, res) {
        let id = req.params.id;
        let item: Item = await this.svc.byId(req.params.id);
       
        if (checkPoster(item, req)) {
            deleteImage(item);
            return this.svc.deleteById(id);
        }
        else {
            res.send(401, { status: "error", message: "You are not authorized to perform this action" });
        }

        //return this.svc.deleteById(id);
    }

    /**
     * Action to update an Item
     * Notes: Need to check for user
     * @param req 
     * @param res 
     */
    @put("/:id", apiSessionCheck)
    async updateItem(req, res) {
        let id = req.params.id;

        let item: Item = await this.svc.byId(req.params.id);
        if (checkPoster(item, req)) {
            return this.svc.updateById(req.params.id, req.body);
        }
        else {
            res.send(401, { status: "error", message: "You are not authorized to perform this action" });
        }

    }

    /**
     * Action to get an item by id
     * @param req 
     * @param res 
     */
    @get("/:id")
    getById(req, res) {
        return this.svc.byId(req.params.id);
    }

    /**
     * Gets all the items by a user
     * @param req 
     * @param res 
     */
    @get("/users/:id")
    getByUserId(req, res) {
        return this.svc.ItemsByUser(req.params.id);
    }

    /**
     * Action to get all items by Category
     * @param req 
     * @param res 
     */
    @get("/category/:id")
    getByCatId(req, res) {
        // Add to model later 
        return this.svc.ItemsByCategory(req.params.id);
    }

    @post("/:id/photo/", apiSessionCheck)
    async uploadPhoto(req, res) {

        let item: Item = await this.svc.byId(req.params.id);
        if (item) {
            upload(req, res, function (err) {
                if (err) {
                    console.log(err.message);
                    return;
                }
                else {
                    console.log("File Uploaded");
                    console.log(req.files[0].filename);

                    item.Image = req.files[0].filename;

                    return item.save();
                }

            })
        } else {
            res.send(401, { status: "error", message: "You are not authorized to perform this action" });
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

export let controller = new ItemsController(Factory.Item, Router());