import * as ccd from 'ccd'
import { CategoryService, Category } from "./../../lib/models/category";
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
 * Application level controller which handles processing requests and rendering/redirecting
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

        let categories = await getAllCategoriesAlphabetically();

        // //Pagination logic
        var count = await this.svc.getCount({filter: ""});
        var pagination = paginate(req, count, "/items/");

        //Searching for all Items within the pagination options
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

        var categories = await getAllCategories();

        let item = await this.svc.byId(req.params.id);

        res.render("item.ejs", { item: item, categories: categories });

        return CustomResponces.DO_NOTHING;
    }

    /**
     * Renders the items page with all items based on the category
     * @param req Request
     * @param res Response
     */
    @get("/category/:id")
    async getByCategory(req, res) {

        //Get all the categories because the page needs it for the create Item form
        var categories = await getAllCategoriesAlphabetically();

        console.log('Categories: ' + categories[0]._id);
        
        //Pagination logic
        var count = await this.svc.perCategoryCount(req.params.id);
        var pagination = paginate(req, count, "/items/category/" + req.params.id);
        console.log("///Pagination Json")
        console.log(pagination);
        
        //Searching by category within the pagination options
        var items = await this.svc.ItemsByCategory(req.params.id, pagination.perPage, pagination.page);
        res.render('items.ejs',{
                items: items, 
                categories: categories,
                categoryId: req.params.id,
                pagination: pagination    
            });
        return CustomResponces.DO_NOTHING;

    }

    /**
     * Handles requests to create an item
     * 
     * @param req Request
     * @param res Response
     */
    @post("/", webSessionCheck)
    async createItem(req, res) {
 
        req.body.Image = "";
        // Set Image name string
        if (req.files && req.files.length > 0){
            let originalFileName: string = req.files[0].filename.toLocaleLowerCase();
            if (originalFileName.endsWith('.jpg') || originalFileName.endsWith('.png') || originalFileName.endsWith('.jpeg') || originalFileName.endsWith('.gif')) {
                req.body.Image = req.files[0].filename || "";
            }   
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
            res.render('error.ejs', {error: reason});
        });
        // Return a message instead?
        return CustomResponces.DO_NOTHING;
    }

    /**
     * Handles the requests to delete an item
     * @param req Request
     * @param res Response
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

    /**
     * Handles the requests to update an Item
     * @param req Request
     * @param res Response
     */
    @post("/:id", webSessionCheck)
    async updateItem(req, res) {

        let item = await this.svc.byId(req.params.id);

        if (checkPoster(item, req)) {
            let data = req.body;
            data.CreatedBy = req.session.user;
            validators.validateItem(data).then((value)=>{
                this.svc.updateById(req.params.id, data);
                res.redirect("back");
            }).catch((reason)=>{
                res.render("error.ejs",{ error: reason })
            })
            return CustomResponces.DO_NOTHING;
            
        } else {
            res.status(401).send({ status: "error", message: "You are not authorized to perform this action" });
        }

    }

    @post("/:id/image")
    async updateImage(req, res){
        let item = await this.svc.byId(req.params.id);
        if (checkPoster(item, req)){
            // Set Image name string
            req.body.Image = "";
            //if the file exists
            if (req.files && req.files.length > 0){
                let originalFileName: string = req.files[0].filename.toLocaleLowerCase();
                if (originalFileName.endsWith('.jpg') || originalFileName.endsWith('.png') || originalFileName.endsWith('.jpeg') || originalFileName.endsWith('.gif')) {
                    req.body.Image = req.files[0].filename || "";
                    //Remove the original
                    deleteImage(item);
                    this.svc.updateById(req.params.id, {Image: req.body.Image});
                }
            }

            res.redirect("back");
            return CustomResponces.DO_NOTHING;
            

        }else {
            res.status(401).send({ status: "error", message: "You are not authorized to perform this action" });
        }
    }

}

/**
 * Validates if the Item belongs to the User
 * @param item Item
 * @param req Request
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

/**
 * Fetches all the categories in the database
 * 
 * @return Promise<Category[]>
 */
function getAllCategories(): Promise<Category[]>{
    let catService = new CategoryService("Category");
    return catService.getAll();

}

/**
 * Fetches all the categories in the database
 * 
 * @return Promise<Category[]>
 */
function getAllCategoriesAlphabetically(): Promise<Category[]>{
    let catService = new CategoryService("Category");
    return catService.getAllAlphabetically();

}

export let controller = new ItemsClientController(Factory.Item, Router());
