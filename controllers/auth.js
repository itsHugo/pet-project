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
const errors_1 = require("../lib/errors");
const apiSessionCheck = utils.requiresUserSession('api');
class PasswordResetDTO {
}
class AuthController extends refs_1.BaseController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = this.svc.create(req.body);
            user.Password = yield validators.validatePasswordAndCreateHash(user.Password);
            user = yield this.svc.login(user.Email, user.Password);
            if (!user)
                throw (new errors_1.default.Unauthorized('Invalid Username or Password'));
            this.setCurrentUser(req, user);
            return user;
        });
    }
    logout(req, res) {
        this.setCurrentUser(req, null);
        return { status: "success", message: "Logged out successfully" };
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var dto = req.body;
            var newHash = yield validators.validatePasswordAndCreateHash(dto.NewPassword);
            var currentHash = yield validators.validatePasswordAndCreateHash(dto.CurrentPassword);
            if (req.session.user.Password === currentHash) {
                var user = yield this.svc.updateById(req.session.user._id, { Password: newHash });
                req.session.user = user;
                return "";
            }
            else {
                throw new errors_1.default.InvalidData('Invalid Old Password');
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var usr = this.svc.create(req.body);
            usr = yield validators.validateUser(usr);
            usr.Password = yield validators.validatePasswordAndCreateHash(usr.Password);
            yield this.svc.userExists(usr.Email);
            if (yield this.svc.userExists(usr.Email))
                throw new errors_1.default.InvalidData('User already exists');
            usr = yield this.svc.insert(usr);
            return usr;
        });
    }
    setCurrentUser(req, user) {
        req.session.user = user;
        // if (user) {
        //     req.session.clientId = user.Client;
        // }
        // else {
        //     req.session.clientId = null;
        // }
    }
}
__decorate([
    refs_1.post('/login')
], AuthController.prototype, "login", null);
__decorate([
    refs_1.post('/logout', apiSessionCheck)
], AuthController.prototype, "logout", null);
__decorate([
    refs_1.post('/resetpassword', apiSessionCheck)
], AuthController.prototype, "resetPassword", null);
__decorate([
    refs_1.put('/register')
], AuthController.prototype, "register", null);
exports.AuthController = AuthController;
exports.controller = new AuthController(refs_1.Factory.Users, refs_1.Router());
//# sourceMappingURL=auth.js.map