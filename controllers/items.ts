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
    @get("/")
    getAllItems (req, res){
        return this.svc.getAll();
    }

    @post("/")
    createItem(req, res){
        return this.svc.createAndSave(req.body);
    }

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

    @get("/:id")
    getById(req, res){
        res.send({Life: "life"});
    }

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