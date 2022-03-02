const joi = require('joi');
const constants = require("../util/constants");
const responses = require("../util/responses");

let adminValidator = {
  
    login: (req, res, next) => {
        const schema = joi.object().keys({
            email: joi.string().email().required(),
            password: joi.string().required()

        });
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    verifyOTP: (req, res, next) => {
        const schema = joi.object().keys({
            email_otp: joi.string().required(),
            phone_otp: joi.string().required()

        });
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    verify: (req, res, next) => {
        const schema = joi.object().keys({
            token: joi.string().required(),

        });
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    disableUser: (req, res, next) => {
        const schema = joi.object().keys({
            user_id: joi.string().required(),
            disable_status: joi.string().required(),
        });
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    userProfile: (req, res, next) => {
        const schema = joi.object().keys({
            user_id: joi.string().required(),
        });
        let validateBody = joi.validate(req.query, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    editUserProfile: (req, res, next) => {
        const schema = joi.object().keys({
            user_id: joi.string().required(),
        }).unknown(true);
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    editLinkupActivity: (req, res, next) => {
        const schema = joi.object().keys({
            linkup_id: joi.string().required(),
        }).unknown(true);
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    editEvent: (req, res, next) => {
        const schema = joi.object().keys({
            event_id: joi.string().required(),
        }).unknown(true);
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    editGroupActivity: (req, res, next) => {
        const schema = joi.object().keys({
            group_id: joi.string().required(),
        }).unknown(true);
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    addPreference: (req, res, next) => {
        const schema = joi.object().keys({
            activity_name: joi.string().required(),
            activity_type: joi.string().required(),
        }).unknown(true);
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    editPreference: (req, res, next) => {
        const schema = joi.object().keys({
            activity_id: joi.string().required(),
        }).unknown(true);
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    deleteUser: (req, res, next) => {
        const schema = joi.object().keys({
            user_id: joi.string().required()
        });
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.body.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    activityTranslation: (req, res, next) => {
        const schema = joi.object().keys({
            activity_id: joi.string().required(),
        }).unknown(true);
        let validateBody = joi.validate(req.query, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    addActivityTranslation: (req, res, next) => {
        const schema = joi.object().keys({
            translation: joi.array().required(),
        }).unknown(true);
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    deleteActivityTranslation: (req, res, next) => {
        const schema = joi.object().keys({
            activity_translation_ids: joi.string().required(),
        }).unknown(true);
        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

}    


module.exports = adminValidator;