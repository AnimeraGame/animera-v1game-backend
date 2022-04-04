const express   = require("express");
const bodyParser = require("body-parser");
const app = express();
const basicAuth = require("express-basic-auth");
const authRoute = express.Router();
const jwt = require('jsonwebtoken');
require('throw-max-listeners-error');
const exphbs = require('express-handlebars');
const cors = require('cors');
require('dotenv').config()
const fs = require('fs');
// const https = require('https');
const https = require('http');
const routeController = require('./controller');
const logger = require('./helperFunction/logger.js');
const config = require('./config/index');
const path = require('path');

let http = require('http').Server(app);

const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
        'PUT',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};
  
app.use(cors(corsOpts));

const PORT = config.PORT || 3001;
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    let json = res.json;
    res.json = function(obj) {
        logger.response(obj);
        json.call(this, obj);
    };
    next();
});

app.use('', routeController());

http.listen(PORT, function () {
    console.log(`connection established for app ${config.APP_NAME} for ${config.NODE_ENV} environment on port ${PORT}`);
});

if (process.listenerCount('warning') === 1) {
    process.removeAllListeners('warning');
    process.on('warning', function (warning) {
        console.error('Check Error by listerners : ', warning.stack);
    });
}
