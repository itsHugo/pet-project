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
const validators = require("../lib/validators");
const config_1 = require("./../config");
const apiSessionCheck = utils.requiresUserSession('api');
function checkIfMe(req, res, next) {
    if (req.session.user.id == req.params.id) {
        next();
    }
    else {
        utils.sendNotAuthorized(req, res, 'api');
    }
}
exports.checkIfMe = checkIfMe;
class UsersController extends refs_1.BaseController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.svc.search(req.query, req.session.user);
        });
    }
    view(req, res) {
        return this.svc.byId(req.params.id);
    }
    update(req, res) {
        return this.svc.updateById(req.params.id, req.body);
    }
    updatePhoto(req, res) {
        let id = req.params.id;
        let photoUrl = config_1.default.serverUrl + req.files[0].path;
        return this.svc.updateById(id, { PhotoUrl: photoUrl });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.Client = req.session.user.Client || req.session.user.ClientId;
            let user = yield this.svc.create(req.body);
            user.Password = yield validators.validatePasswordAndCreateHash(user.Password);
            return this.svc.createAndSave(user);
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.svc.deleteById(req.params.id);
        });
    }
}
__decorate([
    refs_1.get('/')
], UsersController.prototype, "index", null);
__decorate([
    refs_1.get('/:id', apiSessionCheck)
], UsersController.prototype, "view", null);
__decorate([
    refs_1.post('/:id', apiSessionCheck)
], UsersController.prototype, "update", null);
__decorate([
    refs_1.post('/:id/photo', apiSessionCheck)
], UsersController.prototype, "updatePhoto", null);
__decorate([
    refs_1.put('/', apiSessionCheck)
], UsersController.prototype, "create", null);
__decorate([
    refs_1.del('/:id', apiSessionCheck)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController;
exports.controller = new UsersController(refs_1.Factory.Users, refs_1.Router());
//# sourceMappingURL=users.js.map