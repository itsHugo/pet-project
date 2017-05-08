import { PermissionError, UnauthorizedError } from '../../lib/errors';
import { BaseController, del, Factory, get, post, put, Router, User, UserService } from '../refs';
import { Request, Response } from 'ccd';
import * as utils from '../../lib/utils'
import * as validators from '../../lib/validators'
import errors from '../../lib/errors'
import * as request from 'request';
import EnumValues from '../../lib/enumValues';
import * as multer from 'multer';
import config from '../../config';
import { CustomResponces } from '../../lib/baseController';

let upload = multer().single('Image');

const webSessionCheck = utils.requiresUserSession('web');
export function checkIfMe(req, res, next) {
    if (req.session.user.id == req.params.id) {
        next();
    } else {
        utils.sendNotAuthorized(req, res, 'web');
    }
}

export class UsersController extends BaseController<User>{
    svc: UserService

    @get('/', webSessionCheck)
    async index(req, res) {
        return await this.svc.search(req.query, req.session.user);
    }

    @get('/:id')
    async view(req, res) {
        res.render('user.ejs', { user: await this.svc.byId(req.params.id), items: await this.svc.itemsByUser(req.params.id) });
        
        return CustomResponces.DO_NOTHING;
    }

    @post('/:id', webSessionCheck)
    async update(req, res) {
        let user = await this.svc.updateById(req.params.id, req.body);
        user.Password = await validators.validatePasswordAndCreateHash(user.Password);

        this.setCurrentUser(req, user);
        
        res.redirect('back');
        return CustomResponces.DO_NOTHING;
    }

    @post('/:id/photo', webSessionCheck)
    async updatePhoto(req, res) {
        let id = req.params.id;
        if(req.files && req.files.length > 0){
            var photoUrl = req.files[0].filename;
            await this.svc.updateById(id, {Image: photoUrl});
        }
        res.redirect('back');
        return CustomResponces.DO_NOTHING;
    }

    @post('/:id/delete', webSessionCheck)
    async remove(req, res) {
        return this.svc.deleteById(req.params.id);
    }

    private setCurrentUser(req, user) {
        req.session.user = user;
    }
}



export let controller = new UsersController(Factory.Users, Router());