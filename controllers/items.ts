import { PermissionError, UnauthorizedError } from '../lib/errors';
import { Item } from "./../lib/models/item";
import { BaseController, del, Factory, get, post, put, Router, User, UserService } from './refs';
import { Request, Response } from 'ccd';
import * as utils from '../lib/utils'
import * as validators from '../lib/validators'
import errors from '../lib/errors'


const apiSessionCheck = utils.requiresUserSession('api');

export class ItemsController extends BaseController<Item> {

    @get("/")
    getAllItems (req, res){
    }

    @post("/")
    createItem(req, res){
    }

    @put("/:id")

    @get("/category/:category_id")
    getByCatId(req, res){      
    }

}

export let controller = new ItemsController(Factory.Item, Router());