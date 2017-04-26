"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("../lib/models/index"));
var ccd_1 = require("ccd");
exports.Router = ccd_1.Router;
exports.get = ccd_1.get;
exports.post = ccd_1.post;
exports.put = ccd_1.put;
exports.del = ccd_1.del;
exports.head = ccd_1.head;
exports.opt = ccd_1.opt;
var baseController_1 = require("../lib/baseController");
exports.BaseController = baseController_1.BaseController;
// export let Router = express.Router; 
//# sourceMappingURL=refs.js.map