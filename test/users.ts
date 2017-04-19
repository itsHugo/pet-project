/// <reference path="../typings/index.d.ts" />
'use strict';

var users = require('../lib/models/user');
import chai = require('chai');
import * as request from 'request';

var expect = chai.expect;
var assert = chai.assert;

let baseUrl = "http://localhost:3001/api/1/users/auth"
let url = "http://localhost:3001";
describe('User Tests', () => {
    describe('#login()', () => {
        it('should throw error when try to login with wrong pass or username', (done) =>
            request.post(url + '/auth/login', { json: { Email: 'dmitrevski2@gmail.com', Password: '123456' } }, (err, res, body) => {
                expect(res.statusCode == 400);
                expect(body.status == 'error');
                done(err);
            })
        );
        it('should not throw error when try to login with valid parameters', (done) =>
            request.post(baseUrl + '/login', { json: { Email: 'dmitrevski2@gmail.com', Password: '12345' } }, (err, res, body) => {
                expect(res.statusCode == 200);
                expect(body.Email == 'dmitrevski2@gmail.com');
                done(err);
            })
        );
    });
    describe('#logout()', () => {
        it('should logout successfully', (done) => {
            request.post(url + '/auth/login', { json: { Email: 'dmitrevski2@gmail.com', Password: '12345' } }, (err, res, body) => {
                var setCookieIndex = res.rawHeaders.indexOf('set-cookie');
                var sessionCookie = res.rawHeaders[setCookieIndex + 1].split(';')[0];
                var jar = request.jar();
                var cookie = request.cookie(sessionCookie);
                jar.setCookie(cookie, baseUrl + '/logout');
                var req = request.defaults({ jar: jar }).post(baseUrl + '/logout', (err, res, body) => {
                    expect(res.statusCode == 200);
                    expect(body.status == 'success');
                    done(err);
                })
            })
        });
        it('should throw error when try to logout without login beforehand', (done) => {
            request.post(baseUrl + '/logout', (err, res, body) => {
                expect(res.statusCode == 401);
                expect(body == 'Unauthorized');
                done(err);
            })
        });
    });
});