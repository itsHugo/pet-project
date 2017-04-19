"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const config_1 = require("./config");
const path_1 = require("path");
mongoose.Promise = global.Promise;
const rest_server_1 = require("./rest_server");
const multer = require("multer");
const publicDir = path_1.join(__dirname, 'client');
const uploadsDir = path_1.join(__dirname, 'uploads');
const port = 3001;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./uploads/`);
    },
    filename: (req, file, cb) => {
        cb(null, `photo-` + Date.now() + ".jpg");
    }
});
let uploader = multer({ storage: storage });
let app = express()
    .use(uploader.any())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(cookieParser())
    .use(session({
    secret: 'YziAquCpl21AQef',
    name: 'pocketinventorymanager.sid',
    resave: true,
    saveUninitialized: true
}))
    .use(express.static(publicDir))
    .use('/uploads', express.static(uploadsDir));
app.engine('html', require('ejs').renderFile)
    .set('views', publicDir)
    .set('view engine', 'html')
    .set('view options', { layout: false });
let webServer;
rest_server_1.default.setApiRoutes(app);
mongoose.connect(config_1.default.dbUrl).then(() => {
    webServer = app.listen(port);
    console.log('Server started on ' + port);
}).catch(reason => {
    console.log(reason);
});
exports.default = app;
//# sourceMappingURL=server.js.map