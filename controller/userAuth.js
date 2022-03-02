const express = require("express");
const routes = express.Router();
const upload = require('../middleware/fileFunction.js')('user');
const userValidator = require("../validator/userAuth.js");
const constants = require("../util/constants");
const responses = require("../util/responses");


const {
    randomstring,
    userAuth,
    databaseServices,
    authenticateController,
    commonFunctions,
    logger,
    moment,
} = require('../services/baseService.js');


let Upload = upload.fields([{
    name: 'user_pic'
}, {
    name: 'user_multiple_pics',
}]);

// Signup API
routes.post('/sign_up', Upload, async function (req, res) {

    const languageCode = req.query.language;
    logger.request("API", req.protocol + '://' + req.get('host') + req.originalUrl);
    logger.request("Request Body", req.body);
    logger.request("Request Query", req.query);
    let validateBody = userValidator.signup(req.body);

    if (validateBody.error) {
        let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
        return res.status(200).send(JSON.stringify(response));
    }

    let image;
    if (!req.files.user_pic || req.files.user_pic == undefined) {
        image = '';
    } else {
        image = 'user/' + req.files.user_pic[0].key;
    }

    let userMultiplePics = [];
    if (image) {
        userMultiplePics.push({ id: 1, image: image, primary: 1 });
    }

    let userDetails = req.body;
    let username = userDetails.username ? userDetails.username : '';
    let wallet_address = userDetails.wallet_address ? userDetails.wallet_address : '';

    try {
        const singleUser = {
            wallet_address: wallet_address
        }
        let rows = await userAuth.getSingleUser(singleUser);
        if (rows.length > 0) {
            return responses.sendError(res, '', {}, "WALLET_ALREADY_EXISTS", constants.responseMessageCode.WALLET_ALREADY_EXISTS);
        } else {
            let random = randomstring.generate({
                length: 5,
                capitalization: 'uppercase'
            });
            let randomValidTime = moment().toISOString();
            randomValidTime = moment(randomValidTime).add(10, 'minutes');
            randomValidTime = randomValidTime.toISOString();
            let users = {
                username: username,
                wallet_address: wallet_address,
                user_pic: image,
            };

            let userRow = await databaseServices.insertSingleRow('user', users, 'sign up');
            rows = await databaseServices.getSingleRow('user', 'user_id', userRow.insertId, 'sign up');

            let userId = rows[0].user_id;            

            let payload_obj = {
                user_id: userId
            };
            let token = authenticateController.data.authenticate(payload_obj);
            rows[0].token = token;
            
            responses.actionCompleteResponse(res, languageCode, rows[0], "REGISTRATION_SUCCESSFUL", constants.responseMessageCode.REGISTRATION_SUCCESSFUL);
        }

    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});

// Login API
routes.post('/login', async function (req, res) {

    const languageCode = req.query.language;
    logger.request("API", req.protocol + '://' + req.get('host') + req.originalUrl);
    logger.request("Request Body", req.body);
    logger.request("Request Query", req.query);
    let userDetails = req.body;

    let wallet_address = userDetails.wallet_address ? userDetails.wallet_address : '';

    try {

        // Login With Email And Password
        let validateBody = userValidator.login(req.body);
        if (validateBody.error) {
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        }

        let rows = await databaseServices.getSingleRow('user', 'wallet_address', wallet_address, 'login');

        if (rows.length > 0) {
            // Unverified Account Login
            let payload_obj = {
                user_id: rows[0].user_id
            };
            let token = authenticateController.data.authenticate(payload_obj);
            rows[0].token = token;
            return responses.actionCompleteResponse(res, languageCode, rows[0], "LOGIN_SUCCESSFULLY", constants.responseMessageCode.LOGIN_SUCCESSFULLY);
        } else {
            return responses.sendError(res, languageCode, {}, "INCORRECT_WALLET_ADDRESS", constants.responseMessageCode.INCORRECT_EMAIL_PASSWORD);
        }

    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});

// Search User API
routes.get('/search', userValidator.searchUser, async function (req, res) {

    const languageCode = req.query.language;
    try {
        const users = await userAuth.searchUser(req.query);
        return responses.actionCompleteResponse(res, languageCode, users, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);

    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});


module.exports = routes;