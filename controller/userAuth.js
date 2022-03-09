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


let Upload = upload.fields(
    [
        {
            name: 'wallet_address'
        }, 
        {
            name: 'username',
        },
        {
            name: 'user_pic'
        },
        {
            name: 'user_avatar_model'
        }, 
    ]
);

// Signup API
routes.post('/sign_up', Upload, async function (req, res) {

    const languageCode = req.query.language;
    logger.request("API", req.protocol + '://' + req.get('host') + req.originalUrl);
    logger.request("Request Body", req.body);
    logger.request("Request Query", req.query);
    let validateBody = userValidator.signup(req.body);

    if (validateBody.error) {
        console.log("Signup Error: ", validateBody.error);
        let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
        return res.status(200).send(JSON.stringify(response));
    }

    let userDetails = req.body;
    let username = userDetails.username ? userDetails.username : '';
    let wallet_address = userDetails.wallet_address ? userDetails.wallet_address : '';
    let user_pic = userDetails.user_pic ? userDetails.user_pic : '';
    let user_avatar_model = userDetails.user_avatar_model ? userDetails.user_avatar_model : '';

    try {
        const singleUser = {
            wallet_address: wallet_address
        }
        let rows = await userAuth.getSingleUser(singleUser);
        if (rows.length > 0) {
            let fake_user = {
                user_id: 0,
                username: "",
                wallet_address: "",
                user_pic: "",
                no_hrs_played: null,
                user_avatar_model: "",
                token: ""
            };
            return responses.sendError(res, '', fake_user, "WALLET_ALREADY_EXISTS", constants.responseMessageCode.WALLET_ALREADY_EXISTS);
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
                user_pic: user_pic,
                user_avatar_model: user_avatar_model,
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
        let fake_user = {
            user_id: 0,
            username: "",
            wallet_address: "",
            user_pic: "",
            no_hrs_played: null,
            user_avatar_model: "",
            token: ""
        };
        return responses.sendError(res, languageCode, fake_user, "", 0);
    }

});

// Login API
routes.post('/login', Upload, async function (req, res) {

    const languageCode = req.query.language;
    logger.request("API", req.protocol + '://' + req.get('host') + req.originalUrl);
    logger.request("Request Body", req.body);
    logger.request("Request Query", req.query);
    let validateBody = userValidator.login(req.body);

    if (validateBody.error) {
        let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
        return res.status(200).send(JSON.stringify(response));
    }

    let userDetails = req.body;
    let wallet_address = userDetails.wallet_address ? userDetails.wallet_address : '';

    try {
        let rows = await databaseServices.getSingleRow('user', 'wallet_address', wallet_address, 'login');

        if (rows.length > 0) {
            let payload_obj = {
                user_id: rows[0].user_id
            };
            let token = authenticateController.data.authenticate(payload_obj);
            rows[0].token = token;
            return responses.actionCompleteResponse(res, languageCode, rows[0], "LOGIN_SUCCESSFULLY", constants.responseMessageCode.LOGIN_SUCCESSFULLY);
        } else {
            let fake_user = {
                user_id: 0,
                username: "",
                wallet_address: "",
                user_pic: "",
                no_hrs_played: null,
                user_avatar_model: "",
                token: ""
            };
            return responses.actionCompleteResponse(res, languageCode, fake_user, "INCORRECT_WALLET_ADDRESS", constants.responseMessageCode.INCORRECT_WALLET_ADDRESS);
            //return responses.sendError(res, languageCode, fake_user, "INCORRECT_WALLET_ADDRESS", constants.responseMessageCode.INCORRECT_WALLET_ADDRESS);
        }

    } catch (err) {
        console.log('Caught an error!', err);
        let fake_user = {
            user_id: 0,
            username: "",
            wallet_address: "",
            user_pic: "",
            no_hrs_played: null,
            user_avatar_model: "",
            token: ""
        };
        return responses.sendError(res, languageCode, fake_user, "", 0);
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

// Update User API
routes.put('/update_profile', Upload, async function(req, res) {
    const languageCode = req.query.language;
    logger.request("API", req.protocol + '://' + req.get('host') + req.originalUrl);
    logger.request("Request Body", req.body);
    logger.request("Request Query", req.query);
    let userDetails = req.body;

    let validateBody = userValidator.update_profile(req.body);

    if (validateBody.error) {
        let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
        return res.status(200).send(JSON.stringify(response));
    }

    let username = userDetails.username ? userDetails.username : '';
    let wallet_address = userDetails.wallet_address ? userDetails.wallet_address : '';
    let user_pic = userDetails.user_pic ? userDetails.user_pic : '';
    let user_avatar_model = userDetails.user_avatar_model ? userDetails.user_avatar_model : '';
    
    try {
        let rows = await databaseServices.getSingleRow('user', 'wallet_address', wallet_address, 'update');

        if (rows.length > 0) {
            let updateObject = {
                wallet_address: wallet_address,
            }

            if(username != '') updateObject.username = username;
            if(user_pic != '') updateObject.user_pic = user_pic;
            if(user_avatar_model != '') updateObject.user_avatar_model = user_avatar_model;
            
            await databaseServices.updateSingleRow('user', updateObject, 'wallet_address', wallet_address, 'update');
            let res_row = await databaseServices.getSingleRow('user', 'wallet_address', wallet_address, 'update');
            return responses.actionCompleteResponse(res, languageCode, res_row[0], "PROFILE_UPDATED", constants.responseMessageCode.PROFILE_UPDATED);
        } else {
            let fake_user = {
                user_id: 0,
                username: "",
                wallet_address: "",
                user_pic: "",
                no_hrs_played: null,
                user_avatar_model: "",
                token: ""
            };
            return responses.sendError(res, languageCode, fake_user, "INCORRECT_WALLET_ADDRESS", constants.responseMessageCode.INCORRECT_WALLET_ADDRESS);
        }

    } catch (err) {
        console.log('Caught an error!', err);
        let fake_user = {
            user_id: 0,
            username: "",
            wallet_address: "",
            user_pic: "",
            no_hrs_played: null,
            user_avatar_model: "",
            token: ""
        };
        return responses.sendError(res, languageCode, fake_user, "", 0);
    }
})


module.exports = routes;