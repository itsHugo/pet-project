"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ccd = require("ccd");
const index_1 = require("./models/index");
const config_1 = require("../config");
const errors_1 = require("../lib/errors");
var CustomResponces;
(function (CustomResponces) {
    CustomResponces[CustomResponces["DO_NOTHING"] = 'do_nothing'] = "DO_NOTHING";
})(CustomResponces = exports.CustomResponces || (exports.CustomResponces = {}));
class BaseController extends ccd.CCController {
    constructor(svc, router) {
        super(router, config_1.default);
        this.svc = svc;
        this.Factory = index_1.Factory;
    }
    senderFunction(res, err, data) {
        if (err instanceof errors_1.default.Unauthorized) {
            res.status(401).send({ status: "error", message: err.message });
        }
        else if (err instanceof errors_1.default.InvalidData) {
            res.status(400).send({ status: "error", message: err.message });
        }
        else if (err instanceof errors_1.default.Permission) {
            res.status(403).send({ status: "error", message: err.message });
        }
        else if (data == CustomResponces.DO_NOTHING) {
            //do nothing
        }
        else
            super.senderFunction(res, err, data);
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=baseController.js.map