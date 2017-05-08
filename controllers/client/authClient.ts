import { model } from 'mongoose';
import {
    BaseController, Factory, Router,
    get, post, put, del,
    UserService, User
} from '../refs'
import * as utils from '../../lib/utils'
import * as validators from '../../lib/validators'
import errors from '../../lib/errors'
import * as multer from 'multer';
import { CustomResponces } from '../../lib/baseController';

let upload = multer().single('Image');

const webSessionCheck = utils.requiresUserSession('web');

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
        if (!user){
            res.render('login', {error: 'Invalid email or password.'});
            return CustomResponces.DO_NOTHING;
        }
            
        this.setCurrentUser(req, user);
        res.redirect('/');
        return CustomResponces.DO_NOTHING;
    }

    @post('/register')
    async register(req, res) {
        // Add image upload here 

        var usr = this.svc.create(req.body);
        usr = await validators.validateUser(usr);
        usr.Password = await validators.validatePasswordAndCreateHash(usr.Password)
        await this.svc.userExists(usr.Email);
        if (await this.svc.userExists(usr.Email)){
            res.render('register',  {error: new errors.InvalidData('Email unavailable: ' + usr.Email + '.')});
            return CustomResponces.DO_NOTHING;
        }
            
        usr = await this.svc.insert(usr);
        res.redirect('/');
        return CustomResponces.DO_NOTHING;
    }

    @post('/logout', webSessionCheck)
    logout(req, res) {
        this.setCurrentUser(req, null);
        // Redirect back to the previous page
        res.redirect('back');
        return CustomResponces.DO_NOTHING;
    }

    @post('/resetpassword', webSessionCheck)
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