import * as express from 'express'
import { requiresUserSession } from './lib/utils'
import { ControllerFactory as factory } from './controllers/index'

type Express = express.Express;
const apiBase = '/api/1';
const apiSessionCheck = requiresUserSession('api');
const webSessionCheck = requiresUserSession('web');

export default class RestServices {
    public static setApiRoutes(app: Express): Express {
        app.get('/', render('index.ejs'));
        // Routes
        app.use('/login', render('login.ejs'));
        app.use('/register', render('register.ejs'));
        app.use('/items', render('items.ejs'));

        app.use('/user', render('user.ejs'));

        app.use('/auth', factory.Auth.router);
        // End Routes

        // API
        let api = express.Router()
            .use('/users', factory.Users.router)
            .use("/items", factory.Item.router)
            .use("/categories", factory.Caterogies.router);

        app.use(apiBase, api);
        app.use("/items", factory.ClientItems.router);
        return app;
    }
}
function render(templateName) {
    return (req, res) => res.render(templateName);
}
