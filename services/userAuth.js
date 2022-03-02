const md5 = require('md5');
const randomstring = require("randomstring");
const authenticateController = require('../middleware/authNew.js');
const commonFunctions = require('../helperFunction/commonFunctions.js');
const dbHandler = require('../DB');
const APIRef = 'User Auth';
const config = require('../config/index');


let userAuthFunctions = {

    getAllUser: () => {

        return new Promise((resolve, reject) => {
            let sql = "SELECT * from user";
            dbHandler.mysqlQueryPromise(APIRef, 'Login', sql, []).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    searchUser: (opts) => {
        let wallet_address = opts.query ? (opts.query).trim() : '';

        return new Promise((resolve, reject) => {
            let sql = `SELECT * from user where wallet_address = '${wallet_address}'`;
            dbHandler.mysqlQueryPromise(APIRef, 'Search User', sql, []).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        });
    }

}

getSingleUser = (data) => {
    return new Promise((resolve, reject) => {
        let condition = '';
        if (data.username) {
            condition = ` username = '${data.username}'`
        }
        if (data.wallet_address) {
            condition = ` wallet_address = '${data.wallet_address}'`
        }
        const query = `SELECT * FROM user WHERE ${condition} ORDER BY user_id DESC`;
        dbHandler.mysqlQueryPromise(APIRef, 'get single user', query, []).then((rows) => {
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}

userAuthFunctions.getSingleUser = getSingleUser;


module.exports = userAuthFunctions;