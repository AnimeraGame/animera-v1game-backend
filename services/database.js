const commonFunctions = require('../helperFunction/commonFunctions.js');
const dbHandler = require('../DB');
const APIRef = 'Database Record';


let databaseFunctions = {

    insertSingleRow: (table, object, event) => {

        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO ' + table + ' SET ?';
            dbHandler.mysqlQueryPromise(APIRef, event, sql, [object]).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getSingleRow: (table, keyColoumn, id, event, queryString = '') => {

        return new Promise((resolve, reject) => {
            let sql = 'SELECT * from ' + table + ' where ' + keyColoumn + ' = ?' + queryString;
            dbHandler.mysqlQueryPromise(APIRef, event, sql, [id]).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    deleteData: (table, keyColoumn, id, event) => {

        return new Promise((resolve, reject) => {
            let sql = 'DELETE from ' + table + ' where ' + keyColoumn + ' = ?';
            dbHandler.mysqlQueryPromise(APIRef, event, sql, [id]).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    updateSingleRow: (table, object, keyColoumn, id, event, queryString = '') => {

        return new Promise((resolve, reject) => {
            let sql = 'UPDATE ' + table + ' SET ? where ' + keyColoumn + ' = ?' + queryString;
            dbHandler.mysqlQueryPromise(APIRef, event, sql, [object, id]).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getAllRow: (table, event) => {

        return new Promise((resolve, reject) => {
            let sql = 'SELECT * from ' + table;
            dbHandler.mysqlQueryPromise(APIRef, event, sql, []).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

}



module.exports = databaseFunctions;