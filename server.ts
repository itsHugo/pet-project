/// <reference path="./typings/index.d.ts" />
import * as http from 'http'
import * as express from 'express'
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session'
import mongoose = require('mongoose')
import config from './config'
import { join as pjoin } from 'path'
mongoose.Promise = global.Promise;
import restServer from './rest_server';
import * as multer from 'multer';

const publicDir = pjoin(__dirname, '..', 'client');
const uploadsDir = pjoin(__dirname, 'uploads');
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

let webServer: http.Server;

restServer.setApiRoutes(app);
mongoose.connect(config.dbUrl).then(() => {
    webServer = app.listen(port);
    console.log('Server started on ' + port);
}).catch(reason => {
    console.log(reason);
});

export default app;
