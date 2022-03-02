const _ = require("underscore")
const dbHandler = require('../DB');
const APIRef = 'User Auth';
const moment = require('moment');


checkPassword = (userId) => {

    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Add new coach', "SELECT * FROM user WHERE user_id = ? AND user_status != 0", [userId]).then((rows) => {
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}

getNearByUsers = (data, userId) => {

    let latitude = data.user_lat ? data.user_lat : '';
    let longitude = data.user_long ? data.user_long : '';
    let searchStr = data.name ? data.name : '';
    let distance = data.distance ? data.distance : 100;

    return new Promise((resolve, reject) => {
        let query = "SELECT u.*,((SELECT CASE WHEN u.user_id IN ((SELECT f.user_id FROM friend_request AS f WHERE (f.user_id = u.user_id OR f.friend_id = u.user_id) AND (f.user_id = ? OR f.friend_id = ?) AND f.status='accept')) THEN true ELSE false END AS Favourite)OR(SELECT CASE WHEN u.user_id IN ((SELECT f.friend_id FROM friend_request AS f WHERE (f.user_id = u.user_id OR f.friend_id = u.user_id) AND (f.user_id = ? OR f.friend_id = ?) AND f.status='accept')) THEN true ELSE false END AS Favouritee)) AS friend FROM user AS u WHERE u.user_id!=? AND type='personal' AND u.user_status != 0 AND (CONCAT(u.first_name,' ',u.last_name) LIKE '%" + searchStr + "%' OR u.email LIKE '%" + searchStr + "%')";

        let value = [userId, userId, userId, userId, userId];

        dbHandler.mysqlQueryPromise(APIRef, 'get nearby users', query, value).then((nearbyuser) => {
            resolve(nearbyuser);
        }).catch((error) => {
            reject(error);
        });
    });
}

