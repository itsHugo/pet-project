import * as express from 'express'
import { requiresUserSession } from './lib/utils'
import { ControllerFactory as factory } from './controllers/index'

type Express = express.Express;
const apiBase = '/api/1';
const apiSessionCheck = requiresUserSession('api');
const webSessionCheck = requiresUserSession('web');

export default class RestServices {
    public static setApiRoutes(app: Express): Express {

        // Passes the authenticated user to any request
        app.use(function (req, res, next) {
            if(req.session.user){
                res.locals.authUser = {_id: req.session.user._id, FirstName: req.session.user.FirstName};
            } else {
                res.locals.authUser = null;
            }
                
            console.log(res.locals.authUser);
            next();
        });


        app.get('/', render('index.ejs'));

        // Routes
        

        app.use('/login', render('login.ejs'));
        app.use('/register', render('register.ejs'));
        app.use('/items', factory.Item.router);
        //app.use('/items', render('items.ejs'));

        app.use('/user', render('user.ejs'));

        app.use('/auth', factory.Auth.router);



        // End Routes

        // API
        let api = express.Router()
            .use('/users', factory.Users.router)
            .use("/items", factory.Item.router)
            .use("/categories", factory.Caterogies.router);
        // /API

        // Web
        let web = express.Router()
            .use('/users', factory.Users.router)
            .use('/items', factory.Item.router)
            .use('/categories', factory.Caterogies.router);
        // /Web

        app.use(apiBase, api);
        //app.use(web);
        return app;
    }
}
function render(templateName, router?) {
    return (req, res) => res.render(templateName, { object: router });
}
