import { PermissionError, UnauthorizedError } from '../lib/errors';
import { ItemService } from "./../lib/models/item";
import { Item } from "./../lib/models/item";
import { BaseController, del, Factory, get, post, put, Router, User, UserService } from './refs';
import { Request, Response } from 'ccd';
import * as utils from '../lib/utils'
import * as validators from '../lib/validators'
import errors from '../lib/errors'


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
    @post("/")
    createItem(req, res){
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
    async deleteItem(req, res){
        let id = req.params.id;
        let item: Item = await this.svc.byId(req.params.id);
        //TODO: CheckPoster
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
    @put("/:id", apiSessionCheck)
    async updateItem(req, res){
        let id = req.params.id;
        let item: Item = await this.svc.byId(req.params.id);
        //TODO: Implement checkPoster
        if (checkPoster(item, req)){
            return this.svc.updateById(req.params.id, req.body);
        }
        else{
            res.send(401, { status: "error", message: "You are not authorized to perform this action"});
        }
    }

    /**
     * Action to get an item by id
     * @param req 
     * @param res 
     */
    @get("/:id")
    getById(req, res){
        res.send({Life: "life"});
    }

    /**
     * Action to get all items by Category
     * @param req 
     * @param res 
     */
    @get("/category/:category_id")
    getByCatId(req, res){
        res.send({Life: "life"});      
    }

}

function checkPoster(item: Item, req){
    let user = req.session.user;
    //TO DO
}

export let controller = new ItemsController(Factory.Item, Router());