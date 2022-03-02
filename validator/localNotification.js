const joi = require('joi');
const constants = require("../util/constants");
const responses = require("../util/responses");

let notificationValidator = {
    getNotification : (req, res, next) => {
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


    changeReadStatus : (req, res, next) => {
        const schema = joi.object().keys({
            
            notification_id: joi.string().required(),

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

module.exports = notificationValidator;