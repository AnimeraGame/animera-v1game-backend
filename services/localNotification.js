const Moment = require('moment-timezone');
const dbHandler = require('../DB');
const APIRef = 'Local Notification';


getLocalNotification = (data, user_id) => {
    return new Promise((resolve, reject) => {

        let timezone = data.timezone;
        let date = Moment().tz(timezone).format('YYYY-MM-DD HH:mm:00');

        dbHandler.mysqlQueryPromise(APIRef, 'getLocalNotification', "(SELECT l.* , a.activity_name,a.activity_pic,u.first_name,u.last_name,u.user_pic  FROM linkup_new AS l JOIN activity AS a ON a.activity_id=l.activity_id JOIN linkup_new_details AS ln ON ln.linkup_parent_id=l.linkup_id JOIN user AS u ON u.user_id=l.linkup_user_id WHERE FIND_IN_SET(?,ln.link_group_friend_accept) AND l.linkup_end_time > ? AND l.linkup_status=1 AND u.user_status != 0) UNION (SELECT l.* ,a.activity_name,a.activity_pic,u.first_name,u.last_name,u.user_pic  FROM linkup_new AS l JOIN activity AS a ON a.activity_id=l.activity_id JOIN linkup_new_details AS ln ON ln.linkup_parent_id=l.linkup_id JOIN user AS u ON u.user_id=l.linkup_user_id WHERE `linkup_user_id` =? AND l.linkup_end_time > ? AND l.linkup_status=1 AND u.user_status != 0)  ORDER BY linkup_id DESC", [user_id, date, user_id, date]).then((activeLinkups) => {


            dbHandler.mysqlQueryPromise(APIRef, 'getLocalNotification', "(SELECT e.*,a.*,u.first_name,u.type,u.user_pic FROM event AS e JOIN user AS u ON u.user_id=e.user_id JOIN activity AS a ON a.activity_id=e.activity_id WHERE e.user_id = ? AND e.event_end_time>=? AND u.user_status != 0) UNION (SELECT e.*,a.*,u.first_name,u.type,u.user_pic FROM event AS e JOIN user AS u ON u.user_id=e.user_id JOIN activity AS a ON a.activity_id=e.activity_id WHERE FIND_IN_SET(?,e.friend_id) AND e.event_end_time>=? AND u.user_status != 0)", [user_id, date, user_id, date]).then((activeEvents) => {

                for (let i = 0; i < activeLinkups.length; i++) {
                    activeLinkups[i]['notification_type'] = 'linkup';
                    activeLinkups[i]['enable_notification'] = 0;
                }

                for (let j = 0; j < activeEvents.length; j++) {
                    activeEvents[j]['notification_type'] = 'event';
                    activeEvents[j]['enable_notification'] = 0;
                }

                let localNotification = activeLinkups.concat(activeEvents);
                for (let k = 0; k < localNotification.length; k++) {
                    let value = k + 1;
                    localNotification[k]['id'] = value;
                }

                resolve(localNotification);

            }).catch((error) => {
                reject(error);
            });

        }).catch((error) => {
            reject(error);
        });

    });
}


LocalNotification = (data, userId) => {
    return new Promise((resolve, reject) => {

        let lastId = data.last_id ? data.last_id : '';
        let limitt = data.limit ? data.limit : 15;
        let limit = parseInt(limitt);
        let queryString = '';

        if (lastId.trim() != '') {
            queryString = "AND notification_id < " + lastId;
        }
        dbHandler.mysqlQueryPromise(APIRef, 'LocalNotification', "SELECT n.* , u.first_name, u.last_name, u.user_pic FROM notification_new as n JOIN user AS u ON u.user_id=n.notification_friend_id WHERE notification_user_id=? " + queryString + " AND u.user_status != 0 ORDER BY  notification_id DESC LIMIT " + limit + "", [userId]).then((notificatiions) => {

            if (notificatiions.length > 0) {
                for (let i = 0; i < notificatiions.length; i++) {
                    if (notificatiions[i].notification_payload) {
                        notificatiions[i].notification_payload = JSON.parse(notificatiions[i].notification_payload);
                    }
                }
            }

            dbHandler.mysqlQueryPromise(APIRef, 'LocalNotification', "SELECT COUNT(notification_id) as countRead FROM notification_new WHERE notification_user_id = ? And notification_read_status = 0", [userId]).then((count) => {

                let data = {
                    Unread_count: count[0].countRead,
                    notificatiions: notificatiions
                }
                resolve(data);

            }).catch((error) => {
                reject(error);
            });

        }).catch((error) => {
            reject(error);
        });

    });
}


changeReadStatus = (data) => {
    return new Promise((resolve, reject) => {

        let notificationId = data.notification_id;
        dbHandler.mysqlQueryPromise(APIRef, 'changeReadStatus', "UPDATE notification_new SET notification_read_status = 1 WHERE notification_id=?", [notificationId]).then((updateStatus) => {
            resolve();
        }).catch((error) => {
            reject(error);
        });

    });
}


allNotificationType = () => {

    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'allNotificationType', "SELECT * FROM notification_new_type ", []).then((notification_type) => {
            resolve(notification_type);
        }).catch((error) => {
            reject(error);
        });

    });
}


deleteNotification = (notificationId) => {

    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'deleteNotification', "DELETE FROM notification_new WHERE notification_id = ?", [notificationId]).then((updateStatus) => {
            resolve();
        }).catch((error) => {
            reject(error);
        });

    });
}


getGroups = () => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get Groups', `SELECT g.*, a.activity_name FROM group_activity AS g INNER JOIN activity AS a ON a.activity_id = g.group_activity_id`, []).then((rows) => {
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });

    });
}


getActivities = () => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get Activities', `SELECT l.*, a.activity_name FROM linkup_new AS l INNER JOIN activity AS a ON a.activity_id = l.activity_id`, []).then((rows) => {
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });

    });
}


module.exports = {
    getLocalNotification,
    LocalNotification,
    changeReadStatus,
    allNotificationType,
    deleteNotification,
    getGroups,
    getActivities
}