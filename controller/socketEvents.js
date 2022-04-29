const express = require('express');
const apn = require("apn");
const FCM = require('fcm-node');
const dbHandler = require('../DB');
const APIRef = 'New Chat';
const redisClient = require('../DB/redisClient');
const constants = require("../util/constants");
const responses = require("../util/responses");

const {
    user,
    race,
    commonFunctions,
    databaseServices,
} = require('../services/baseService.js')


module.exports = (io) => {
    let api = express.Router();

    io.on('connection', (socket) => {

        // Add User Event
        socket.on('addUser', async (userId) => {
            try {
                await redisClient.saveSocketToRedis(userId, socket.id);
                console.log("addUser", userId);
            } catch (e) {
                logger.error(e);
            }
        });

        // Disconnect Event
        socket.on('disconnect', function () {
            //console.log('socket disconnected from server for socket id',socket.id);
        });

        // Send Message Event
        socket.on('join_race', async (race_id, user_id, vehicle_id) => {

            console.log('user joined socked -------');
            console.log(user_id);

            let rows = await databaseServices.getSingleRow('user', 'user_id', user_id, 'Get user');
            let user_obj = rows[0];
            user_obj.vehicle_id = vehicle_id;

            let participants = await race.getParticipants(race_id);
            participants.forEach(async user => {
                let userSocket = await redisClient.getSocketFromRedis(user.user_id);
                io.to(userSocket).emit('user_joined', user_obj, async (receiver) => {
                    console.log(`group message received by: ${receiver}`);
                });
            });
        });

    });


    return api;
}