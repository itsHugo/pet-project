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

import {CustomResponces} from '../lib/baseController';

let upload = multer().single('itemProfile');


const apiSessionCheck = utils.requiresUserSession('api');

export class ItemsController extends BaseController<Item> {

    svc: ItemService

    /**
     * Action to get all the Item instances
     * @param req 
     * @param res 
     */
    @get("/")
    async getAllItems (req, res){
        /*
        return this.svc.getAll();
        */
        var itemsArray = await this.svc.getAll();
        res.render('items.ejs',{items: itemsArray});
        return CustomResponces.DO_NOTHING;
    }

    /**
     * Action to create an Item
     * @param req 
     * @param res 
     */
    //@post("/", apiSessionCheck)
    @post("/")
    createItem(req, res){
        if (req.body.Categories){
           let arr = req.body.Categories;
           for (let i: number = 0; i < arr.length; i++){
               if(this.svc.CategoryExist(arr[i]))
                {
                    
                }
           } 
        }
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
    @del("/:id")
    async deleteItem(req, res){
        let id = req.params.id;
        let item: Item = await this.svc.byId(req.params.id);
        // TODO: CheckPoster
        if (checkPoster(item, req)){
            return this.svc.deleteById(id);
        }
        else{
            res.send(401, { status: "error", message: "You are not authorized to perform this action"});
        }
    }

    /**
     * Action to update an Item
     * Notes: Need to check for user
     * @param req 
     * @param res 
     */
    @put("/:id")
    async updateItem(req, res){
        let id = req.params.id;
        
        //TODO: Implement checkPoster
        let item: Item = await this.svc.byId(req.params.id);
        if (checkPoster(item, req)){
            return this.svc.updateById(req.params.id, req.body);
        }
        else{
            res.send(401, { status: "error", message: "You are not authorized to perform this action"});
        }

        // return this.svc.updateById(id, req.body);
    }

    /**
     * Action to get an item by id
     * @param req 
     * @param res 
     */
    @get("/:id")
    getById(req, res){
        return this.svc.byId(req.params.id);
    }

    /**
     * Gets all the items by a user
     * @param req 
     * @param res 
     */
    @get("/user/:id")
    async getByUserId(req, res){
        console.log("getByUserId method: User id " + req.params.id);
        return await this.svc.ItemsByUser(req.params.id);
    }

    /**
     * Action to get all items by Category
     * @param req 
     * @param res 
     */
    @get("/category/:id")
    async getByCatId(req, res){
        return await this.svc.model.find({}).in("Categories", [req.params.id]).populate({
            path: 'Categories'
        }) 
    }

    @post("/:id/photo/")
    async uploadPhoto(req, res){

        let item: Item = await this.svc.byId(req.params.id);
        if (item){
            upload(req, res, function(err){
                if (err){
                    console.log(err.message);
                    return;
                }
                else{
                    console.log("File Uploaded");
                    console.log(req.files[0].filename);

                    item.Image = req.files[0].filename;
                    
                    return item.save();
                }

            })   
        }else{
            res.send(401, { status: "error", message: "You are not authorized to perform this action"});
        }
    }

    

}

/**
 * Validates if the Item belongs to the User
 * @param item 
 * @param req 
 */
function checkPoster(item: Item, req){ 
    let user = req.session.user;
    console.log(user._id);
    if (item.CreatedBy == user || item.CreatedBy == user._id){
        return true;
    }
    return false;
}

export let controller = new ItemsController(Factory.Item, Router());