let userFunctions = {

    getUserProfileAfterEdit: (user_id) => {
        return new Promise((resolve, reject) => {
            let query = "SELECT * , (SELECT COUNT(linkup_id) + (SELECT count(*) FROM `linkup_new` WHERE `linkup_user_id` = ? AND linkup_end_time < CONVERT_TZ(now(),'GMT',timezone) AND linkup_single_activity = 1) FROM `linkup_new` ln JOIN linkup_new_details AS ld ON ln.linkup_id = ld.linkup_parent_id WHERE FIND_IN_SET(?,ld.link_group_friend_accept) AND linkup_end_time < CONVERT_TZ(now(),'GMT',timezone)) as linkup_count , (SELECT COUNT(event_id) as event_count FROM `event` WHERE FIND_IN_SET(?,friend_id) AND event_end_time<CONVERT_TZ(now(),'GMT',event_timezone)) as event_count,(SELECT CASE WHEN((SELECT `status` FROM friend_request WHERE user_id = ? AND friend_id = ?) = 'pending') THEN 2 WHEN((SELECT `status` FROM friend_request WHERE user_id = ? AND friend_id = ?)= 'accept') THEN 1 WHEN((SELECT `status` FROM friend_request WHERE user_id = ? AND friend_id = ?) = 'accept') THEN 1  WHEN((SELECT `status` FROM friend_request WHERE user_id = ? AND friend_id = ?) = 'pending') THEN 3 ELSE 0 END) AS friend , IFNULL(TIMESTAMPDIFF(YEAR, dob, CURDATE()),0) AS age ,(SELECT COUNT(*) FROM linkup_new ln JOIN linkup_new_details AS ld WHERE ((linkup_user_id =u.user_id)  AND linkup_end_time <= CONVERT_TZ(now(),'GMT',timezone)) OR (FIND_IN_SET(?,ld.link_group_friend_accept) AND `linkup_end_time` < CONVERT_TZ(now(),'GMT',timezone))) AS gamesPlayed,IFNULL((select count(*) from coach where coach_user_id = ?),0) AS is_coach FROM user AS u WHERE user_id = ? AND user_status != 0";

            let value = [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id,user_id];

            dbHandler.mysqlQueryPromise(APIRef, 'get user profile', query, value).then((user) => {
                resolve(user);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    
    getLinkupAfterEdit: (user_id) => {
        return new Promise((resolve, reject) => {
            let query = "SELECT (SELECT (count(linkup_id))*25 FROM `linkup_new` WHERE linkup_user_id = ?)as count25, (SELECT (count(`link_group_id`)*25)as summm FROM linkup_new_details as ld JOIN linkup_new as l ON l.linkup_id= ld.linkup_parent_id WHERE l.linkup_end_time <now() AND FIND_IN_SET(?,ld.link_group_friend_accept)) as extra25, (SELECT(count(event_id))*50 FROM `event` WHERE FIND_IN_SET(?,(friend_id)) AND event_end_time < now() ) as count50 FROM event LIMIT 1";

            let value = [user_id, user_id, user_id];

            dbHandler.mysqlQueryPromise(APIRef, 'get user profile', query, value).then((user) => {
                resolve(user);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getUserProfile: (userId, friendId) => {

        return new Promise((resolve, reject) => {
            let query = "SELECT u.*, (SELECT COUNT(*) as friend_requests_count FROM friend_request WHERE friend_id= ? AND status='pending') as friend_requests_count, (SELECT COUNT(linkup_id) + (SELECT count(*) FROM `linkup_new` WHERE `linkup_user_id` = ? AND linkup_end_time < CONVERT_TZ(now(),'GMT',timezone) AND linkup_single_activity = 1) FROM `linkup_new` ln JOIN linkup_new_details AS ld ON ln.linkup_id = ld.linkup_parent_id WHERE FIND_IN_SET(?,ld.link_group_friend_accept) AND linkup_end_time < CONVERT_TZ(now(),'GMT',timezone)) as linkup_count, (SELECT COUNT(event_id) as event_count FROM `event` WHERE FIND_IN_SET(?,friend_id) AND event_end_time<CONVERT_TZ(now(),'GMT',event_timezone)) as event_count,(SELECT CASE WHEN((SELECT `status` FROM friend_request WHERE user_id = ? AND friend_id = ?) = 'pending') THEN 2 WHEN((SELECT `status` FROM friend_request WHERE user_id = ? AND friend_id = ?)= 'accept') THEN 1 WHEN((SELECT `status` FROM friend_request WHERE user_id = ? AND friend_id = ?) = 'accept') THEN 1  WHEN((SELECT `status` FROM friend_request WHERE user_id = ? AND friend_id = ?) = 'pending') THEN 3 ELSE 0 END) AS friend, (SELECT id FROM friend_request WHERE user_id = u.user_id AND friend_Id = ? AND status = 'pending') as id, IFNULL(TIMESTAMPDIFF(YEAR, u.dob, CURDATE()),0) AS age,(SELECT COUNT(*) FROM linkup_new ln JOIN linkup_new_details AS ld WHERE ((linkup_user_id =u.user_id)  AND linkup_end_time<= CONVERT_TZ(now(),'GMT',timezone)) OR (FIND_IN_SET(?,ld.link_group_friend_accept) AND `linkup_end_time` <CONVERT_TZ(now(),'GMT',timezone))) AS gamesPlayed ,IFNULL((select count(*) from coach where coach_user_id = ?),0) AS is_coach ,IFNULL((select coach_status from coach where coach_user_id = ?),0) AS coach_status, IFNULL((SELECT like_status FROM user_like WHERE user_id = ? AND friend_id = ?),0) as is_like, (SELECT count(DISTINCT like_id) as likes FROM user_like as likes WHERE friend_id = ?) as likes, (SELECT CASE WHEN((SELECT request_status FROM chat_requests WHERE user_id = ? AND friend_id = u.user_id)) THEN 1 WHEN(SELECT request_status FROM chat_requests WHERE user_id = u.user_id AND friend_id = ?) THEN 2 ELSE 0 END) AS chat_sender_status, IFNULL((SELECT request_status FROM chat_requests WHERE ((user_id = u.user_id AND friend_id = ?) OR (user_id = ? AND friend_id = u.user_id))),0) AS chat_request_status, IFNULL((SELECT request_id FROM chat_requests WHERE ((user_id = u.user_id AND friend_id = ?) OR (user_id = ? AND friend_id = u.user_id))),0) AS chat_request_id, IFNULL((SELECT conversation_id FROM conversation WHERE ((conversation_user_id = u.user_id AND conversation_friend_id = ?) OR (conversation_user_id = ? AND conversation_friend_id = u.user_id))),0) AS conversation_id, IFNULL((SELECT 1 FROM report WHERE reported_to = u.user_id AND reported_by = ? LIMIT 1),0) as is_reported FROM user AS u WHERE u.user_id=? AND u.user_status != 0";

            let value = [friendId, friendId, friendId, userId, userId, friendId, userId, friendId, friendId, userId, friendId, userId, userId, friendId, friendId, friendId, userId, friendId, friendId, userId, userId, userId, userId, userId, userId, userId, userId, userId, friendId];

            dbHandler.mysqlQueryPromise(APIRef, 'get user profile', query, value).then((user) => {
                resolve(user);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getUserData: (userId, friendId, lastId, limit) => {

        return new Promise((resolve, reject) => {
            let subQuery = '';
            if (lastId) {
                subQuery = ' AND f.feed_id < ' + lastId;
            }
            let query = "SELECT f.*,u.*,(SELECT COUNT(*) FROM comments WHERE feed_id =f.feed_id) AS commentCount,(SELECT COUNT(*) FROM likes WHERE feed_id =f.feed_id) AS likeCount,(SELECT CASE WHEN f.feed_id IN (SELECT feed_id FROM likes AS l WHERE l.user_id = ? AND l.feed_id = f.feed_id) THEN true ELSE false END AS Favourite) AS is_liked,(SELECT IFNULL((SELECT comment FROM comments WHERE feed_id = f.feed_id ORDER BY comment_id DESC LIMIT 1),'' )) AS comment1,(SELECT IFNULL((SELECT CONCAT(p.first_name,' ',p.last_name) FROM comments AS c JOIN user AS p ON c.user_id = p.user_id WHERE c.feed_id =f.feed_id ORDER BY c.comment_id DESC LIMIT 1),'' )) AS comment1_user_name,(SELECT IFNULL((SELECT comment FROM comments WHERE comment_id<(SELECT comment_id FROM comments WHERE feed_id = f.feed_id ORDER BY comment_id DESC LIMIT 1)AND feed_id = f.feed_id ORDER BY comment_id DESC LIMIT 1),'')) AS comment2,(SELECT IFNULL((SELECT CONCAT(p.first_name,' ',p.last_name) FROM comments AS c JOIN user AS p ON c.user_id = p.user_id WHERE c.comment_id<(SELECT comment_id FROM comments WHERE feed_id = f.feed_id ORDER BY comment_id DESC LIMIT 1) AND c.feed_id =f.feed_id ORDER BY comment_id DESC LIMIT 1 ),'')) AS comment2_user_name FROM feed AS f JOIN user AS u ON u.user_id = f.user_id WHERE f.user_id = (" + friendId + ") " + subQuery + " AND u.user_status != 0 ORDER BY f.feed_id DESC LIMIT " + limit + "";

            let value = [userId];

            dbHandler.mysqlQueryPromise(APIRef, 'get user profile', query, value).then((feeds) => {
                resolve(feeds);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getUserActivity: (friendId, userId) => {

        return new Promise((resolve, reject) => {
            let query = "SELECT a.*,(SELECT CASE WHEN a.activity_id IN (SELECT u.activity_id FROM user_games AS u WHERE u.user_id = ? AND u.activity_id = activity_id ) THEN true ELSE false END) AS selected, IFNULL((select like_status from user_like_preferences where user_id = ? AND friend_id = ? AND activity_id = a.activity_id),0) AS is_like, IFNULL((select like_status from linkup_interested where user_id = ? AND friend_id = ? AND activity_id = a.activity_id),0) AS requested, (SELECT count(DISTINCT like_id) as likes FROM user_like_preferences as likes WHERE friend_id = ? AND activity_id = a.activity_id) as likes FROM activity AS a WHERE a.active_status = 1 ORDER BY a.activity_name ASC";
            dbHandler.mysqlQueryPromise(APIRef, 'get user profile', query, [friendId, userId, friendId, userId, friendId, friendId]).then((activity) => {
                resolve(activity);
            }).catch((error) => {
                reject(error);
            });
        });
    },


    getLevelPoints: (friendId) => {

        return new Promise((resolve, reject) => {
            let query = "SELECT (SELECT (count(linkup_id))*25 FROM `linkup_new` WHERE linkup_user_id = ? )as count25, (SELECT (count(`link_group_id`)*25)as summm FROM linkup_new_details as ld JOIN linkup_new as l ON l.linkup_id= ld.linkup_parent_id WHERE l.linkup_end_time <now() AND FIND_IN_SET(?,ld.link_group_friend_accept)) as extra25, (SELECT(count(event_id))*50 FROM `event` WHERE FIND_IN_SET(?,(friend_id)) AND event_end_time < now() ) as count50 FROM event LIMIT 1";
            dbHandler.mysqlQueryPromise(APIRef, 'get user profile', query, [friendId, friendId, friendId]).then((sum) => {
                resolve(sum);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getLevelPointsNew: (friendId) => {

        return new Promise((resolve, reject) => {
            let query = "SELECT (SELECT (count(linkup_id))*25 FROM `linkup_new` WHERE linkup_user_id = ?)as count25, (SELECT (count(`link_group_id`)*25)as summm FROM linkup_new_details as ld JOIN linkup_new as l ON l.linkup_id= ld.linkup_parent_id WHERE l.linkup_end_time <now() AND FIND_IN_SET(?,ld.link_group_friend_accept) ) as extra25, (SELECT(count(event_id))*50 FROM `event` WHERE FIND_IN_SET(?,(friend_id)) AND event_end_time < now() ) as count50 FROM event LIMIT 1";
            dbHandler.mysqlQueryPromise(APIRef, 'get user profile', query, [friendId, friendId, friendId]).then((sum) => {
                resolve(sum);
            }).catch((error) => {
                reject(error);
            });
        });
    },


    getUser: (userId) => {

        return new Promise((resolve, reject) => {
            dbHandler.mysqlQueryPromise(APIRef, 'get brands team', "SELECT u.* FROM user AS u WHERE u.user_id=? AND u.user_status != 0", [userId]).then((user) => {
                resolve(user);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getAllBrand: (id) => {

        return new Promise((resolve, reject) => {
            dbHandler.mysqlQueryPromise(APIRef, 'get brands team', "SELECT *,(CASE WHEN (FIND_IN_SET(brand_id, ?)) THEN '1'  ELSE '0' END) as selected FROM `user_detail_barnds` ", [id]).then((allBrand) => {
                resolve(allBrand);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getAllTeam: (id) => {

        return new Promise((resolve, reject) => {
            dbHandler.mysqlQueryPromise(APIRef, 'get brands team', "SELECT *, (CASE WHEN (FIND_IN_SET(team_id, ?)) THEN '1'  ELSE '0' END) as selected from user_detail_fav_team ", [id]).then((allTeam) => {
                resolve(allTeam);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getShareCount: (id) => {

        return new Promise((resolve, reject) => {
            dbHandler.mysqlQueryPromise(APIRef, 'share app', "SELECT count(*) as share_count FROM `user_share_data` WHERE share_user_id =?", [id]).then((shareCount) => {
                resolve(shareCount);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getShareData: (date, id) => {

        return new Promise((resolve, reject) => {
            let query = "SELECT DATEDIFF(now(),user_created_on) AS tot_days ,(SELECT count(`link_group_id`) + (SELECT count(*) FROM linkup_new WHERE linkup_user_id = ? AND linkup_single_activity = 1) FROM linkup_new_details as ld JOIN linkup_new as l ON l.linkup_id= ld.linkup_parent_id WHERE l.linkup_end_time < ? AND FIND_IN_SET(?,ld.link_group_friend_accept)) as tot_linkup_complete, (SELECT count(*) FROM `user_share_data` WHERE `share_user_id` =?) as tot_share, (SELECT count(*) FROM `linkup_new` WHERE `linkup_user_id` = ?) as tot_linkup_created ,(SELECT count(DISTINCT linkup_city) as tot_city FROM `linkup_new` as l  WHERE linkup_user_id = ? AND linkup_city !='') as tot_city, (SELECT count(DISTINCT linkup_country) as tot_country FROM linkup_new  WHERE linkup_user_id = ? AND linkup_country != '') as tot_country FROM `user` WHERE user_id =? AND user_status != 0 ";

            dbHandler.mysqlQueryPromise(APIRef, 'share app', query, [id, date, id, id, id, id, id, id]).then((rows) => {
                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getUsertoken: (id) => {

        return new Promise((resolve, reject) => {
            dbHandler.mysqlQueryPromise(APIRef, 'share app', "SELECT u.user_id as id ,CONCAT(u.first_name, u.last_name) as name ,u.user_pic, u.device_token, u.device_type FROM user AS u WHERE user_id = ? AND u.user_status != 0", [id]).then((userrow) => {
                resolve(shareCount);
            }).catch((error) => {
                reject(error);
            });
        });
    },


    getAchievementData: (userId, date) => {

        return new Promise((resolve, reject) => {
            let query = "SELECT DATEDIFF(now(),user_created_on) AS tot_days ,(SELECT count(link_group_id) + (SELECT count(*) FROM linkup_new WHERE linkup_user_id = ? AND linkup_end_time < ? AND linkup_single_activity = 1)  FROM linkup_new_details as ld JOIN linkup_new as l ON l.linkup_id= ld.linkup_parent_id WHERE l.linkup_end_time < ? AND FIND_IN_SET(?,ld.link_group_friend_accept)) as tot_linkup_complete, (SELECT count(*) FROM `user_share_data` WHERE `share_user_id` =?) as tot_share, (SELECT count(*) FROM `linkup_new` WHERE `linkup_user_id` = ?) as tot_linkup_created ,(SELECT count(DISTINCT linkup_city) as tot_city FROM `linkup_new` as l  WHERE linkup_user_id = ? AND linkup_city !='') as tot_city, (SELECT count(DISTINCT linkup_country) as tot_country FROM linkup_new  WHERE linkup_user_id = ? AND linkup_country != '') as tot_country FROM `user` WHERE user_id =? AND user_status != 0 ";

            dbHandler.mysqlQueryPromise(APIRef, 'user achievement', query, [userId, date, date, userId, userId, userId, userId, userId, userId]).then((rows) => {

                resolve(rows);
            }).catch((error) => {
                reject(error);
            });
        });
    },


    getToalFriends: (userId) => {

        return new Promise((resolve, reject) => {
            let query = "(SELECT friend_id  FROM friend_request WHERE status='accept' AND user_id = ?) UNION (SELECT user_id  FROM friend_request WHERE status='accept' AND friend_id = ?) UNION (SELECT (org_followed_id) as friend_id FROM organization_follow WHERE org_follower_id =?)";
            dbHandler.mysqlQueryPromise(APIRef, 'getFriendsFeeds', query, [userId, userId, userId]).then((totalFriends) => {
                resolve(totalFriends);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getFriendFeeds: (userId, friendsArr, lastId, limit) => {
        let subQuery = '';
        if (lastId != '') {
            subQuery = ' AND f.feed_id < ' + last_id + ' ';
        }

        return new Promise((resolve, reject) => {
            let query = "SELECT f.*,u.*,(SELECT COUNT(*) FROM comments WHERE feed_id =f.feed_id) AS commentCount,(SELECT COUNT(*) FROM likes WHERE feed_id =f.feed_id) AS likeCount,(SELECT CASE WHEN f.feed_id IN (SELECT feed_id FROM likes AS l WHERE l.user_id = ? AND l.feed_id = f.feed_id) THEN true ELSE false END AS Favourite) AS is_liked,(SELECT IFNULL((SELECT comment FROM comments WHERE feed_id = f.feed_id ORDER BY comment_id DESC LIMIT 1),'' )) AS comment1,(SELECT IFNULL((SELECT CONCAT(p.first_name,' ',p.last_name) FROM comments AS c JOIN user AS p ON c.user_id = p.user_id WHERE c.feed_id =f.feed_id  AND p.user_status != 0 ORDER BY c.comment_id DESC LIMIT 1),'' )) AS comment1_user_name,(SELECT IFNULL((SELECT comment FROM comments WHERE comment_id<(SELECT comment_id FROM comments WHERE feed_id = f.feed_id ORDER BY comment_id DESC LIMIT 1)AND feed_id = f.feed_id ORDER BY comment_id DESC LIMIT 1),'')) AS comment2,(SELECT IFNULL((SELECT CONCAT(p.first_name,' ',p.last_name) FROM comments AS c JOIN user AS p ON c.user_id = p.user_id WHERE c.comment_id<(SELECT comment_id FROM comments WHERE feed_id = f.feed_id ORDER BY comment_id DESC LIMIT 1) AND c.feed_id =f.feed_id AND p.user_status != 0 ORDER BY comment_id DESC LIMIT 1 ),'')) AS comment2_user_name FROM feed AS f JOIN user AS u ON u.user_id = f.user_id WHERE f.user_id IN (" + friendsArr[0].join() + ")  " + subQuery + " AND u.user_status != 0  ORDER BY f.feed_id DESC LIMIT " + limit + "";
            dbHandler.mysqlQueryPromise(APIRef, 'getFriendsFeeds', query, [userId]).then((feeds) => {
                resolve(feeds);
            }).catch((error) => {
                reject(error);
            });
        });
    },


    getUserWithFind: (userId) => {

        return new Promise((resolve, reject) => {
            dbHandler.mysqlQueryPromise(APIRef, 'getSamePreferencesUser', "SELECT u.* FROM user as u WHERE u.user_id =?  AND u.user_find_me = 1 AND u.user_status = 1", [userId]).then((userRow) => {
                resolve(userRow);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getUserActivityRows: (userId, searchStr, lastId, prefrencesArray, limit, userLong, userLat, distance) => {

        let searchQuery = "";
        if (searchStr.trim() != "") {
            searchQuery = " AND ( CONCAT(u.first_name,' ',u.last_name) LIKE '%" + searchStr + "%' OR u.email LIKE '%" + searchStr + "%')";
        }

        let subjectQuery = '';
        if (lastId.trim() != '') {
            subjectQuery = " AND u.user_id <  " + lastId + " ";
        }

        return new Promise((resolve, reject) => {
            let query = "SELECT  DISTINCT u.user_id, CONCAT(u.first_name,' ',u.last_name) as name, u.user_pic, u.age_visibility, u.subscription_premium, (SELECT id FROM friend_request WHERE user_id = u.user_id AND friend_Id = ? AND status = 'pending') as id, (SELECT CASE WHEN((SELECT status FROM friend_request WHERE user_id = ? AND friend_id = u.user_id) = 'pending') THEN 2 WHEN((SELECT status FROM friend_request WHERE user_id = ? AND friend_id = u.user_id)= 'accept') THEN 1 WHEN((SELECT status FROM friend_request WHERE user_id = u.user_id AND friend_id = ?) = 'accept') THEN 1  WHEN((SELECT status FROM friend_request WHERE user_id = u.user_id AND friend_id = ?) = 'pending') THEN 3 ELSE 0 END) AS friend,IFNULL(TIMESTAMPDIFF(YEAR, u.dob, CURDATE()),0) AS age, (3959 * acos( cos( radians(?)) * cos(radians(u.user_lat))* cos(radians(u.user_long) - radians(?)) + sin (radians(?))* sin(radians(u.user_lat )))) AS distance FROM user as u JOIN user_games as ug ON u.user_id = ug.user_id  WHERE u.user_id !=?  AND u.user_find_me = 1 AND u.user_status = 1  AND ug.activity_id IN (" + prefrencesArray.join() + ") " + searchQuery + " " + subjectQuery + " HAVING distance < ? ORDER BY user_id DESC LIMIT " + limit + "";
            dbHandler.mysqlQueryPromise(APIRef, 'getSamePreferencesUser', query, [userId, userId, userId, userId, userId, userLat,userLong, userLat,userId, distance]).then((activityrows) => {
                resolve(activityrows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getPeopleNearby: (userId, searchStr, offset, prefrencesArray, limit, userLong, userLat, distance) => {

        let searchQuery = "";
        if (searchStr.trim() != "") {
            searchQuery = " AND ( CONCAT(u.first_name,' ',u.last_name) LIKE '%" + searchStr + "%' OR u.email LIKE '%" + searchStr + "%')";
        }

        let prefrencesQuery = '';
        let prefrencesFilter = '';
        if (prefrencesArray[0]) {
            prefrencesQuery = " JOIN user_games as ug ON u.user_id = ug.user_id ";
            prefrencesFilter = " AND ug.activity_id IN (" + prefrencesArray.join() + ") ";
        }

        return new Promise((resolve, reject) => {
            let query = `SELECT  DISTINCT u.user_id, CONCAT(u.first_name,' ',u.last_name) as name, u.user_pic, u.age_visibility, u.subscription_premium, (SELECT id FROM friend_request WHERE user_id = u.user_id AND friend_Id = ? AND status = 'pending') as id, (SELECT CASE WHEN((SELECT status FROM friend_request WHERE user_id = ? AND friend_id = u.user_id) = 'pending') THEN 2 WHEN((SELECT status FROM friend_request WHERE user_id = ? AND friend_id = u.user_id)= 'accept') THEN 1 WHEN((SELECT status FROM friend_request WHERE user_id = u.user_id AND friend_id = ?) = 'accept') THEN 1  WHEN((SELECT status FROM friend_request WHERE user_id = u.user_id AND friend_id = ?) = 'pending') THEN 3 ELSE 0 END) AS friend,IFNULL(TIMESTAMPDIFF(YEAR, u.dob, CURDATE()),0) AS age, (3959 * acos( cos( radians(?)) * cos(radians(u.user_lat))* cos(radians(u.user_long) - radians(?)) + sin (radians(?))* sin(radians(u.user_lat )))) AS distance FROM user as u ${prefrencesQuery} WHERE u.user_id !=?  AND u.user_find_me = 1 AND u.user_status = 1 AND u.user_id NOT IN (SELECT IF(bu.blocked_user_id = ? , bu.user_id, bu.blocked_user_id) FROM block_user as bu WHERE (bu.user_id = ? OR bu.blocked_user_id = ?) AND bu.status = 1) ${prefrencesFilter} ${searchQuery} HAVING distance < ? ORDER BY distance ASC LIMIT ${offset}, ${limit}`;
            dbHandler.mysqlQueryPromise(APIRef, 'getPeopleNearby', query, [userId, userId, userId, userId, userId, userLat,userLong, userLat,userId, userId, userId, userId, distance]).then((activityrows) => {
                resolve(activityrows);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getUserActivityArr: (intersectActivity) => {

        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM activity WHERE activity_id IN (' + intersectActivity.join() + ') AND active_status = 1';
            dbHandler.mysqlQueryPromise(APIRef, 'getSamePreferencesUser', query, []).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        });
    },

    getUserPrefrences: (intersectActivity) => {

        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM activity WHERE activity_id IN (' + intersectActivity.join() + ') AND active_status = 1 ORDER BY activity_name ASC LIMIT 3';
            dbHandler.mysqlQueryPromise(APIRef, 'Get User Three Preferences', query, []).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        });
    },

}

deleteAvailableDays = (dayId) => {

    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM available_days WHERE day_id=?";
        dbHandler.mysqlQueryPromise(APIRef, 'delete available days', sql, [dayId]).then((rows) => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

getAvailableDays = (data, userId) => {

    return new Promise((resolve, reject) => {
        let limitt = data.limit ? data.limit : 15;
        let limit = parseInt(limitt);
        let lastId = data.last_id ? data.last_id : '';
        let queryString = "";

        if (lastId.trim() != '') {
            queryString = "AND d.day_id > " + lastId;
        }

        let sql = "SELECT d.*,u.* FROM user AS u JOIN available_days AS d ON u.user_id = d.user_id WHERE d.user_id = ? " + queryString + " AND u.user_status != 0 ORDER BY d.day_id ASC LIMIT " + limit + "";
        dbHandler.mysqlQueryPromise(APIRef, 'get available days', sql, [userId]).then((daysAvailable) => {
            resolve(daysAvailable);
        }).catch((error) => {
            reject(error);
        });
    });

}

checkUserAvailability = (userId) => {

    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'check user availabiity', "SELECT * FROM user WHERE user_id=? AND user_status != 0 ", [userId]).then((rows) => {

            if (rows.length > 0) {
                resolve();
            } else {
                reject();
            }

        }).catch((error) => {
            reject(error);
        });
    });
}

updateDeviceTokken = (data, userId) => {

    return new Promise((resolve, reject) => {
        let device_token = data.device_token;
        let device_type = data.device_type;
        let user_lat = data.user_lat ? data.user_lat : '';
        let user_long = data.user_long ? data.user_long : '';
        let installedAppVersion = data.installed_app_version ? data.installed_app_version : '';
        let buildNo = data.build_no ? data.build_no : '';
        let osVersion = data.os_version ? data.os_version : '';

        if (device_token == 0) {
            dbHandler.mysqlQueryPromise(APIRef, 'check user availabiity', 'UPDATE user SET device_type=?,device_token=" ", installed_app_version=?, build_no=?, os_version=?  WHERE user_id=?', [device_type, installedAppVersion, buildNo, osVersion, userId]).then((result) => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        } else {
            let subQuery;
            if (user_lat.trim() === '' || user_long.trim() === '') {
                subQuery = '';
            } else {
                subQuery = ', user_lat = ' + user_lat + ' , user_long = ' + user_long + '';
            }
            let sql = 'UPDATE user SET device_type=?,device_token=?,  installed_app_version=?, build_no=?, os_version=?  ' + subQuery + ' WHERE user_id=?';
            dbHandler.mysqlQueryPromise(APIRef, 'check user availabiity', sql, [device_type, device_token, installedAppVersion, buildNo, osVersion, userId]).then((result) => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        }

    });
}

getUserDetails = (userId) => {

    return new Promise((resolve, reject) => {
        let sql = " SELECT (SELECT (count(linkup_id))*25 FROM `linkup_new` WHERE linkup_user_id = ? )as count25, (SELECT (count(`link_group_id`)*25)as summm FROM linkup_new_details as ld JOIN linkup_new as l ON l.linkup_id= ld.linkup_parent_id WHERE l.linkup_end_time <now() AND FIND_IN_SET(?,ld.link_group_friend_accept)) as extra25, (SELECT(count(event_id))*50 FROM event WHERE FIND_IN_SET(?,(friend_id)) AND event_end_time < now() ) as count50 FROM event LIMIT 1";
        dbHandler.mysqlQueryPromise(APIRef, 'get user details', sql, [userId, userId, userId]).then((sum) => {
            resolve(sum)
        }).catch((error) => {
            reject(error);
        });

    });
}

getEvents = (id) => {

    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'get user details', "SELECT *, (CASE WHEN (FIND_IN_SET(fav_event_id, ?)) THEN '1'  ELSE '0' END) as selected from user_detail_fav_event ", [id]).then((all_event) => {
            resolve(all_event);
        }).catch((error) => {
            reject(error);
        });
    });
}

getTeamByActivity = (activityId, id) => {

    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'get user details', "SELECT *, (CASE WHEN (FIND_IN_SET(team_id, ?)) THEN '1'  ELSE '0' END) as selected from user_detail_fav_team  WHERE activity_name = ?", [id, activityId]).then((allTeam) => {
            resolve(allTeam);
        }).catch((error) => {
            reject(error);
        });
    });
}

getFansByActivity = (activityId, id) => {

    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'get user details', "SELECT *, (CASE WHEN (FIND_IN_SET(fan_id, ?)) THEN '1'  ELSE '0' END) as selected from user_detail_fav_fan  WHERE fan_activity = ?", [id, activityId]).then((allFans) => {
            resolve(allFans);
        }).catch((error) => {
            reject(error);
        });
    });
}


deactivateUser = (userId) => {

    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'deactivate user', "UPDATE user SET user_status = '2' , device_token = '', device_type= ''  WHERE user_id = ?", [userId]).then((feeds) => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

addExtraLocation = (data) => {

    return new Promise((resolve, reject) => {
        let latitude = data.latitude ? data.latitude : '';
        let longitude = data.longitude ? data.longitude : '';
        let location = data.location ? data.location : '';
        let activityId = data.activity_id ? data.activity_id : '';

        let locations = {
            latitude: latitude,
            longitude: longitude,
            location: location,
            activityId: activityId
        }

        dbHandler.mysqlQueryPromise(APIRef, 'addExtraLocation', "INSERT INTO extra_locations SET ?", [locations]).then((rows) => {
            resolve();
        }).catch((error) => {
            reject(error);
        });

    });
}

getAppEndKeys = (data, userId) => {

    return new Promise((resolve, reject) => {
        let deviceType = data.device_type;
        let environment = data.environment;
        let sql = " SELECT * FROM configuration WHERE device_type = ? AND environment = ? ";
        dbHandler.mysqlQueryPromise(APIRef, 'get user details', sql, [deviceType, environment]).then((sum) => {
            resolve(sum)
        }).catch((error) => {
            reject(error);
        });
    });
}

unblockUser = (data, userId) => {

    return new Promise((resolve, reject) => {
        let blockedUserId = data.blocked_user_id;
        let sql = "DELETE FROM block_user WHERE user_id = ? AND blocked_user_id = ? AND status = 1";
        dbHandler.mysqlQueryPromise(APIRef, 'unblock user', sql, [userId, blockedUserId]).then((row) => {
            resolve()
        }).catch((error) => {
            reject(error);
        });
    });
}

getUserBlockStatus = (userId, blockedUserId) => {

    return new Promise((resolve, reject) => {
        let sql = "SELECT status, user_id FROM block_user WHERE (user_id = ? AND blocked_user_id = ?) AND status = 1 ";
        dbHandler.mysqlQueryPromise(APIRef, 'get user block status', sql, [userId, blockedUserId]).then((row) => {
            resolve(row)
        }).catch((error) => {
            reject(error);
        });
    });
}

blockedUsers = (userId) => {

    return new Promise((resolve, reject) => {
        let sql = "SELECT bu.*, u.first_name, u.last_name, u.user_pic FROM block_user as bu INNER JOIN user as u ON u.user_id = bu.blocked_user_id WHERE bu.user_id = ? AND status = 1 ";
        dbHandler.mysqlQueryPromise(APIRef, 'get user block status', sql, [userId]).then((row) => {
            resolve(row)
        }).catch((error) => {
            reject(error);
        });
    });
}

getUserRating = (data) => {
    let queryString = '';
    let limit = data.limit ? data.limit : 20;
    limit = parseInt(limit)
    if (data.last_id) {
        queryString = ` AND r.rating_id < ${data.last_id}`;
    }

    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get user rating', `Select r.*, u.first_name, u.last_name, u.user_pic, c.compliment_text, c.compliment_image from user_rating r INNER JOIN user u ON r.coach_user_id = u.user_id LEFT JOIN coach_compliment c ON r.compliment_id = c.compliment_id where r.user_id = ? ${queryString} ORDER BY rating_id DESC LIMIT ?`, [data.user_id, limit]).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}

getUserRatingCountAvg = (data) => {

    const userId = data.user_id;
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get user rating', `Select count(user_id) as count, CAST(AVG(rating) AS DECIMAL(10,1)) as avg, (Select count(l.linkup_id) as linkup_activity_count FROM linkup_new as l LEFT JOIN linkup_new_details AS ln ON ln.linkup_parent_id = l.linkup_id WHERE (l.linkup_user_id = ${userId} OR FIND_IN_SET(${userId}, ln.link_group_friend_accept)) AND l.linkup_status = 1 AND (l.linkup_time_later = 1 OR (l.linkup_repeat_type != 0 OR l.linkup_end_time > CONVERT_TZ(now(),'GMT', l.timezone)))) as linkup_activity_count, (Select count(g.group_id) as group_activity_count FROM group_activity as g WHERE (g.group_admin = ${userId} OR FIND_IN_SET(${userId}, g.group_members)) AND g.group_status = 1) as group_activity_count FROM user_rating WHERE user_id = '${userId}'`, []).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}


getUserReplyRating = (data) => {
    let queryString = '';
    let limit = data.limit ? data.limit : 20;
    limit = parseInt(limit)
    if (data.last_id) {
        queryString = ` AND cr.reply_id < ${data.last_id}`;
    }
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get user rating replies', `Select cr.*, CONCAT(u.first_name,' ',u.last_name) as full_name,u.user_pic from user_rating_replies as cr INNER JOIN user as u ON cr.sender_id = u.user_id where cr.rating_id = ? ${queryString} ORDER BY cr.reply_id DESC LIMIT ?`, [data.rating_id, limit]).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
},

userProfileLike = (userId, friendId) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get user like data', `SELECT * FROM user_like WHERE user_id = ${userId} AND friend_id = ${friendId}`, []).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
},

getUserSingleRating = (data) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get user single rating', `Select r.*,  u.first_name, u.last_name, u.user_pic from user_rating as r INNER JOIN user as u ON r.user_id = u.user_id where rating_id = ${data.rating_id}`, []).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
},

likePreference = (userId, friendId, activityId) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get pref like data', `SELECT * FROM user_like_preferences WHERE user_id = ${userId} AND friend_id = ${friendId} AND activity_id = ${activityId}`, []).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
},

likePreferencesUsers = (data) => {
    return new Promise((resolve, reject) => {
        const activityId = data.activity_id;
        const friendId = data.friend_id;
        const limitt = data.limit ? data.limit : 15;
        const limit = parseInt(limitt);
        const lastId = data.last_id ? data.last_id : '';
        let queryString = '';
        let filterSql = '';
        if (lastId) {
            queryString = "AND u.user_id > "+lastId;
        }
        if (data.name) {
            filterSql += " AND CONCAT(u.first_name,' ', u.last_name) LIKE '%" + data.name + "%'";
        }
        let sql = `SELECT u.user_id, u.first_name, u.last_name, u.user_pic, u.user_status FROM user as u INNER JOIN user_like_preferences as up ON up.user_id = u.user_id WHERE up.activity_id = ${activityId} AND up.friend_id = ${friendId} ${queryString} ${filterSql} ORDER BY u.user_id ASC LIMIT ${limit} `;
        dbHandler.mysqlQueryPromise(APIRef, 'get pref. liked by users', sql, []).then((rows) => {
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
},


profileLikedByUsers = (data) => {
    return new Promise((resolve, reject) => {
        const friendId = data.friend_id;
        const limitt = data.limit ? data.limit : 15;
        const limit = parseInt(limitt);
        const lastId = data.last_id ? data.last_id : '';
        let queryString = '';
        let filterSql = '';
        if (lastId) {
            queryString = "AND u.user_id > "+lastId;
        }
        if (data.name) {
            filterSql += " AND CONCAT(u.first_name,' ', u.last_name) LIKE '%" + data.name + "%'";
        }
        let sql = `SELECT u.user_id, u.first_name, u.last_name, u.user_pic, u.user_status FROM user as u INNER JOIN user_like as ul ON ul.user_id = u.user_id WHERE ul.friend_id = ${friendId} ${queryString} ${filterSql} ORDER BY u.user_id ASC LIMIT ${limit} `;
        dbHandler.mysqlQueryPromise(APIRef, 'get pref. liked by users', sql, []).then((rows) => {
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
},

getActivityType = () => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * from activity_type ORDER BY pagination_id ASC";
        dbHandler.mysqlQueryPromise(APIRef, 'get activity', query, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    })
},

getUserGroupActivity = (userId, friendId, data, status) => {
    let limit = data.limit ? data.limit : 15;
    limit = parseInt(limit);
    const lastId = data.last_id ? data.last_id : '';
    let queryString = '';
    let filterString = '';
    let filterSql = ' LIMIT 5';
    if (status == 1) {
        filterSql = ` LIMIT ${limit}`;
    }
    if (lastId) {
        queryString = " AND g.group_id < "+ lastId;
    }
    if (data.name) {
        filterString += ` AND ((a.activity_name LIKE '%${data.name}%') OR (g.group_name LIKE '%${data.name}%'))`;
    }
    return new Promise((resolve, reject) => {
        let query = `SELECT g.*, CONCAT(u.first_name,' ', u.last_name) as admin_name, u.user_pic as admin_pic, a.activity_name, a.activity_pic, (SELECT count(DISTINCT like_id) as likes FROM group_like WHERE group_id = g.group_id) as likes, (SELECT (CASE  WHEN (g.group_admin = ${userId}) THEN '1' WHEN (FIND_IN_SET(${userId}, g.group_members)) THEN '2' WHEN (FIND_IN_SET(${userId}, g.group_pending_request)) THEN '3' WHEN (FIND_IN_SET(${userId}, g.group_send_pending_request)) THEN '5' ELSE '4' END) as status FROM group_activity WHERE group_id = g.group_id) as status, (SELECT (CASE WHEN (FIND_IN_SET(${userId}, group_mute_members)) THEN 1 ELSE 0 END) as mute_status FROM group_activity WHERE group_id = g.group_id) as mute_status, IFNULL((SELECT 1 FROM group_report WHERE user_id = ${userId} AND group_id = g.group_id LIMIT 1),0) as is_reported FROM group_activity AS g JOIN activity AS a ON a.activity_id = g.group_activity_id LEFT JOIN user as u ON u.user_id = g.group_admin  WHERE (g.group_admin = ${friendId} OR FIND_IN_SET(${friendId},group_members)) AND group_status =1 ${queryString} ${filterString} ORDER BY group_id DESC ${filterSql}`;
        dbHandler.mysqlQueryPromise(APIRef, 'get group activity', query, []).then((rows) => {
            for ( let i = 0; i < rows.length; i++) {
                rows[i].activity_name = translation(data.language, rows[i].activity_name);
            }
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
},

getUserLinkupActivity = (userId, friendId, data, status) => {
    let limit = data.limit ? data.limit : 15;
    limit = parseInt(limit);
    const lastId = data.last_id ? data.last_id : '';
    let queryString = '';
    let filterString = '';
    let filterSql = ' LIMIT 5';
    if (status == 1) {
        filterSql = ` LIMIT ${limit}`;
    }
    if (lastId) {
        queryString = " AND l.linkup_id < "+ lastId;
    }
    if (data.name) {
        filterString += ` AND ((a.activity_name LIKE '%${data.name}%') OR (l.linkup_custom_name LIKE '%${data.name}%'))`;
    }
    return new Promise((resolve, reject) => {
        let query = `SELECT l.*, ln.link_group_friend_accept, a.activity_name,a.activity_pic,u.first_name,u.last_name,u.user_pic, u.user_status, (SELECT count(DISTINCT like_id) as likes FROM linkup_like WHERE linkup_id = l.linkup_id) as likes, (SELECT CASE  WHEN (l.linkup_user_id = ${userId}) THEN '1' WHEN (FIND_IN_SET(${userId}, ln.link_group_friend_accept)) THEN '2' WHEN (FIND_IN_SET(${userId}, ln.link_group_friend_pending)) THEN '3' WHEN (FIND_IN_SET(${userId}, ln.link_group_send_pending)) THEN '4' ELSE '5' END) as status, (SELECT CASE WHEN (FIND_IN_SET(${userId}, ln.linkup_mute_members)) THEN 1 ELSE 0 END) as mute_status, IFNULL((SELECT 1 FROM linkup_report WHERE user_id = ${userId} AND linkup_id = l.linkup_id LIMIT 1),0) as is_reported FROM linkup_new AS l JOIN activity AS a ON a.activity_id=l.activity_id INNER JOIN linkup_new_details AS ln ON ln.linkup_parent_id=l.linkup_id JOIN user AS u ON u.user_id=l.linkup_user_id WHERE (l.linkup_user_id = ${friendId} OR FIND_IN_SET(${friendId},ln.link_group_friend_accept)) AND (l.linkup_time_later = 1 OR (l.linkup_repeat_type != 0 OR l.linkup_end_time > now())) AND l.linkup_status = 1 ${queryString} ${filterString} ORDER BY linkup_id DESC ${filterSql}`;
        dbHandler.mysqlQueryPromise(APIRef, 'get linkup activity', query, []).then((rows) => {
            for ( let i = 0; i < rows.length; i++) {
                rows[i].activity_name = translation(data.language, rows[i].activity_name);
            }
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
},

userBadgeCount = (userId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT COUNT(notification_id) as notification_count, (SELECT COUNT(id) as friend_request_count FROM friend_request WHERE friend_id = ${userId} AND status = 'pending') as friend_request_count, (SELECT SUM(LENGTH(group_pending_request) - LENGTH(REPLACE(group_pending_request, ',', '')) + 1) as group_activity_request_count FROM group_activity WHERE group_admin = ${userId}) as group_activity_request_count, (SELECT SUM(LENGTH(ld.link_group_send_pending) - LENGTH(REPLACE(ld.link_group_send_pending, ',', '')) + 1) as linkup_activity_request_count FROM linkup_new as l INNER JOIN linkup_new_details as ld ON l.linkup_id = ld.linkup_parent_id WHERE l.linkup_user_id = ${userId}) as linkup_activity_request_count, (SELECT COUNT(DISTINCT message_user_id) FROM chat_message WHERE message_friend_id = ${userId} AND read_unread = 0 AND NOT FIND_IN_SET(${userId}, clear_by) AND NOT FIND_IN_SET(${userId}, deleted_by) AND chat_message_status = 0) as unread_message_count FROM notification_new WHERE notification_user_id = ${userId} AND notification_read_status = 0`;
        dbHandler.mysqlQueryPromise(APIRef, 'get linkup activity', query, []).then((rows) => {
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
},

getUserSelecetedPreferences = (userId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT a.activity_id FROM activity AS a INNER JOIN user_games AS ug ON a.activity_id = ug.activity_id WHERE ug.user_id = ?`;
        dbHandler.mysqlQueryPromise(APIRef, 'get user selected preferences', query, [userId]).then((rows) => {
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}

repeatActivity = (linkupId) => {
    if (!linkupId[0]) {
        linkupId = 0;
    }
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get Activities Repeat Time', `SELECT * FROM linkup_repeat_time WHERE linkup_id IN (${linkupId})`, []).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });

    });
}

repeatGroupActivity = (groupId) => {
    if (!groupId[0]) {
        groupId = 0;
    }
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get Groups Repeat Time', `SELECT * FROM group_repeat_time WHERE group_id IN (${groupId})`, []).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });

    });
}

userPhotoLike = (userId, data) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get User Liked Photo', `SELECT * FROM user_photos_like WHERE user_id = ${userId} AND liked_user_id = ${data.user_id} AND photo_id = ${data.photo_id} AND like_status = 1`, []).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}

getPhotoLikedByUsers = (userId, data) => {
    return new Promise((resolve, reject) => {
        const limit = data.limit ? data.limit : 15;
        const offset = data.offset ? data.offset : 0;
        const searchString = data.search_string ? (data.search_string).trim() : '';
        let filterSql = '';
        if (searchString) {
            filterSql = ` AND CONCAT(u.first_name,' ', u.last_name) LIKE '%${searchString}%'`;
        }
        let sql = `SELECT u.user_id, u.first_name, u.last_name, u.user_pic, u.user_status FROM user as u INNER JOIN user_photos_like as pl ON pl.user_id = u.user_id WHERE pl.liked_user_id = ${userId} AND pl.photo_id = ${data.photo_id} ${filterSql} LIMIT ${offset}, ${limit} `;
        dbHandler.mysqlQueryPromise(APIRef, 'Get Photo Liked By Users', sql, []).then((rows) => {
            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}


userPhotoLikeCount = (userId) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get User Photo Likes Count', `SELECT COUNT(*) AS like_count, photo_id FROM user_photos_like WHERE liked_user_id = ${userId} GROUP BY photo_id`, []).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}


checkUserPhotoLike = (userId, friendId) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Check User Photo Like', `SELECT * FROM user_photos_like WHERE user_id = ${userId} AND liked_user_id = ${friendId} GROUP BY photo_id`, []).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}


deleteUserDeletedLikedPics = (userId, photoIds) => {
    return new Promise((resolve, reject) => {
        let sql = `DELETE FROM user_photos_like WHERE liked_user_id = ${userId} AND photo_id IN(${photoIds})`;
        dbHandler.mysqlQueryPromise(APIRef, 'Remove User Deleted Liked Photo Data', sql, []).then((rows) => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}


getUserStatus = (members) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get Active Users Count', `SELECT user_id FROM user WHERE user_id IN(${members}) AND user_status = 1`, []).then((users) => {
            resolve(users);
        }).catch((error) => {
            reject(error);
        });

    });
}


checkReportUser = (userId, data) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Check User Already Reported By User Or Not', `SELECT * FROM report WHERE reported_by = ${userId} AND reported_to = ${data.reported_to}`, []).then((report) => {
            resolve(report);
        }).catch((error) => {
            reject(error);
        });

    });
}


userFunctions.checkPassword = checkPassword;
userFunctions.getNearByUsers = getNearByUsers;
userFunctions.deleteAvailableDays = deleteAvailableDays;
userFunctions.getAvailableDays = getAvailableDays;
userFunctions.checkUserAvailability = checkUserAvailability;
userFunctions.updateDeviceTokken = updateDeviceTokken;
userFunctions.getUserDetails = getUserDetails;
userFunctions.getEvents = getEvents;
userFunctions.getTeamByActivity = getTeamByActivity;
userFunctions.getFansByActivity = getFansByActivity;
userFunctions.deactivateUser = deactivateUser;
userFunctions.addExtraLocation = addExtraLocation;
userFunctions.getAppEndKeys = getAppEndKeys;
userFunctions.unblockUser = unblockUser;
userFunctions.getUserBlockStatus = getUserBlockStatus;
userFunctions.blockedUsers = blockedUsers;
userFunctions.getUserRating = getUserRating;
userFunctions.getUserRatingCountAvg = getUserRatingCountAvg;
userFunctions.getUserReplyRating = getUserReplyRating;
userFunctions.userProfileLike = userProfileLike;
userFunctions.getUserSingleRating = getUserSingleRating;
userFunctions.likePreference = likePreference;
userFunctions.likePreferencesUsers = likePreferencesUsers;
userFunctions.profileLikedByUsers = profileLikedByUsers;
userFunctions.getActivityType = getActivityType;
userFunctions.getUserGroupActivity = getUserGroupActivity;
userFunctions.getUserLinkupActivity = getUserLinkupActivity;
userFunctions.userBadgeCount = userBadgeCount;
userFunctions.getUserSelecetedPreferences = getUserSelecetedPreferences;
userFunctions.repeatActivity = repeatActivity;
userFunctions.repeatGroupActivity = repeatGroupActivity;
userFunctions.userPhotoLike = userPhotoLike;
userFunctions.getPhotoLikedByUsers = getPhotoLikedByUsers;
userFunctions.userPhotoLikeCount = userPhotoLikeCount;
userFunctions.checkUserPhotoLike = checkUserPhotoLike;
userFunctions.deleteUserDeletedLikedPics = deleteUserDeletedLikedPics;
userFunctions.getUserStatus = getUserStatus;
userFunctions.checkReportUser = checkReportUser;


module.exports = userFunctions;
