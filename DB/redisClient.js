const redis = require("ioredis");
const config = require('../config/index');
const constants = require("../util/constants");
const redisConfig = {
    host: config.redisHost,
    port: config.redisPort
}
let client = new redis(redisConfig);
client.on("error", function (err) {
    console.log("Error Redis", err);
});
client.on("ready", function (err) {
    console.log("Redis Connected... ", err);
});
exports.saveSocketToRedis = function (userId, socketId) {
    const redisUser = constants.redisConnection.DEVELOPMENT_USER;
    userId = redisUser + userId;
    return new Promise((resolve, reject) => {
        client.get(userId.toString(), function (err, obj) {
            if (err) {
                reject(400);
            } else {
                if (obj) {
                    client.del(obj);
                }
                client.set(userId.toString(), socketId);
                resolve(200);
            }
        })
    });
};
exports.saveLastSeenToRedis = function (userId, date) {
    return new Promise((resolve, reject) => {
        client.get(userId.toString(), function (err, obj) {
            if(err){
                reject(400);
            } else {
                if (obj) {
                    client.del(obj);
                }
                client.set(userId.toString(), date);
                resolve(200);
            }
        })
    });
}
exports.removeSocketRedis = function (userId) {
    return new Promise((resolve, reject) => {
        client.get(userId.toString(), function (err, obj) {
            if (obj) {
                client.del(obj);
                resolve(200);
            } else {
                reject(400);
            }
        })
    });
};
exports.getSocketFromRedis = function (userId) {
    return new Promise((resolve, reject) => {
        try{
            const redisUser = constants.redisConnection.DEVELOPMENT_USER;
            userId = redisUser + userId;
            client.get(userId.toString(), function (err, socketId) {
                if(socketId){
                    resolve(socketId);
                }
                else{
                    resolve(undefined);
                }
            });
        } catch (error) {
            resolve(undefined);
            console.log(error);
        }
    });
};
exports.getLastSeenFromRedis = function (userId) {
    return new Promise((resolve, reject) => {
        try{
            client.get(userId.toString(), function (err, date) {
                if(date){
                    resolve(date);
                }
                else{
                    resolve(undefined);
                }
            });
        } catch (error) {
            resolve(undefined);
            console.log(error);
        }
    });
}