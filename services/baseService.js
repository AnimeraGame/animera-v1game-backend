const nodemailer = require('nodemailer');
const md5 = require('md5');
const multer = require('multer');
const unixTime = require('unix-time');
const Moment = require('moment-timezone');
const fs = require("fs");
const randomstring = require("randomstring");
const html = require("html");
const jwtDecode = require('jwt-decode');
const smtpTransport = require('nodemailer-smtp-transport');
const _ = require("underscore");
const request = require("request");
const moment = require("moment");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const express = require("express");
const routes = express.Router();
const cron = require("node-cron");
const dateTime = require('node-datetime');
const dt = dateTime.create();
const formatted = dt.format('Y-m-d H:M:S');
const NodeGeocoder = require('node-geocoder');


const sqlPool = require('../DB');
const authenticateController = require('../middleware/authNew.js');
const userAuth =  require("./userAuth.js");
const object =  require("./object.js");
const race = require('./race.js');
const authRoute = require('../middleware/authNew.js').auth_route;
const databaseServices  =  require("./database.js");
const adminServices  =  require("./admin.js");

const commonFunctions = require('../helperFunction/commonFunctions.js');
const logger = require('../helperFunction/logger.js');
const config = require('../config/index');

const AWS = require('aws-sdk');


module.exports = {
    nodemailer,
    md5,
    multer,
    unixTime,
    Moment,
    fs,
    randomstring,
    html,
    jwtDecode,
    smtpTransport,
    _,
    request,
    moment,
    multipartMiddleware,
    routes,
    cron,
    formatted,
    NodeGeocoder,
    sqlPool,
    authenticateController,
    userAuth,
    object,
    race,
    authRoute,
    databaseServices,
    adminServices,
    commonFunctions,
    logger,
    AWS,
}
