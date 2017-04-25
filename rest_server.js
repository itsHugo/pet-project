"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const utils_1 = require("./lib/utils");
const index_1 = require("./controllers/index");
const apiBase = '/api/1';
const apiSessionCheck = utils_1.requiresUserSession('api');
const webSessionCheck = utils_1.requiresUserSession('web');
class RestServices {
    static setApiRoutes(app) {
        app.get('/', render('index.ejs'));
        // Routes
        app.use('/login', render('login.ejs'));
        app.use('/register', render('register.ejs'));
        app.use('/auth', index_1.ControllerFactory.Auth.router);
        // End Routes
        // API
        let api = express.Router()
            .use('/users', index_1.ControllerFactory.Users.router)
            .use("/items", index_1.ControllerFactory.Item.router)
            .use("/categories", index_1.ControllerFactory.Caterogies.router);
        app.use(apiBase, api);
        return app;
    }
}
exports.default = RestServices;
function render(templateName) {
    return (req, res) => res.render(templateName);
}
//# sourceMappingURL=rest_server.js.map