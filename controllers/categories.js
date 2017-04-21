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
     * Action to fetch all category instances
     * @param req
     * @param res
     */
    getAll(req, res) {
        console.log(req.headers.host);
        return this.svc.getAll();
    }
    /**
     * Action to create a Category
     * @param req
     * @param res
     */
    createCategory(req, res) {
        return this.svc.createAndSave(req.body);
    }
    /**
     * Action to get a Category by id
     * @param req
     * @param res
     */
    getById(req, res) {
        return this.svc.byId(req.params.id);
    }
    /**
     * Update action
     *
     * Note: May want to restrict that action to admins only or not have this module all together
     * Need to discuss
     * For now, don't use.
     * @param req
     * @param res
     */
    updateById(req, res) {
        return this.svc.updateById(req.params.id, req.body);
    }
    /**
     * Delete action
     *
     * Note: Not sure we should allow to delete. May want to delete that delete module.
     * Need to discuss
     * For now, don't use.
     * @param req
     * @param res
     */
    deleteById(req, res) {
        //TODO Need to implement Delete
        return this.svc.deleteById(req.params.id);
    }
    testByValue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.svc.categoryExists(req.params.name);
        });
    }
}
__decorate([
    refs_1.get("/")
], ItemsController.prototype, "getAll", null);
__decorate([
    refs_1.post('/')
], ItemsController.prototype, "createCategory", null);
__decorate([
    refs_1.get("/:id")
], ItemsController.prototype, "getById", null);
__decorate([
    refs_1.put("/:id")
], ItemsController.prototype, "updateById", null);
__decorate([
    refs_1.del("/:id")
], ItemsController.prototype, "deleteById", null);
__decorate([
    refs_1.get("/test/:name")
], ItemsController.prototype, "testByValue", null);
exports.ItemsController = ItemsController;
exports.controller = new ItemsController(refs_1.Factory.Category, refs_1.Router());
//# sourceMappingURL=categories.js.map