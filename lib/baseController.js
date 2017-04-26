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
            res.send(401, { status: "error", message: err.message });
        }
        else if (err instanceof errors_1.default.InvalidData) {
            res.send(400, { status: "error", message: err.message });
        }
        else if (err instanceof errors_1.default.Permission) {
            res.send(403, { status: "error", message: err.message });
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