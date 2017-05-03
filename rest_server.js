"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const utils_1 = require("./lib/utils");
const index_1 = require("./controllers/index");
const apiBase = '/api/1';
const apiSessionCheck = utils_1.requiresUserSession('api');
const webSessionCheck = utils_1.requiresUserSession('web');
class RestServices {
    /**
     * Set routes for the API.
     * @param app
     */
    static setApiRoutes(app) {
        // Passes the authenticated user to any request
        app.use(function (req, res, next) {
            if (req.session.user) {
                res.locals.authUser = { _id: req.session.user._id, FirstName: req.session.user.FirstName };
            }
            else {
                res.locals.authUser = null;
            }
            next();
        });
        // API 1
        let api = express.Router()
            .use('/users', index_1.ControllerFactory.Users.router)
            .use("/items", index_1.ControllerFactory.Item.router)
            .use("/categories", index_1.ControllerFactory.Caterogies.router)
            .use('/auth', index_1.ControllerFactory.Auth.router);
        app.use(apiBase, api);
        return app;
    }
    /**
     * Set routes for the web application.
     * @param app
     */
    static setWebRoutes(app) {
        app.get('/', render('index.ejs'));
        app.use('/login', render('login.ejs'));
        app.use('/register', render('register.ejs'));
        // Web
        let web = express.Router()
            .use('/users', index_1.ControllerFactory.ClientUsers.router)
            .use('/items', index_1.ControllerFactory.ClientItems.router)
            .use('/categories', index_1.ControllerFactory.ClientCategory.router)
            .use('/auth', index_1.ControllerFactory.ClientAuth.router)
            .use('/search', index_1.ControllerFactory.Search.router);
        app.use(web);
        return app;
    }
}
exports.default = RestServices;
function render(templateName) {
    return (req, res) => res.render(templateName);
}
//# sourceMappingURL=rest_server.js.map