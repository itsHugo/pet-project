import { model } from 'mongoose';
import {
    BaseController, Factory, Router,
    get, post, put, del,
    UserService, User
} from './refs'
import * as utils from '../lib/utils'
import * as validators from '../lib/validators'
import errors from '../lib/errors'
const apiSessionCheck = utils.requiresUserSession('api');

class PasswordResetDTO {
    CurrentPassword: string
    NewPassword: string
}

export class AuthController extends BaseController<User>{
    svc: UserService
    @post('/login')
    async login(req, res) {
        let user = this.svc.create(req.body);
        user.Password = await validators.validatePasswordAndCreateHash(user.Password)
        user = await this.svc.login(user.Email, user.Password);
        if (!user)
            throw (new errors.Unauthorized('Invalid Username or Password'));
        this.setCurrentUser(req, user);
        return user;
    }

    @post('/logout', apiSessionCheck)
    logout(req, res) {
        this.setCurrentUser(req, null);
        return { status: "success", message: "Logged out successfully" };
    }

    @post('/resetpassword', apiSessionCheck)
    async resetPassword(req, res) {
        var dto = req.body as PasswordResetDTO;
        var newHash = await validators.validatePasswordAndCreateHash(dto.NewPassword);
        var currentHash = await validators.validatePasswordAndCreateHash(dto.CurrentPassword);
        if (req.session.user.Password === currentHash) {
            var user = await this.svc.updateById(req.session.user._id, { Password: newHash });
            req.session.user = user;
            return "";
        } else {
            throw new errors.InvalidData('Invalid Old Password');
        }
    }

    @put('/register')
    async register(req, res) {
        console.log(req.body);
        var usr = this.svc.create(req.body);
        usr = await validators.validateUser(usr);
        usr.Password = await validators.validatePasswordAndCreateHash(usr.Password)
        await this.svc.userExists(usr.Email);
        if (await this.svc.userExists(usr.Email))
            throw new errors.InvalidData('User already exists');

        usr = await this.svc.insert(usr);
        return usr;
    }

    private setCurrentUser(req, user) {
        req.session.user = user;
        // if (user) {
        //     req.session.clientId = user.Client;
        // }
        // else {
        //     req.session.clientId = null;
        // }
    }
}
export let controller = new AuthController(Factory.Users, Router());