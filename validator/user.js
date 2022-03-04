const joi = require('joi');
const constants = require("../util/constants");
const responses = require("../util/responses");

let userValidator = {
    getProfile : (req, res, next) => {
        const schema = joi.object().keys({
            
            friend_id: joi.string().required(),

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

    deleteAvailableDays : (req, res, next) => {
        const schema = joi.object().keys({
            
            day_id: joi.string().required(),

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
    updateDeviceToken : (req, res, next) => {
        const schema = joi.object().keys({
            
            device_token: joi.string().required(),
            device_type: joi.string().required(),

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

    getTeamByActivity : (req, res, next) => {
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

    shareApp : (req, res, next) => {
        const schema = joi.object().keys({
            
            timezone: joi.string().required(),

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

    userAchivements : (req, res, next) => {
        const schema = joi.object().keys({
            
            timezone: joi.string().required(),

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

    getSameUser : (req, res, next) => {
        const schema = joi.object().keys({
            
            user_lat: joi.string().required(),
            user_long: joi.string().required(),

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

    getPeopleNearby : (req, res, next) => {
        const schema = joi.object().keys({
            
            user_lat: joi.string().allow(""),
            user_long: joi.string().allow(""),

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

    configKeys : (req, res, next) => {
        const schema = joi.object().keys({
            
            device_type: joi.number().required(),
            environment: joi.number().required(),

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

    report : (req, res, next) => {
        const schema = joi.object().keys({
            
            type: joi.number().required(),
            reported_to: joi.number().required(),
            report_text: joi.string().required(),

        });

        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    block : (req, res, next) => {
        const schema = joi.object().keys({
            
            blocked_user_id: joi.string().required(),
        });

        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    userRating: (req, res, next) => {
        const schema = joi.object().keys({
            user_id: joi.number().required(),
            rating: joi.number().required(),
            package_id: joi.number().required(),
            compliment_id: joi.number(),
            thank_you_text: joi.string().allow(''),
            coach_rating_id: joi.number().required()
        });

        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },

    getUserRating: (req, res, next) => {
        const schema = joi.object().keys({
            user_id: joi.number().required(),
            last_id :  joi.number().allow(''),
            limit :  joi.number().allow(''),
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

    updateUserRating: (req, res, next) => {
        const schema = joi.object().keys({
            rating_id: joi.number().required(),
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


    replyUserRating: (req, res, next) => {
        const schema = joi.object().keys({
            rating_id: joi.number().required(),
            sender_id: joi.number().required(),
            reply_text: joi.string().required(),
            thread_id: joi.string().required(),
        });

        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },


    getUserReplyRating: (req, res, next) => {
        const schema = joi.object().keys({
            rating_id: joi.number().required(),
            last_id :  joi.number().allow(''),
            limit :  joi.number().allow(''),
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


    likeUser: (req, res, next) => {
        const schema = joi.object().keys({
            friend_id: joi.number().required(),
            like_status :  joi.number().required(),
        });

        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },


    editRatingReq: (req, res, next) => {
        const schema = joi.object().keys({
            user_id_to_request: joi.number().required(),
            rating_id: joi.number().required(),
            package_id: joi.number().required(),
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


    getUserSingleRating: (req, res, next) => {
        const schema = joi.object().keys({
            rating_id: joi.number().required(),
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


    likePreference: (req, res, next) => {
        const schema = joi.object().keys({
            friend_id: joi.number().required(),
            activity_id: joi.number().required(),
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


    likePreferencesUsers: (req, res, next) => {
        const schema = joi.object().keys({
            activity_id: joi.number().required(),
            friend_id: joi.number().required(),
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


    likeUserPhoto: (req, res, next) => {
        const schema = joi.object().keys({
            user_id: joi.number().required(),
            photo_id: joi.number().required(),
            like_status: joi.number().required()
        });

        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },


    getPhotoLikes: (req, res, next) => {
        const schema = joi.object().keys({
            user_id: joi.number().required(),
            limit: joi.number(),
            offset: joi.number(),
            search_string: joi.string(),
            photo_id: joi.number().required()
        });

        let validateBody = joi.validate(req.body, schema);
        if (validateBody.error) {
            let languageCode = req.query.language;
            let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
            return res.status(200).send(JSON.stringify(response));
        } else {
            next();
        }
    },


    getMyProfile: (req, res, next) => {
        const schema = joi.object().keys({
            language: joi.string()
        });

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


module.exports = userValidator;