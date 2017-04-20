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
        res.json({Life: "life"});
    }

    @post("/")
    createItem(req, res){
        this.svc.createAndSave(req.body);
    }

    @del("/:id", apiSessionCheck)
    deleteItem(req, res){
        res.send({Life: "life"});
    }

    @put("/:id", apiSessionCheck)
    updateItem(req, res){
        res.send({Life: "life"});
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

export let controller = new ItemsController(Factory.Item, Router());