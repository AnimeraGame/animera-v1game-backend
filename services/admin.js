const dbHandler = require('../DB');
const APIRef = 'Admin Panel';


getUsers = (data) => {
    let limit = data.limit ? data.limit : '20';
    limit = parseInt(limit);
    let pageNo = data.pageNo ? data.pageNo : '1';
    pageNo = parseInt(pageNo);
    let offset = (pageNo - 1) * limit;
    let limitString = ` LIMIT ${offset},${limit} `;
    let offsetString = '';
    if (data.data_from && data.data_to) {
        limit = parseInt(data.data_to);
        offset = parseInt(data.data_from);
        limitString = ` LIMIT ${limit} `;
        offsetString = ` AND u.user_id <= ${offset} `
    }
    return new Promise((resolve, reject) => {
        let sql = `SELECT u.*, IFNULL((select count(*) from coach where coach_user_id = u.user_id),0) AS is_coach, (SELECT count(DISTINCT block_id) as blocked_count FROM block_user WHERE blocked_user_id = u.user_id) as blocked_count from user as u WHERE u.user_status != 3 ${offsetString} ORDER BY u.user_id DESC ${limitString} `;
        dbHandler.mysqlQueryPromise(APIRef, 'getUsers', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });

}


getUsersCount = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT count(*) as total_users from user WHERE user_status != 3`;
        dbHandler.mysqlQueryPromise(APIRef, 'getUsersCount', sql).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });

}


filterUsersCount = (data) => {
    let filterSql = '';
    let queryString = ' WHERE user_id != 0 ';

    if (data.name) {
        filterSql += " AND CONCAT(first_name,' ', last_name) LIKE '%" + data.name + "%'";
    } 
    if (data.email) {
        filterSql += " AND email LIKE '%" + data.email + "%'";
    } 

    if (data.user_country) {
        filterSql += " AND user_country LIKE '%" + data.user_country + "%'";
    } 

    if (data.user_state) {
        filterSql += " AND user_state LIKE '%" + data.user_state + "%'";
    } 

    if (data.user_city) {
        filterSql += " AND user_city LIKE '%" + data.user_city + "%'";
    } 

    if (data.language) {
        filterSql += " AND user_language LIKE '%" + data.language + "%'";
    } 

    if (data.start_date && data.end_date) {
        filterSql += " AND user_created_on BETWEEN '"+ data.start_date +"' AND '"+ data.end_date +"'";
    }

    if (data.user_id) {
        filterSql += " AND user_id =" + data.user_id + "";
    } 

    if (data.user_status) {
        filterSql += " AND user_status =" + data.user_status + "";
    } 

    if (data.installed_app_version) {
        filterSql += ` AND installed_app_version = '${data.installed_app_version}'`;
    } 

    if (data.build_no) {
        filterSql += ` AND build_no = + '${data.build_no}'`;
    } 

    if (data.os_version) {
        filterSql += ` AND os_version = '${data.os_version}'`;
    }

    if (data.device_type) {
        filterSql += ` AND device_type = '${data.device_type}'`;
    }

    if (data.phone_country_code) {
        filterSql += " AND phone_country_code LIKE '%" + data.phone_country_code + "%'";
    }

    if (data.verify_account) {
        filterSql += ` AND verifyAccount = '${data.verify_account}'`;
    }

    return new Promise((resolve, reject) => {
        let sql = `SELECT count(*) as total_users from user ${queryString} AND user_status != 3 ${filterSql}`;
        dbHandler.mysqlQueryPromise(APIRef, 'getUsersCount', sql).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });

}


filterUsers = (data) => {
    let limit = data.limit ? data.limit : '20';
    limit = parseInt(limit);
    let pageNo = data.pageNo ? data.pageNo : '1';
    pageNo = parseInt(pageNo);
    let offset = (pageNo - 1) * limit;
    let limitString = ` LIMIT ${offset},${limit} `;
    let offsetString = '';
    if (data.data_from && data.data_to) {
        limit = parseInt(data.data_to);
        offset = parseInt(data.data_from);
        limitString = ` LIMIT ${limit} `;
        offsetString = ` AND u.user_id <= ${offset} `
    }
    let filterSql = '';
    let queryString = ' WHERE u.user_id != 0 ';

    if (data.name) {
        filterSql += " AND CONCAT(u.first_name,' ', u.last_name) LIKE '%" + data.name + "%'";
    } 
    if (data.email) {
        filterSql += " AND u.email LIKE '%" + data.email + "%'";
    } 

    if (data.user_country) {
        filterSql += " AND u.user_country LIKE '%" + data.user_country + "%'";
    } 

    if (data.user_state) {
        filterSql += " AND u.user_state LIKE '%" + data.user_state + "%'";
    } 

    if (data.user_city) {
        filterSql += " AND u.user_city LIKE '%" + data.user_city + "%'";
    } 

    if (data.language) {
        filterSql += " AND u.user_language LIKE '%" + data.language + "%'";
    } 

    if (data.start_date && data.end_date) {
        filterSql += " AND u.user_created_on BETWEEN '"+ data.start_date +"' AND '"+ data.end_date +"'";
    } 

    if (data.user_id) {
        filterSql += " AND u.user_id =" + data.user_id + "";
    } 

    if (data.user_status) {
        filterSql += " AND u.user_status =" + data.user_status + "";
    } 

    if (data.installed_app_version) {
        filterSql += ` AND u.installed_app_version = '${data.installed_app_version}'`;
    } 

    if (data.build_no) {
        filterSql += ` AND u.build_no = '${data.build_no}'`;
    } 

    if (data.os_version) {
        filterSql += ` AND u.os_version = '${data.os_version}'`;
    }

    if (data.device_type) {
        filterSql += ` AND u.device_type = '${data.device_type}'`;
    }

    if (data.phone_country_code) {
        filterSql += " AND u.phone_country_code LIKE '%" + data.phone_country_code + "%'";
    }

    if (data.verify_account) {
        filterSql += ` AND u.verifyAccount = '${data.verify_account}'`;
    }

    return new Promise((resolve, reject) => {
        let sql = `SELECT u.*, IFNULL((select count(*) from coach where coach_user_id = u.user_id),0) AS is_coach , (SELECT count(DISTINCT block_id) as blocked_count FROM block_user WHERE blocked_user_id = u.user_id) as blocked_count from user as u ${queryString} AND u.user_status != 3 ${offsetString} ${filterSql} ORDER BY u.user_id DESC ${limitString}`;
        dbHandler.mysqlQueryPromise(APIRef, 'getUsers', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });

}

getSingleUser = (userId) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from user WHERE user_id = ?`;
        dbHandler.mysqlQueryPromise(APIRef, 'getSingleUser', sql, [userId]).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });

}


