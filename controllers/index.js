"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("./users");
const items_1 = require("./items");
const categories_1 = require("./categories");
const auth_1 = require("./auth");
var ControllerFactory;
(function (ControllerFactory) {
    ControllerFactory.Users = users_1.controller;
    ControllerFactory.Auth = auth_1.controller;
    ControllerFactory.Item = items_1.controller;
    ControllerFactory.Caterogies = categories_1.controller;
})(ControllerFactory = exports.ControllerFactory || (exports.ControllerFactory = {}));
//# sourceMappingURL=index.js.map