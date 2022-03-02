const dbHandler = require('../DB');
const NodeGeocoder = require('node-geocoder');
const request = require("request");

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('../config/index');


let commonFunctions = {

    get_location: (user_lat, user_long) => {

        let options = {
            provider: 'google',
            httpAdapter: 'https',
            apiKey: 'AIzaSyDM3MC_efR2vfyro_gp7uXOFmWveBhNq7Y',
            formatter: null
        };
        let geocoder = NodeGeocoder(options);

        return new Promise((resolve, reject) => {
            if (user_lat && user_long) {
                geocoder.reverse({
                    lat: user_lat,
                    lon: user_long
                }, function (err, result_geo) {

                    console.log(`error location:--- ${err}`);
                    console.log(`result location-----${result_geo}`);

                    if (err) {
                        resolve('invalid')
                    } else {
                        resolve(result_geo);
                    }
                });
            } else {

                console.log('no lat and long');

                let result_geo = 'invalid';
                resolve(result_geo);
            }
        });

    },

    badgeLevel: (gamesplayed, type) => {
        let level;
        if (gamesplayed < 5) {
            level = (type == 1) ? '$1000' : 'Wood';
        } else if (gamesplayed > 5 && gamesplayed < 15) {
            level = (type == 1) ? '$1000' : 'Wood';
        } else if (gamesplayed > 15 && gamesplayed < 25) {
            level = (type == 1) ? '$7500' : 'Iron';
        } else if (gamesplayed > 25 && gamesplayed < 35) {
            level = (type == 1) ? '$15000' : 'Bronze';
        } else if (gamesplayed > 35 && gamesplayed < 50) {
            level = (type == 1) ? '$35000' : 'Silver';
        } else if (gamesplayed > 50 && gamesplayed < 100) {
            level = (type == 1) ? '$135000' : 'Gold';
        } else if (gamesplayed > 100 && gamesplayed < 250) {
            level = (type == 1) ? '$525000' : 'Platinum';
        } else if (gamesplayed > 250) {
            level = (type == 1) ? '$1500000' : 'Diamond';
        }
        return level;

    },


    newLevelcheck: (element) => {
        let userlevel = {};
        let total_points

        if (element){
            let count25 = element.count25 ? element.count25 :0;
            let extra25 = element.extra25 ? element.extra25 :0;
            let count50 = element.count50 ? element.count50 :0;
            total_points = (count25 + count50 + 200 + extra25);
        } else {
            total_points = 200;
        }
               
        if (total_points < 501) {
            userlevel.level = 1;
            userlevel.points = total_points;
            userlevel.progress = total_points / 500;
        } else if (total_points > 501 && total_points < 1001) {
            userlevel.level = 2;
            userlevel.points = total_points;
            userlevel.progress = (total_points - 500) / 500;
        } else if (total_points > 1001 && total_points < 2001) {
            userlevel.level = 3;
            userlevel.points = total_points;
            userlevel.progress = (total_points - 1000) / 1000;
        } else if (total_points > 2001 && total_points < 3001) {
            userlevel.level = 4;
            userlevel.points = total_points;
            userlevel.progress = (total_points - 2000) / 1000;
        } else if (total_points > 3001 && total_points < 4001) {
            userlevel.level = 5;
            userlevel.points = total_points;
            userlevel.progress = (total_points - 3000) / 1000;
        } else if (total_points > 4001 && total_points < 5001) {
            userlevel.level = 6;
            userlevel.points = total_points;
            userlevel.progress = (total_points - 4000) / 1000;
        } else {
            userlevel.level = 7;
            userlevel.points = total_points;
            userlevel.progress = 1;
        }
        return userlevel;

    },

    bulkInsert: (table, objectArray, callback) => {
        if (objectArray.length == 0) {
            return;
        }
        let keys = Object.keys(objectArray[0]);
        let values = objectArray.map(obj => keys.map(key => obj[key]));
        let sql = 'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ?';

        dbHandler.mysqlQueryPromise('Insert', 'Bulk Insert function', sql, [values]).then((rows) => {
            console.log('bulkInsert',rows);
            callback(null, rows);

        }).catch((error) => {
            callback(error);
        });
    },


    bulkUpdate: (table, update_key, objectArray, callback) => {
        let tempArray = [];
        let arrKeys;

        let caseString = 'UPDATE ' + table + ' SET ';
        objectArray.forEach((item) => {
            tempArray.push(Object.values(item));
        })
        arrKeys = Object.keys(objectArray[0]);
        let k = 0;

        arrKeys.forEach((key) => {
            caseString += key + ' = (CASE';
            tempArray.forEach((item) => {
                caseString += ' WHEN ' + update_key + ' = ' + item[0] + ' THEN ' + '\'' + item[k] + '\'' + '\n';
            })
            k = k + 1;
            caseString += "ELSE " + key + " END),\n";
        })
        updateString = caseString.replace(/,\s*$/, "");
        dbHandler.mysqlQueryPromise('Update', 'Bulk Update function', updateString, []).then((rows) => {
            callback(null, rows);

        }).catch((error) => {
            callback(error);
        });

    },

    bulkGetData: (table, keyColoumn, idArray, callback) => {
        let sql = 'SELECT * from ' + table + ' where ' + keyColoumn + ' IN (?)';
        dbHandler.mysqlQueryPromise('GET', 'Get bulk data function', sql, [idArray]).then((rows) => {
            callback(null, rows);

        }).catch((error) => {
            callback(error);
        });
    },


    deleteData: (table, keyColoumn, id, callback) => {
        let sql = 'DELETE from ' + table + ' where ' + keyColoumn + ' = ?';
        dbHandler.mysqlQueryPromise('DELETE', 'delete function', sql, [id]).then((rows) => {
            callback(null, rows);

        }).catch((error) => {
            callback(error);
        });
    },


    insertSingleRow: (table, object, callback) => {
        let sql = 'INSERT INTO ' + table + ' SET ?';
        dbHandler.mysqlQueryPromise('INSERT', 'insertSingleRow', sql, [object]).then((rows) => {
            callback(null, rows);

        }).catch((error) => {
            callback(error);
        });
    },


    getSingleRow: (table, keyColoumn, id, callback) => {
        let sql = 'SELECT * from ' + table + ' where ' + keyColoumn + ' = ?';
        dbHandler.mysqlQueryPromise('GET', 'getSingleRow', sql, [id]).then((rows) => {
            callback(null, rows);

        }).catch((error) => {
            callback(error);
        });
    },

    insertSingleRowNew: (APIRef,table, object, event) => {
        return new Promise((resolve, reject) => {

            let sql = 'INSERT INTO ' + table + ' SET ?';
            dbHandler.mysqlQueryPromise(APIRef, event, sql, [object]).then((rows) => {
                resolve(rows);

            }).catch((error) => {
                reject(error);
            });
        })
    },

    getSingleRowNew: (APIRef,table, keyColoumn, id, event, queryString = '') => {
        return new Promise((resolve, reject) => {

            let sql = 'SELECT * from ' + table + ' where ' + keyColoumn + ' = ?' + queryString;
            dbHandler.mysqlQueryPromise(APIRef, event, sql, [id]).then((rows) => {
                resolve(rows);

            }).catch((error) => {
                reject(error);
            });
        })
    },


    deleteDataNew: (APIRef,table, keyColoumn, id, event,queryString = '') => {
        return new Promise((resolve, reject) => {

            let sql = 'DELETE from ' + table + ' where ' + keyColoumn + ' = ?'+ queryString;
            dbHandler.mysqlQueryPromise(APIRef, event, sql, [id]).then((rows) => {
                resolve(rows);

            }).catch((error) => {
                reject(error);
            });
        })
    },


    updateSingleRowNew: (APIRef,table, object,keyColoumn, id, event, queryString = '') => {
        return new Promise((resolve, reject) => {

            let sql = 'UPDATE ' + table + ' SET ? where '+ keyColoumn + ' = ?' + queryString;
            dbHandler.mysqlQueryPromise(APIRef, event, sql, [object,id]).then((rows) => {
                resolve(rows);

            }).catch((error) => {
                reject(error);
            });
        })
    },


    getAllRowNew: (APIRef,table, event) => {
        return new Promise((resolve, reject) => {

            let sql = 'SELECT * from ' + table;
            dbHandler.mysqlQueryPromise(APIRef, event, sql, []).then((rows) => {
                resolve(rows);

            }).catch((error) => {
                reject(error);
            });
        })
    },

}


module.exports = commonFunctions;