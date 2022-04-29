const upload = require('../middleware/fileFunction.js')('race');
const raceValidator = require("../validator/race.js");
const APIRef = 'Race';
const constants = require("../util/constants");
const responses = require("../util/responses");
const CronJob = require('cron').CronJob;

const {
    _,
    race,
    routes,
    databaseServices,
    commonFunctions,
    Moment,
} = require('../services/baseService.js');

let Upload = upload.fields(
    [
        {
            name: 'race_name'
        }, 
        {
            name: 'race_trace',
        },
        {
            name: 'start_time'
        },
        {
            name: 'end_time'
        }, 
    ]
);

// Create Race
routes.post('/create', Upload, async function (req, res) {

    const languageCode = req.query.language;
    logger.request("API", req.protocol + '://' + req.get('host') + req.originalUrl);
    logger.request("Request Body", req.body);
    logger.request("Request Query", req.query);
    let validateBody = raceValidator.create(req.body);

    if (validateBody.error) {
        console.log("Signup Error: ", validateBody.error);
        let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
        return res.status(200).send(JSON.stringify(response));
    }

    let raceDetails = req.body;
    
    try {
        let race = {
            race_name: raceDetails.race_name,
            race_trace: raceDetails.race_trace,
            start_time: new Date(),
        };

        let raceRow = await databaseServices.insertSingleRow('race', race, 'Create a new Race');
        rows = await databaseServices.getSingleRow('race', 'race_id', raceRow.insertId, 'Get a inserted Race');

        responses.actionCompleteResponse(res, languageCode, rows[0], "Race created.", constants.responseMessageCode.ACTION_COMPLETE);
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});

// Get Available Race List
routes.get('/get_available_races', async (req, res) => {
    
    const languageCode = req.query.language;
    try {

        let raceRows = await race.getAvailableRaces();

        let promises = raceRows.map(element => {
            return new Promise((resolve, reject) => {
                let race_id = element.race_id;
                race.getParticipants(race_id).then((participantRows) => {
                    element.participants = participantRows;
                    resolve(element);
                });                     
            });
        });

        Promise.all(promises).then(raceDetails => {
            return responses.actionCompleteResponse(res, languageCode, raceDetails, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
        }).catch(error => {
            console.log(error);
        });

    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});

// Add participant to Race
routes.post('/add_participant', async function(req, res) {
    const languageCode = req.query.language;
    logger.request("API", req.protocol + '://' + req.get('host') + req.originalUrl);
    logger.request("Request Body", req.body);
    logger.request("Request Query", req.query);
    let validateBody = raceValidator.addParticipant(req.body);

    if (validateBody.error) {
        console.log("Race Join Error: ", validateBody.error);
        let response = responses.parameterMissingResponse(res, languageCode, validateBody.error.details[0].path[0]);
        return res.status(200).send(JSON.stringify(response));
    }

    let raceDetails = req.body;
    
    try {
        rows = await race.getSingleParticipant(raceDetails.race_id, raceDetails.user_id);
        if (rows.length > 0){
            responses.actionCompleteResponse(res, languageCode, {}, "User already joined.", constants.responseMessageCode.ACTION_COMPLETE);
        } else {
            let race_participant = {
                race_id: raceDetails.race_id,
                user_id: raceDetails.user_id,
                rank: 0
            };    
            let raceRow = await databaseServices.insertSingleRow('race_participant', race_participant, 'Add a participant to race');
            responses.actionCompleteResponse(res, languageCode, {}, "Add new participant.", constants.responseMessageCode.ACTION_COMPLETE);
        }        
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }
});

async function generateRace() {
    try {
        let date_obj = new Date();
        let race = {
            race_name: "TestRace_" + date_obj.getMinutes(),
            race_trace: "test",
            start_time: new Date(),
        };

        let raceRow = await databaseServices.insertSingleRow('race', race, 'Create a new Race');
    } catch (err) {
        console.log('Caught an error!', err);
    }
}
// Create Race every 10 minutes
const job = new CronJob('*/10 * * * *', async () => {
    generateRace();
}, null, null, null, null, true);

job.start();


module.exports = routes;