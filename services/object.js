const _ = require("underscore")
const dbHandler = require('../DB');
const APIRef = 'Object Ref';
const moment = require('moment');

let objectFunctions = {

    getObjectNearby: (pos_x, pos_y, pos_z, rot_x, rot_y, rot_z) => {

        const distance = 10;

        return new Promise((resolve, reject) => {
            let query = `SELECT  DISTINCT o.*, SQRT((o.position_x - ?)*(o.position_x - ?) + (o.position_y - ?)*(o.position_y - ?) + (o.position_z - ?)*(o.position_z - ?)) AS distance FROM object as o HAVING distance < ? ORDER BY distance ASC`;
            dbHandler.mysqlQueryPromise(APIRef, 'getObjectNearby', query, [pos_x, pos_x, pos_y, pos_y, pos_z, pos_z, distance]).then((objectrows) => {
                resolve(objectrows);
            }).catch((error) => {
                reject(error);
            });
        });
    },
}

module.exports = objectFunctions;
