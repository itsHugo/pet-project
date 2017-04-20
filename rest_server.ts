import * as express from 'express'
import { requiresUserSession } from './lib/utils'
import { ControllerFactory as factory } from './controllers/index'

type Express = express.Express;
const apiBase = '/api/1';
const apiSessionCheck = requiresUserSession('api');
const webSessionCheck = requiresUserSession('web');

export default class RestServices {
    public static setApiRoutes(app: Express): Express {
        app.get('/', render('index'));
        app.use('/auth', factory.Auth.router);
        let api = express.Router()
            .use('/users', factory.Users.router)

        app.use(apiBase, api);
        return app;
    }
}
function render(templateName) {
    return (req, res) => res.render(templateName);
}
