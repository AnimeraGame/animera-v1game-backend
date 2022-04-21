const _ = require("underscore")
const dbHandler = require('../DB');
const APIRef = 'Object Ref';
const moment = require('moment');

let objectFunctions = {

    getObjectNearby: (pos_x, pos_y, pos_z, rot_x, rot_y, rot_z, distance) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT  DISTINCT o.*, (SQRT((o.position_x - ?)*(o.position_x - ?) + (o.position_z - ?)*(o.position_z - ?)) - SQRT(o.bound_size_x * o.bound_size_x + o.bound_size_z * o.bound_size_z) / 2) AS distance FROM object as o HAVING distance < ? ORDER BY distance ASC`;
            dbHandler.mysqlQueryPromise(APIRef, 'getObjectNearby', query, [pos_x, pos_x, pos_z, pos_z, distance]).then((objectrows) => {
                resolve(objectrows);
            }).catch((error) => {
                reject(error);
            });
        });
    },
}

module.exports = objectFunctions;
