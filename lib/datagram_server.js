"use strict";
var dgram = require('dgram');
class VoiceServer {
    constructor() {
        this.server = null;
    }
    start() {
        this.server = dgram.createSocket('udp4');
        this.server.on('message', function (msg, rinfo) {
            console.log('server got: ' + msg + ' from ' + rinfo.address + ':' + rinfo.port);
        });
        this.server.on('listening', function () {
            var address = this.server.address();
            console.log('server listening ' + address.address + ':' + address.port);
        });
        this.server.bind(43278);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VoiceServer;
//# sourceMappingURL=datagram_server.js.map