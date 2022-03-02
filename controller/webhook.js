const userValidator = require("../validator/userAuth.js");
const jwt = require('jsonwebtoken');
const authenticateController = require('../middleware/authNew.js');
const jwtDecode = require('jwt-decode')
const formidable = require('formidable');
const md5 = require('md5');
const dbHandler = require('../DB');
const config = require('../config/index');
const APIRef = 'Webhook Route';
const constants = require("../util/constants");
const responses = require("../util/responses");

const {
    routes,
    userAuth,
    databaseServices,
    adminServices,
} = require('../services/baseService.js')


convertTime = (unixtime) => {
    const time = Moment.unix(unixtime).format("YYYY-MM-DD HH:mm:ss");
    return time;

}

// Clear DB API
routes.get('/clearDB', async function (req, res) {

    const languageCode = req.query.language;
    try {

        await adminServices.clearDB();
        return responses.actionCompleteResponse(res, languageCode, {}, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);

    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});

module.exports = routes;