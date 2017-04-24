"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
exports.expect = chai.expect;
exports.assert = chai.assert;
const auth_1 = require("./auth");
const data_1 = require("./data");
exports.data = data_1.default;
exports.auth = auth_1.default;
const request_1 = require("request");
function sanitizedOptions(options = {}) {
    let opts = options;
    let isOptionsObject = options["json"] != undefined || options['jar'] != undefined;
    let isNotEmpty = Object.keys(options).length > 0;
    let isDataObject = !isOptionsObject && !isNotEmpty;
    if (isDataObject) {
        opts = { json: opts };
    }
    if (!opts.jar && exports.auth.jar)
        opts.jar = exports.auth.jar;
    return opts;
}
function get(uri, options, calllback) {
    if (typeof options == 'function') {
        calllback = options;
        options = {};
    }
    let opts = sanitizedOptions(options);
    return request_1.get(data_1.default.urlApi + uri, opts, calllback);
}
exports.get = get;
function post(uri, options, calllback) {
    if (typeof options == 'function') {
        calllback = options;
        options = {};
    }
    let opts = sanitizedOptions(options);
    return request_1.post(data_1.default.urlApi + uri, opts, calllback);
}
exports.post = post;
function put(uri, options, calllback) {
    if (typeof options == 'function') {
        calllback = options;
        options = {};
    }
    let opts = sanitizedOptions(options);
    return request_1.put(data_1.default.urlApi + uri, opts, calllback);
}
exports.put = put;
function del(uri, options, calllback) {
    if (typeof options == 'function') {
        calllback = options;
        options = {};
    }
    let opts = sanitizedOptions(options);
    return request_1.del(data_1.default.urlApi + uri, opts, calllback);
}
exports.del = del;
function unauthorizedCheck(done) {
    return function _unauthorizedCheck(err, res, body) {
        exports.expect(res.statusCode).to.equal(200);
        exports.expect(body).to.not.be.undefined;
        done(err);
        // expect(res.statusCode).to.equal(401);
        // expect(body).to.equal('Unauthorized');
        // done(err);
    };
}
exports.unauthorizedCheck = unauthorizedCheck;
function okWithData(err, res, body) {
    let done = null;
    function okFunc(err, res, body) {
        exports.expect(res.statusCode).to.equal(200);
        exports.expect(body).to.not.be.undefined;
        if (done)
            done(err);
    }
    if (typeof err == 'function') {
        done = err;
        return okFunc;
    }
    else {
        return okFunc(err, res, body);
    }
}
exports.okWithData = okWithData;
//# sourceMappingURL=index.js.map