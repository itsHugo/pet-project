import chai = require('chai');
import * as request from 'request';
import data from './data'

export default class Auth {
    private static _jar: any
    static get jar() {
        return Auth._jar
    }
    static get isAuthenticated() {
        return Auth.jar != null;
    }
    static authenticate(done) {
        try {
            request.post(data.url + "/auth/login", { json: data.userCredentials.valid }, (err, res, body) => {
                if (!err) {
                    var setCookieIndex = res.rawHeaders.indexOf('set-cookie');
                    var sessionCookie = res.rawHeaders[setCookieIndex + 1].split(';')[0];
                    Auth._jar = request.jar();
                    var cookie = request.cookie(sessionCookie);
                }
                Auth.jar.setCookie(cookie, 'http://localhost:3001');
                done(err);
            });
        } catch (ex) {
            console.log(ex.stack)
        }
    }
    static deauthenticate(done) {
        Auth._jar = null
        done();
    }
}