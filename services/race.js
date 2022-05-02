const _ = require("underscore")
const dbHandler = require('../DB');
const APIRef = 'Race Ref';

let raceFunctions = {

    getAvailableRaces: () => {
        return new Promise((resolve, reject) => {
            let query = `SELECT *, UNIX_TIMESTAMP(race.start_time + INTERVAL 10 MINUTE) - UNIX_TIMESTAMP(NOW()) AS time_left FROM race WHERE start_time >= NOW() - INTERVAL 10 MINUTE`;
            dbHandler.mysqlQueryPromise(APIRef, 'getRaceList', query, []).then((raceRows) => {
                resolve(raceRows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getParticipants: (race_id) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT *, rp.vehicle_id, rp.rank FROM user AS u INNER JOIN race_participant AS rp ON u.user_id = rp.user_id  WHERE rp.race_id = ${race_id} ORDER BY rp.rank`;
            dbHandler.mysqlQueryPromise(APIRef, 'getRaceParticipants', query, []).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        })
    },

    getSingleParticipant: (race_id, user_id) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM race_participant WHERE race_id = ${race_id} AND user_id = ${user_id}`;
            dbHandler.mysqlQueryPromise(APIRef, 'getRaceParticipant', query, []).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        })
    }
}

module.exports = raceFunctions;
