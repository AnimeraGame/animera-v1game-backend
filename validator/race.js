const joi = require('joi');
const constants = require("../util/constants");
const responses = require("../util/responses");

let raceValidator = {
    create: (body) => {
        const schema = joi.object().keys({
            race_name: joi.string().required(),
            race_trace: joi.string().required(),
        }).unknown(true);

        let validateBody = joi.validate(body, schema);
        return validateBody;
    },

    addParticipant: (body) => {
        const schema = joi.object().keys({
            race_id: joi.number().required(),
            user_id: joi.number().required(),
        }).unknown(true);

        let validateBody = joi.validate(body, schema);
        return validateBody;
    }
}    


module.exports = raceValidator;