const mysql = require('mysql');
const environmentConfig = require('../config.json')[process.env.NODE_ENV];
const logger = require('../helperFunction/logger.js');

exports.mysqlQueryPromise = mysqlQueryPromise;

let dbConfig = {
    host: environmentConfig.host,
    user: environmentConfig.user,
    password: environmentConfig.password,
    database: environmentConfig.database,
    multipleStatements: true,
};

function initializeConnectionPool(dbConfig) {
    let numConnectionsInPool = 0;
    console.log('CALLING INITIALIZE POOL');
    const conn = mysql.createPool(dbConfig);
    conn.on('connection', function (connection) {
        numConnectionsInPool++;
    });
    return conn;
}

exports.connection = (function () {
    return initializeConnectionPool(dbConfig);
})();

const dbClient = {
    executeQuery: function (queryObject, callback, apiReference) {
        const sql = connection.query(queryObject.query, queryObject.args, function (err, result) {
            const event = queryObject.event || "Executing mysql query";

            if (err) {
                if (err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED') {
                    setTimeout(module.exports.dbHandler.executeQuery.bind(null, queryObject.query, queryObject.args, callback, apiReference), 50);
                } else {
                    callback(err, result, sql);
                }
            } else {
                callback(err, result);
            }
        });
    }
};

exports.dbHandler = (function () {
    return dbClient;
})();

function mysqlQueryPromise(apiReference, event, queryString, params) {
    return new Promise((resolve, reject) => {
        const query = connection.query(queryString, params, function (sqlError, sqlResult) {
           logger.query("Event:" + event + "\nAPI REF:" + apiReference + "\nQUERY:", "" + (query.sql).replace(/\n/g, ''));
            if (sqlError || !sqlResult) {
                if (sqlError) {
                    if (sqlError.code === 'ER_LOCK_DEADLOCK' || sqlError.code === 'ER_QUERY_INTERRUPTED') {
                        setTimeout(mysqlQueryPromise.bind(null, apiReference, event, queryString, params), 50);
                    } else {
                         reject({
                            ERROR: sqlError,
                            QUERY: query.sql,
                            Event: event
                        });
                    }
                }
            }
             resolve(sqlResult);
        });
    });
}

connection = initializeConnectionPool(dbConfig);


