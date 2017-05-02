"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("./users");
const items_1 = require("./items");
const categories_1 = require("./categories");
const auth_1 = require("./auth");
const itemsClient_1 = require("./client/itemsClient");
const categoryClient_1 = require("./client/categoryClient");
const usersClient_1 = require("./client/usersClient");
const authClient_1 = require("./client/authClient");
var ControllerFactory;
(function (ControllerFactory) {
    ControllerFactory.Users = users_1.controller;
    ControllerFactory.Auth = auth_1.controller;
    ControllerFactory.Item = items_1.controller;
    ControllerFactory.Caterogies = categories_1.controller;
    ControllerFactory.ClientItems = itemsClient_1.controller;
    ControllerFactory.ClientCategory = categoryClient_1.controller;
    ControllerFactory.ClientUsers = usersClient_1.controller;
    ControllerFactory.ClientAuth = authClient_1.controller;
})(ControllerFactory = exports.ControllerFactory || (exports.ControllerFactory = {}));
//# sourceMappingURL=index.js.map