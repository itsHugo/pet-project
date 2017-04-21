"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const refs_1 = require("./refs");
const utils = require("../lib/utils");
const apiSessionCheck = utils.requiresUserSession('api');
class ItemsController extends refs_1.BaseController {
    /**
     * Action to get all the Item instances
     * @param req
     * @param res
     */
    getAllItems(req, res) {
        return this.svc.getAll();
    }
    /**
     * Action to create an Item
     * @param req
     * @param res
     */
    createItem(req, res) {
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
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let item = yield this.svc.byId(req.params.id);
            // TODO: CheckPoster
            if (checkPoster(item, req)) {
                return this.svc.deleteById(id);
            }
            else {
                res.send(401, { status: "error", message: "You are not authorized to perform this action" });
            }
        });
    }
    /**
     * Action to update an Item
     * Notes: Need to check for user
     * @param req
     * @param res
     */
    updateItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            //TODO: Implement checkPoster
            let item = yield this.svc.byId(req.params.id);
            if (checkPoster(item, req)) {
                return this.svc.updateById(req.params.id, req.body);
            }
            else {
                res.send(401, { status: "error", message: "You are not authorized to perform this action" });
            }
            // return this.svc.updateById(id, req.body);
        });
    }
    /**
     * Action to get an item by id
     * @param req
     * @param res
     */
    getById(req, res) {
        return this.svc.byId(req.params.id);
    }
    /**
     * Gets all the items by a user
     * @param req
     * @param res
     */
    getByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getByUserId method: User id " + req.params.id);
            return yield this.svc.model.find({}).where("CreatedBy", req.params.id);
        });
    }
    /**
     * Action to get all items by Category
     * @param req
     * @param res
     */
    getByCatId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.svc.model.find({}).in("Categories", [req.params.id]).populate({
                path: 'Categories'
            });
        });
    }
}
__decorate([
    refs_1.get("/")
], ItemsController.prototype, "getAllItems", null);
__decorate([
    refs_1.post("/", apiSessionCheck)
], ItemsController.prototype, "createItem", null);
__decorate([
    refs_1.del("/:id")
], ItemsController.prototype, "deleteItem", null);
__decorate([
    refs_1.put("/:id")
], ItemsController.prototype, "updateItem", null);
__decorate([
    refs_1.get("/:id")
], ItemsController.prototype, "getById", null);
__decorate([
    refs_1.get("/user/:id")
], ItemsController.prototype, "getByUserId", null);
__decorate([
    refs_1.get("/category/:id")
], ItemsController.prototype, "getByCatId", null);
exports.ItemsController = ItemsController;
/**
 * Validates if the Item belongs to the User
 * @param item
 * @param req
 */
function checkPoster(item, req) {
    let user = req.session.user;
    console.log(user._id);
    if (item.CreatedBy == user || item.CreatedBy == user._id) {
        return true;
    }
    return false;
}
exports.controller = new ItemsController(refs_1.Factory.Item, refs_1.Router());
//# sourceMappingURL=items.js.map