"use strict";
function proxied(verb, resource, ...handlers) {
    return function (target, propertyKey, descriptor) {
        if (!target.proxiedMethodNames) {
            target.__proto__.proxiedMethodNames = [];
            target.proxiedMethodNames = [];
        }
        target.proxiedMethodNames.push([verb, resource, propertyKey, ...handlers]);
        return descriptor;
    };
}
exports.proxied = proxied;
function get(resouce, ...handlers) { return proxied('get', resouce, ...handlers); }
exports.get = get;
function post(resouce, ...handlers) { return proxied('post', resouce, ...handlers); }
exports.post = post;
function put(resouce, ...handlers) { return proxied('put', resouce, ...handlers); }
exports.put = put;
function del(resouce, ...handlers) { return proxied('delete', resouce, ...handlers); }
exports.del = del;
function opt(resouce, ...handlers) { return proxied('options', resouce, ...handlers); }
exports.opt = opt;
function head(resouce, ...handlers) { return proxied('head', resouce, ...handlers); }
exports.head = head;
//# sourceMappingURL=controllerDecorators.js.map