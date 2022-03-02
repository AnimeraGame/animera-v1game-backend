const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const isHtml = require('is-html');
const dbHandler = require('../DB');
const APIRef = 'Authentication';
const logger = require('../helperFunction/logger.js');
const config = require('../config/index');
const constants = require("../util/constants");
const responses = require("../util/responses");


let methods = {

    authenticate: function (payload_obj) {
        let token = jwt.sign(payload_obj, config.SECRET_KEY, {
            expiresIn: 60 * 60 * 24 * 30
        });
        return token;
    },
    authenticate_forgot: function (payload_obj) {
        let token = jwt.sign(payload_obj, config.SECRET_KEY, {
            expiresIn: 60 * 30
        });
        return token;
    },
    decode: function (token) {
        try {
            let decoded = jwtDecode(token);
            return decoded.user_id;
        } catch (err) {
            console.log(err);
            return 'error';
        }
    },

    test_html: function (req_data) {
        for (let prop in req_data) {
            if (isHtml(req_data[prop]) == true) {
                return "error";
            }
        }
        return "success";
    },
    auth_route: (req, res, next) => {
        logger.request("API", req.protocol + '://' + req.get('host') + req.originalUrl);
        logger.request("Request Body", req.body);
        logger.request("Request Query", req.query);
        const language = req.query.language ? req.query.language : 'en';

        logger.request("Access Token", req.headers.ss_token);

        let token = req.headers['ss_token'];
        let user_id = methods.decode(req.headers['ss_token']);
        if (user_id == 'error') {
            return responses.sendError(res, language, {}, "INVALID_ACCESS_TOKEN", constants.responseMessageCode.INVALID_ACCESS_TOKEN);
        } else {

            dbHandler.mysqlQueryPromise(APIRef, 'auth_route', "SELECT * FROM admin WHERE admin_id = ? ", [user_id]).then((user_data) => {
                if (user_data[0]) {
                    req.user = user_data[0];
                    if (token) {
                        jwt.verify(token, config.SECRET_KEY, function (err, ress) {
                            if (err) {
                                return responses.sendError(res, language, {}, "INVALID_ACCESS_TOKEN", constants.responseMessageCode.INVALID_ACCESS_TOKEN);
                            } else {
                                next();
                            }
                        })
                    } else {
                        return responses.sendError(res, language, {}, "ACCESS_TOKEN_REQUIRED", constants.responseMessageCode.ACCESS_TOKEN_REQUIRED);
                    }
                } else {
                    return responses.sendError(res, language, {}, "USER_NOT_EXIST", constants.responseMessageCode.USER_NOT_EXIST);
                }

            }).catch((error) => {
                console.log('Caught an error!', error);
                return responses.sendError(res, language, {}, "", 0);
            });
        }

    }
}


let auth_route = (req, res, next) => {
    logger.request("API", req.protocol + '://' + req.get('host') + req.originalUrl);
    logger.request("Request Body", req.body);
    logger.request("Request Query", req.query);
    const language = req.query.language ? req.query.language : 'en';

    logger.request("Access Token", req.headers.ss_token);

    let token = req.headers['ss_token'];
    let user_id = methods.decode(req.headers['ss_token']);
    if (user_id == 'error') {
        return responses.sendError(res, language, {}, "INVALID_ACCESS_TOKEN", constants.responseMessageCode.INVALID_ACCESS_TOKEN);
    } else {

        dbHandler.mysqlQueryPromise(APIRef, 'auth_route', "SELECT * FROM user WHERE user_id = ?", [user_id]).then((user_data) => {


            if (user_data[0]) {
                let lang;
                if (user_data[0].user_status == 0 || user_data[0].user_status == 3) {
                    if (user_data[0].user_language) {
                        lang = user_data[0].user_language
                    }
                    return responses.sendError(res, lang, {}, "DISABLED_ACCOUNT", constants.responseMessageCode.DISABLED_ACCOUNT);
                }
                req.user = user_data[0];
                if (token) {
                    jwt.verify(token, config.SECRET_KEY, function (err, ress) {
                        if (err) {
                            return responses.sendError(res, language, {}, "INVALID_ACCESS_TOKEN", constants.responseMessageCode.INVALID_ACCESS_TOKEN);
                        } else {
                            let lastActive = new Date();
                            lastActive = lastActive.toISOString();
                            dbHandler.mysqlQueryPromise(APIRef, 'auth_route', "UPDATE user SET last_active_at = ? WHERE user_id = ?", [lastActive, user_id]).then((user) => {
                                next();            
                            }).catch((error) => {
                                console.log('Caught an error!', error);
                                return responses.sendError(res, language, {}, "", 0);
                            });
                        }
                    });
                } else {
                    return responses.sendError(res, language, {}, "ACCESS_TOKEN_REQUIRED", constants.responseMessageCode.ACCESS_TOKEN_REQUIRED);
                }
            } else {
                return responses.sendError(res, language, {}, "USER_NOT_EXIST", constants.responseMessageCode.USER_NOT_EXIST);
            }

        }).catch((error) => {
            console.log('Caught an error!', error);
            return responses.sendError(res, language, {}, "", 0);
        });

    }

}


exports.data = methods;
exports.auth_route = auth_route;