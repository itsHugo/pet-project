import * as express from 'express'
import { requiresUserSession } from './lib/utils'
import { ControllerFactory as factory } from './controllers/index'

type Express = express.Express;
const apiBase = '/api/1';
const apiSessionCheck = requiresUserSession('api');
const webSessionCheck = requiresUserSession('web');

export default class RestServices {
    /**
     * Set routes for the API.
     * @param app 
     */
    public static setApiRoutes(app: Express): Express {

        // Passes the authenticated user to any request
        app.use(function (req, res, next) {
            if(req.session.user){
                res.locals.authUser = {_id: req.session.user._id, FirstName: req.session.user.FirstName};
            } else {
                res.locals.authUser = null;
            }
            next();
        });
        
        // API 1
        let api = express.Router()
            .use('/users', factory.Users.router)
            .use("/items", factory.Item.router)
            .use("/categories", factory.Caterogies.router)
            .use('/auth', factory.Auth.router);

        app.use(apiBase, api);

        return app;
    }
    /**
     * Set routes for the web application.
     * @param app 
     */
    public static setWebRoutes(app: Express): Express{
        app.get('/', render('index.ejs'));

        app.use('/login', render('login.ejs'));
        app.use('/register', render('register.ejs'));

        // Web
        let web = express.Router()
            .use('/users', factory.ClientUsers.router)
            .use('/items', factory.ClientItems.router)
            .use('/categories', factory.ClientCategory.router)
            .use('/auth', factory.ClientAuth.router)
            .use('/search', factory.Search.router);

        app.use(web);

        return app;
    }
}
function render(templateName) {
    return (req, res) => res.render(templateName);
}
