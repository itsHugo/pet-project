import { get, CCController } from "ccd";
import { CustomResponces } from "./../../lib/baseController";
import { Router } from "../refs";

export class OthersController extends CCController{
    @get("/")
    map(req, res){
        res.render("map.ejs");
        return CustomResponces.DO_NOTHING;
    }

    @get("/help")
    help(req, res){
        res.render("help.ejs");
        return CustomResponces.DO_NOTHING;
    }

    @get("/about")
    about(req, res){
        res.render("about.ejs");
        return CustomResponces.DO_NOTHING;
    }
}

export let controller = new OthersController(Router());