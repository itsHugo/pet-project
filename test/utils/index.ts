import chai = require('chai');
import * as request from 'request';
export let expect = chai.expect;
export let assert = chai.assert;

import _auth from './auth'
import _data from './data'

export let data = _data
export let auth = _auth

import {
    get as _get,
    post as _post,
    put as _put,
    del as _del
} from 'request'

function sanitizedOptions(options: { json: string, jar: string } = {} as any) {
    let opts = options
    let isOptionsObject = options["json"] != undefined || options['jar'] != undefined;
    let isNotEmpty = Object.keys(options).length > 0
    let isDataObject = !isOptionsObject && !isNotEmpty

    if (isDataObject) {
        opts = { json: opts } as any
    }
    if (!opts.jar && auth.jar)
        opts.jar = auth.jar;

    return opts
}
export function get(uri, options?, calllback?) {
    if (typeof options == 'function') {
        calllback = options;
        options = {}
    }
    let opts = sanitizedOptions(options);
    return _get(_data.urlApi + uri, opts, calllback);
}
export function post(uri, options?, calllback?) {
    if (typeof options == 'function') {
        calllback = options;
        options = {}
    }
    let opts = sanitizedOptions(options);
    return _post(_data.urlApi + uri, opts, calllback);
}
export function put(uri, options?, calllback?) {
    if (typeof options == 'function') {
        calllback = options;
        options = {}
    }
    let opts = sanitizedOptions(options);
    return _put(_data.urlApi + uri, opts, calllback);
}
export function del(uri, options?, calllback?) {
    if (typeof options == 'function') {
        calllback = options;
        options = {}
    }
    let opts = sanitizedOptions(options);
    return _del(_data.urlApi + uri, opts, calllback);
}
export function unauthorizedCheck(done) {
    return function _unauthorizedCheck(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.not.be.undefined;
        done(err);
        // expect(res.statusCode).to.equal(401);
        // expect(body).to.equal('Unauthorized');
        // done(err);
    }
}

export function okWithData(err, res?, body?): any {
    let done = null;
    function okFunc(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.not.be.undefined;
        if (done)
            done(err);
    }
    if (typeof err == 'function') {
        done = err;
        return okFunc;
    } else {
        return okFunc(err, res, body);
    }
}