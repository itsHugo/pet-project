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
const viewsDir = path_1.join(__dirname, 'views/pages');
const publicDir = path_1.join(__dirname, 'public');
const uploadsDir = path_1.join(__dirname, 'uploads');
const port = 3001;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./uploads/`);
    },
    filename: (req, file, cb) => {
        console.log(Date.now());
        cb(null, file.originalname);
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
    name: 'htv.sid',
    resave: true,
    saveUninitialized: true
}))
    .use(express.static(viewsDir))
    .use(express.static(publicDir))
    .use('/uploads', express.static(uploadsDir));
app.engine('ejs', require('ejs').renderFile)
    .set('views', viewsDir)
    .set('view engine', 'ejs')
    .set('view options', { layout: false });
let webServer;
rest_server_1.default.setApiRoutes(app);
rest_server_1.default.setWebRoutes(app);
mongoose.connect(config_1.default.dbUrl).then(() => {
    webServer = app.listen(port);
    console.log('Server started on ' + port);
}).catch(reason => {
    console.log(reason);
});
exports.default = app;
//# sourceMappingURL=server.js.map