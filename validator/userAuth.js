const joi = require('joi');
const logger = require('../helperFunction/logger.js');
const constants = require("../util/constants");
const responses = require("../util/responses");

let userValidator = {
    signup: (body) => {
        const schema = joi.object().keys({
            username: joi.string().required(),
            wallet_address: joi.string().required(),
        }).unknown(true);

        let validateBody = joi.validate(body, schema);
        return validateBody;
    },

    update_profile: (body) => {
        const schema = joi.object().keys({
            wallet_address: joi.string().required(),
        }).unknown(true);

        let validateBody = joi.validate(body, schema);
        return validateBody;   
    },

    login: (body) => {
        const schema = joi.object().keys({
            wallet_address: joi.string().required()
        }).unknown(true);

        let validateBody = joi.validate(body, schema);
        return validateBody;
    },

    searchUser: (req, res, next) => {
        const schema = joi.object().keys({
            query: joi.string().required(),
            limit: joi.number(),
            offset: joi.number()
        }).unknown(true);

        let validateBody = joi.validate(req.query, schema);
        if (validateBody.error ) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

}

module.exports = userValidator;