userActivities = (data) => {
    let limit = data.limit ? data.limit : '20';
    limit = parseInt(limit);
    let pageNo = data.pageNo ? data.pageNo : '1';
    pageNo = parseInt(pageNo);
    let offset = (pageNo - 1) * limit;
    let limitString = ` LIMIT ${offset},${limit} `;
    let offsetString = '';
    if (data.data_from && data.data_to) {
        limit = parseInt(data.data_to);
        offset = parseInt(data.data_from);
        limitString = ` LIMIT ${limit} `;
        offsetString = ` AND l.linkup_id <= ${offset} `
    }
    let filterSql = '';
    let queryString = ' WHERE l.linkup_id != 0 ';

    if (data.name) {
        filterSql += " AND CONCAT(u.first_name,' ', u.last_name) LIKE '%" + data.name + "%'";
    } 

    if (data.city) {
        filterSql += " AND l.linkup_city LIKE '%" + data.city + "%'";
    } 

    if (data.start_date && data.end_date) {
        filterSql += " AND l.linkup_start_time BETWEEN '"+ data.start_date +"' AND  '"+ data.end_date +"'";
    }

    if (data.email) {
        filterSql += " AND u.email LIKE '%" + data.email + "%'";
    } 

    if (data.activity_id) {
        filterSql += " AND l.activity_id = " + data.activity_id;
    }

    if (data.activity_type) {
        filterSql += " AND a.activity_type = " + data.activity_type;
    }

    if (data.linkup_status) {
        filterSql += " AND l.linkup_status = " + data.linkup_status;
    } 

    if (data.private_public) {
        filterSql += ` AND l.private_public = '${data.private_public}'`;
    } 

    if (data.linkup_city) {
        filterSql += " AND l.linkup_city LIKE '%" + data.linkup_city + "%'";
    } 

    if (data.linkup_state) {
        filterSql += " AND l.linkup_state LIKE '%" + data.linkup_state + "%'";
    } 

    if (data.linkup_country) {
        filterSql += " AND l.linkup_country LIKE '%" + data.linkup_country + "%'";
    }

    return new Promise((resolve, reject) => {
        let sql = `SELECT CONCAT(u.first_name,' ', u.last_name) as name, u.email, u.user_id, a.activity_name, at.activity_type_name, l.*, ld.link_group_friend_accept AS link_group_total_friend from linkup_new as l INNER JOIN user as u ON u.user_id= l.linkup_user_id INNER JOIN activity as a ON a.activity_id= l.activity_id INNER JOIN activity_type as at ON at.activity_type_id= a.activity_type INNER JOIN linkup_new_details as ld ON ld.linkup_parent_id= l.linkup_id ${queryString} ${offsetString} ${filterSql} ORDER BY l.linkup_id DESC ${limitString}`;
        dbHandler.mysqlQueryPromise(APIRef, 'getUsers', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}


userActivitiesCount = (data) => {
    let filterSql = '';
    let queryString = ' WHERE l.linkup_id != 0 ';

    if (data.name) {
        filterSql += " AND CONCAT(u.first_name,' ', u.last_name) LIKE '%" + data.name + "%'";
    } 

    if (data.city) {
        filterSql += " AND l.linkup_city LIKE '%" + data.city + "%'";
    } 

    if (data.start_date && data.end_date) {
        filterSql += " AND l.linkup_start_time BETWEEN '"+ data.start_date +"' AND  '"+ data.end_date +"'";
    }

    if (data.email) {
        filterSql += " AND u.email LIKE '%" + data.email + "%'";
    } 

    if (data.activity_id) {
        filterSql += " AND l.activity_id = " + data.activity_id;
    }

    if (data.activity_type) {
        filterSql += " AND a.activity_type = " + data.activity_type;
    }

    if (data.linkup_status) {
        filterSql += " AND l.linkup_status = " + data.linkup_status;
    } 

    if (data.private_public) {
        filterSql += ` AND l.private_public = '${data.private_public}'`;
    }
    
    if (data.linkup_city) {
        filterSql += " AND l.linkup_city LIKE '%" + data.linkup_city + "%'";
    } 

    if (data.linkup_state) {
        filterSql += " AND l.linkup_state LIKE '%" + data.linkup_state + "%'";
    } 

    if (data.linkup_country) {
        filterSql += " AND l.linkup_country LIKE '%" + data.linkup_country + "%'";
    }

    return new Promise((resolve, reject) => {
        let sql = `SELECT count(*) as total_activities from linkup_new as l INNER JOIN user as u ON u.user_id = l.linkup_user_id INNER JOIN activity as a ON a.activity_id= l.activity_id INNER JOIN activity_type as at ON at.activity_type_id= a.activity_type ${queryString} ${filterSql}`;
        dbHandler.mysqlQueryPromise(APIRef, 'getUsersCount', sql).then((rows) => {

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


getAllActivity = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from activity WHERE activity_type != 0`;
        dbHandler.mysqlQueryPromise(APIRef, 'getAllActivity', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}


getAllActivityType = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from activity WHERE activity_type = 0`;
        dbHandler.mysqlQueryPromise(APIRef, 'getAllActivityType', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}


events = (data) => {
    let limit = data.limit ? data.limit : '20';
    limit = parseInt(limit);
    let pageNo = data.pageNo ? data.pageNo : '1';
    pageNo = parseInt(pageNo);
    let offset = (pageNo - 1) * limit;
    let limitString = ` LIMIT ${offset},${limit} `;
    let offsetString = '';
    if (data.data_from && data.data_to) {
        limit = parseInt(data.data_to);
        offset = parseInt(data.data_from);
        limitString = ` LIMIT ${limit} `;
        offsetString = ` AND event_id <= ${offset} `
    }
    let filterSql = '';
    let queryString = ' WHERE event_status != 0 ';

    if (data.event_name) {
        filterSql += " AND event_name LIKE '%" + data.event_name + "%'";
    } 

    if (data.host_email) {
        filterSql += " AND host_email LIKE '%" + data.host_email + "%'";
    } 

    if (data.event_category_name) {
        filterSql += ` AND event_category_name = '${data.event_category_name}'`;
    }

    if (data.event_location) {
        filterSql += ` AND event_location = '${data.event_location}'`;
    }

    if (data.event_start_time && data.event_end_time) {
        filterSql += " AND event_start_time BETWEEN '"+ data.event_start_time +"' AND  '"+ data.event_end_time +"'";
    }

    if (data.event_paid) {
        filterSql += ` AND event_paid = '${data.event_paid}'`;
    } 

    if (data.event_status) {
        filterSql += ` AND event_status = '${data.event_status}'`;
    } 
    
    if (data.event_city) {
        filterSql += " AND event_city LIKE '%" + data.event_city + "%'";
    } 
    
    if (data.event_country) {
        filterSql += " AND event_country LIKE '%" + data.event_country + "%'";
    } 

    if (data.event_state) {
        filterSql += " AND event_state LIKE '%" + data.event_state + "%'";
    } 


    return new Promise((resolve, reject) => {
        let sql = `SELECT event_id, event_name, event_pic, host_name, host_email, host_phone, event_lat, event_long, event_category_name, event_category, event_location, event_city, event_country, event_state, event_start_time, event_end_time, event_paid, event_description, event_status, activity_id, friend_id, interested_user FROM event ${queryString} ${offsetString} ${filterSql} ORDER BY event_id DESC ${limitString}`;
        dbHandler.mysqlQueryPromise(APIRef, 'getEvents', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}


eventsCount = (data) => {
    let limit = data.limit ? data.limit : '20';
    limit = parseInt(limit);
    let pageNo = data.pageNo ? data.pageNo : '1';
    pageNo = parseInt(pageNo);
    let offset = (pageNo - 1) * limit;
    let limitString = ` LIMIT ${offset},${limit} `;
    let offsetString = '';
    if (data.data_from && data.data_to) {
        limit = parseInt(data.data_to);
        offset = parseInt(data.data_from);
        limitString = ` LIMIT ${limit} `;
        offsetString = ` WHERE user_id <= ${offset} `
    }
    let filterSql = '';
    let queryString = ' WHERE event_status != 0 ';

    if (data.event_name) {
        filterSql += " AND event_name LIKE '%" + data.event_name + "%'";
    } 

    if (data.host_email) {
        filterSql += " AND host_email LIKE '%" + data.host_email + "%'";
    } 

    if (data.event_category_name) {
        filterSql += ` AND event_category_name = '${data.event_category_name}'`;
    }

    if (data.event_location) {
        filterSql += ` AND event_location = '${data.event_location}'`;
    }

    if (data.event_start_time && data.event_end_time) {
        filterSql += " AND event_start_time BETWEEN '"+ data.event_start_time +"' AND  '"+ data.event_end_time +"'";
    }

    if (data.event_paid) {
        filterSql += ` AND event_paid = '${data.event_paid}'`;
    } 

    if (data.event_status) {
        filterSql += ` AND event_status = '${data.event_status}'`;
    } 

    if (data.event_city) {
        filterSql += " AND event_city LIKE '%" + data.event_city + "%'";
    } 
    
    if (data.event_country) {
        filterSql += " AND event_country LIKE '%" + data.event_country + "%'";
    } 

    if (data.event_state) {
        filterSql += " AND event_state LIKE '%" + data.event_state + "%'";
    } 

    return new Promise((resolve, reject) => {
        let sql = `SELECT count(*) as total_events from event ${queryString} ${filterSql}`;
        dbHandler.mysqlQueryPromise(APIRef, 'getEvents', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}


getEventCategoryType = () => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from ticketing_category WHERE category_status != 0`;
        dbHandler.mysqlQueryPromise(APIRef, 'getAllActivityType', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}


getMembers = (ids) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT user_id, CONCAT(first_name,' ', last_name) as name, user_pic from user WHERE user_id IN (?)`;
        dbHandler.mysqlQueryPromise(APIRef, 'getMembers', sql, [ids]).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}

groupActivity = (data) => {
    let limit = data.limit ? data.limit : '20';
    limit = parseInt(limit);
    let pageNo = data.pageNo ? data.pageNo : '1';
    pageNo = parseInt(pageNo);
    let offset = (pageNo - 1) * limit;
    let limitString = ` LIMIT ${offset},${limit} `;
    let offsetString = '';
    if (data.data_from && data.data_to) {
        limit = parseInt(data.data_to);
        offset = parseInt(data.data_from);
        limitString = ` LIMIT ${limit} `;
        offsetString = ` AND g.group_id <= ${offset} `
    }
    let filterSql = '';
    let queryString = 'WHERE g.group_status != 0';

    if (data.group_name) {
        filterSql += " AND g.group_name LIKE '%" + data.group_name + "%'";
    } 

    if (data.admin_id) {
        filterSql += " AND g.group_admin =" + data.admin_id;
    } 

    if (data.group_activity_name) {
        filterSql += " AND g.group_activity_name LIKE '%" + data.group_activity_name + "%'";
    } 

    if (data.group_city) {
        filterSql += " AND g.group_city LIKE '%" + data.group_city + "%'";
    }

    if (data.group_state) {
        filterSql += " AND g.group_state LIKE '%" + data.group_state + "%'";
    }

    if (data.group_country) {
        filterSql += " AND g.group_country LIKE '%" + data.group_country + "%'";
    }

    if (data.group_type) {
        filterSql += " AND g.group_type =" + data.group_type;
    } 

    if (data.group_status) {
        filterSql += " AND g.group_status =" + data.group_status;
    } 

    return new Promise((resolve, reject) => {
        let sql = `SELECT g.group_id, g.group_name, g.group_admin as admin_id, CONCAT(u.first_name,' ', u.last_name) as admin_name, u.user_pic as admin_pic, g.group_members, g.group_pending_request, g.group_activity_id, g.group_activity_name, g.group_city, g.group_state, g.group_country, g.group_location, g.group_lat, g.group_long, g.group_type, g.group_image, g.group_description, g.group_status, g.group_created_on FROM group_activity as g INNER JOIN user as u ON u.user_id = g.group_admin ${queryString} ${offsetString} ${filterSql} ORDER BY g.group_id DESC ${limitString}`;
        dbHandler.mysqlQueryPromise(APIRef, 'getEvents', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}

groupActivityCount = (data) => {
    let limit = data.limit ? data.limit : '20';
    limit = parseInt(limit);
    let pageNo = data.pageNo ? data.pageNo : '1';
    pageNo = parseInt(pageNo);
    let offset = (pageNo - 1) * limit;
    let limitString = ` LIMIT ${offset},${limit} `;
    let offsetString = '';
    if (data.data_from && data.data_to) {
        limit = parseInt(data.data_to);
        offset = parseInt(data.data_from);
        limitString = ` LIMIT ${limit} `;
        offsetString = ` WHERE user_id <= ${offset} `
    }
    let filterSql = '';
    let queryString = ' WHERE group_status != 0 '; 

    if (data.group_name) {
        filterSql += " AND group_name LIKE '%" + data.group_name + "%'";
    } 

    if (data.admin_id) {
        filterSql += " AND group_admin =" + data.admin_id;
    } 

    if (data.group_activity_name) {
        filterSql += " AND group_activity_name LIKE '%" + data.group_activity_name + "%'";
    } 

    if (data.group_city) {
        filterSql += " AND group_city LIKE '%" + data.group_city + "%'";
    }

    if (data.group_state) {
        filterSql += " AND group_state LIKE '%" + data.group_state + "%'";
    }

    if (data.group_country) {
        filterSql += " AND group_country LIKE '%" + data.group_country + "%'";
    }

    if (data.group_type) {
        filterSql += " AND group_type =" + data.group_type;
    } 

    if (data.group_status) {
        filterSql += " AND group_status =" + data.group_status;
    } 

    return new Promise((resolve, reject) => {
        let sql = `SELECT count(*) as total_groups from group_activity ${queryString} ${filterSql}`;
        dbHandler.mysqlQueryPromise(APIRef, 'getEvents', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}

activityPreferences = (data) => {
    let limit = data.limit ? data.limit : '20';
    limit = parseInt(limit);
    let pageNo = data.pageNo ? data.pageNo : '1';
    pageNo = parseInt(pageNo);
    let offset = (pageNo - 1) * limit;
    let limitString = ` LIMIT ${offset},${limit} `;
    let offsetString = '';
    if (data.data_from && data.data_to) {
        limit = parseInt(data.data_to);
        offset = parseInt(data.data_from);
        limitString = ` LIMIT ${limit} `;
        offsetString = ` AND activity_id <= ${offset} `
    }
    let filterSql = '';
    if (data.activity_name) {
        filterSql += " AND activity_name LIKE '%" + data.activity_name + "%'";
    } 
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from activity WHERE activity_type != 0 ${offsetString} ${filterSql} ORDER BY activity_id DESC ${limitString}`;
        dbHandler.mysqlQueryPromise(APIRef, 'activity preferences', sql, [offset, limit]).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}

activityPreferencesCount = (data) => {
    let filterSql = '';
    if (data.activity_name) {
        filterSql += " AND activity_name LIKE '%" + data.activity_name + "%'";
    } 
    return new Promise((resolve, reject) => {
        let sql = `SELECT COUNT(*) as total_activity_preferences from activity WHERE activity_type != 0 ${filterSql}`;
        dbHandler.mysqlQueryPromise(APIRef, 'activityP preferences', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });
}

blockedBy = (userId) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT bu.*, u.first_name, u.last_name, u.user_pic, u.user_status FROM block_user as bu INNER JOIN user as u on u.user_id = bu.user_id WHERE blocked_user_id = ${userId}`;
        dbHandler.mysqlQueryPromise(APIRef, 'get blocked by users', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });

}

getLanguageCode = () => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get Language Code', `SELECT * FROM language_code`, []).then((activity) => {
            resolve(activity);
        }).catch((error) => {
            reject(error);
        });
    });
}

getActivityTranslation = (data) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Get Activity Translation', `SELECT * FROM activity_translation WHERE activity_id = ${data.activity_id}`, []).then((activity) => {
            resolve(activity);
        }).catch((error) => {
            reject(error);
        });
    });
}

bulkInsert = (table, objectArray, callback) => {
    if (objectArray.length == 0) {
        return;
    }
    let keys = Object.keys(objectArray[0]);
    let values = objectArray.map(obj => keys.map(key => obj[key]));
    let sql = 'INSERT INTO ' + table + ' (' + keys.join(',') + ') VALUES ?';

    dbHandler.mysqlQueryPromise('Insert', 'Bulk Insert function', sql, [values]).then((rows) => {
        callback(null, rows);

    }).catch((error) => {
        callback(error);
    });
}

bulkUpdate = (table, update_key, objectArray, callback) => {
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

}

deleteActivityTranslation = (data) => {
    return new Promise((resolve, reject) => {
        dbHandler.mysqlQueryPromise(APIRef, 'Delete Activity Translation', `DELETE FROM activity_translation WHERE activity_translation_id IN (${data.activity_translation_ids})`, []).then((activity) => {
            resolve(activity);
        }).catch((error) => {
            reject(error);
        });
    });
}


clearDB = () => {
 
    return new Promise((resolve, reject) => {
        let sql = `SET FOREIGN_KEY_CHECKS = 0;
        TRUNCATE available_days;
        TRUNCATE chat;
        TRUNCATE chat_message;
        TRUNCATE coach;
        TRUNCATE coach_account;
        TRUNCATE coach_certificate;
        TRUNCATE coach_experience;
        TRUNCATE coach_follow;
        TRUNCATE coach_inventory;
        TRUNCATE coach_package;
        TRUNCATE coach_payout;
        TRUNCATE coach_serving_city;
        TRUNCATE coach_subscription;
        TRUNCATE coach_rating;
        TRUNCATE coach_rating_replies;
        TRUNCATE comments;
        TRUNCATE community_sponser;
        TRUNCATE conversation;
        TRUNCATE deals;
        TRUNCATE deal_view;
        TRUNCATE event;
        TRUNCATE extra_locations;
        TRUNCATE feed;
        TRUNCATE feedback;
        TRUNCATE friend_request;
        TRUNCATE groupchat;
        TRUNCATE groupmessage;
        TRUNCATE group_feeds;
        TRUNCATE group_feeds_comment;
        TRUNCATE group_feeds_like;
        TRUNCATE likes;
        TRUNCATE like_organization;
        TRUNCATE linkup_new;
        TRUNCATE linkup_new_details;
        TRUNCATE linkup_request;
        TRUNCATE merchandies;
        TRUNCATE merchandiesReviews;
        TRUNCATE notification;
        TRUNCATE notification_new;
        TRUNCATE organization_follow;
        TRUNCATE org_donation;
        TRUNCATE package_billing;
        TRUNCATE payment_billing;
        TRUNCATE payment_card;
        TRUNCATE payment_transaction;
        TRUNCATE user_games;
        TRUNCATE ticketing;
        TRUNCATE user;
        TRUNCATE ticket_view;
        TRUNCATE time_zone;
        TRUNCATE time_zone_leap_second;
        TRUNCATE user_share_data;
        TRUNCATE user_subscribe_email;
        TRUNCATE user_otp;
        TRUNCATE group_activity;
        SET FOREIGN_KEY_CHECKS = 1;`;
        dbHandler.mysqlQueryPromise(APIRef, 'getUsers', sql, []).then((rows) => {

            resolve(rows);
        }).catch((error) => {
            reject(error);
        });
    });

}


module.exports = {
    getUsers,
    getUsersCount,
    filterUsersCount,
    filterUsers,
    getSingleUser,
    userActivities,
    userActivitiesCount,
    repeatActivity,
    getAllActivity,
    getAllActivityType,
    events,
    eventsCount,
    getEventCategoryType,
    getMembers,
    groupActivity,
    groupActivityCount,
    activityPreferences,
    activityPreferencesCount,
    blockedBy,
    getLanguageCode,
    getActivityTranslation,
    bulkInsert,
    bulkUpdate,
    deleteActivityTranslation,
    clearDB
}