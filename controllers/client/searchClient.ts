import * as ccd from 'ccd'
import { AbstractError } from "./../../lib/errors";
import { ItemService } from "./../../lib/models/item";

import { _PostRequest, _GetRequest, _PutRequest } from "./../../lib/requestHelper";
import { BaseController, del, Factory, get, post, put, Router, User } from './../refs';
import * as http from "http";
import { Item } from "../../lib/models/item";
import * as request from 'request'
import { CustomResponces } from "../../lib/baseController"
import { BaseService } from "../../lib/services/baseService";

import * as querystring from 'querystring';
import * as slug from 'slug'


/**
 * Application level controller which handles the task of send HTTP request to the RESTful API controllers and directing the data to the Views
 * 
 */
export class SearchClientController extends BaseController<Item>{

    svc: ItemService

    @get("/")
    empty(req, res){
        res.render("search.ejs", {items: [], slug: "", page: 1, perPage: 0, count: 0 });
        return CustomResponces.DO_NOTHING;
    }

    @get("/val")
    process(req, res){
        var str = req.url.split('?')[1];
        var qs = querystring.parse(str);

        var filter = qs.search;

        var slug_str = slug(filter);
        res.redirect('/search/res/' + slug_str + "?page=1&perPage=6");
        return CustomResponces.DO_NOTHING;
    }

    @get("/res/:slug")
    async search(req, res){

        var str = req.url.split('?')[1];
        var qs = querystring.parse(str);

        console.log("//////////////////// search query strinh logging");
        var perPage = qs.perPage || 6;
        var page = qs.page || 1;
        console.log("per page "  + perPage)
        console.log("page " + page);

        

        var search = (req.params.slug as string).replace("-", " ");
        var result = await this.svc.search({filter: search}, perPage, page);
        var count = await this.svc.getCount({filter: search});
        var pages = getTotalPages(count, qs.perPage);

        console.log("search " + search);
        console.log('count for results' + count)
        console.log('pages ' + pages);

        console.log ("//////////////////////////////");
        res.render('search.ejs', {
            items: result,
            slug: req.params.slug,
            page: page,
            perPage: perPage,
            pages: pages
        });

        return CustomResponces.DO_NOTHING;

    }

}


function getTotalPages (count: number, perPage){
    var total: number = count / perPage;
    return Math.ceil(total);
}


export let controller = new SearchClientController(Factory.Item, Router());
