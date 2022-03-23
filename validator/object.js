const joi = require('joi');
const constants = require("../util/constants");
const responses = require("../util/responses");

let userValidator = {
    getObjectNearby : (req, res, next) => {
        const schema = joi.object().keys({
            
            position_x: joi.string().allow(""),
            position_y: joi.string().allow(""),
            position_z: joi.string().allow(""),

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

}    


module.exports = userValidator;