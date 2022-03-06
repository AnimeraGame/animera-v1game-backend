const adminValidator = require("../validator/admin.js");
const md5 = require("md5");
const APIRef = 'Admin Route';
const QRCode = require('qrcode');
const speakeasy = require('speakeasy');
const upload = require('../middleware/fileFunction')('user');
const uploads = require('../middleware/fileFunction')('event');
const groupUploads = require('../middleware/fileFunction')('group_activity');
const preference = require('../middleware/fileFunction')('preferences');
const constants = require("../util/constants");
const responses = require("../util/responses");

const {
    routes,
    adminServices,
    commonFunctions,
    authenticateController,
    s3,
    moment
} = require('../services/baseService.js');

let Upload = upload.fields([{
    name: 'user_pic'
}, {
    name: 'user_multiple_pics'
}, {
    name: 'user_pic2'
}, {
    name: 'user_pic3'
}]);

let Uploads = uploads.fields([{
    name: 'event_pic'
}]);

let GroupUploads = groupUploads.fields([{
    name: 'group_image'
}]);

let PreferenceUpload = preference.fields([{
    name: 'activity_pic'
}]);


async function sendOTP(userData) {
    let phoneOTP = Math.floor(100000 + Math.random() * 900000);
    let emailOTP = Math.floor(100000 + Math.random() * 900000);
    await commonFunctions.twilio_send_message(userData[0].admin_phone, phoneOTP);
    let message = 'OTP for Apex is ' + emailOTP + ' . Do not share this with anyone.';
    let updateObject = {
        email_otp: emailOTP,
        phone_otp: phoneOTP
    }
    await commonFunctions.updateSingleRowNew(APIRef, 'admin', updateObject, 'admin_id', userData[0].admin_id, 'otp send');
    let mailOptions = {
        from: '"Apex" noreply@apex.com',
        to: userData[0].username,
        subject: 'OTP - admin login',
        html: message,
    };
    let transporter = commonFunctions.nodemailerEmail();
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log(response);
        }
    })
    return true;
}


// Admin Login API
routes.post('/login', adminValidator.login, async function (req, res) {

    let languageCode = req.body.language;
    try {
        
        let data = {};
        let adminData = await commonFunctions.getSingleRowNew(APIRef, 'admin', 'username', req.body.email, 'admin login');
        if (adminData.length > 0) {
            if (adminData[0].password == md5(req.body.password)) {
                let payloadObj = {
                    user_id: adminData[0].admin_id,
                    user_type: 1
                };
                data.token = authenticateController.data.authenticate(payloadObj);
                success = 1;
                // sendOTP(adminData);
                if (adminData[0].auth_verified == 1) {
                    data.auth_verified = adminData[0].auth_verified;
                } else {
                    // Generate Auth Secret
                    const secret = speakeasy.generateSecret({name:"Wizapp",issuer:"Wizapp"});
                    const dataUrl = await QRCode.toDataURL(secret.otpauth_url);
                    data.auth_verified = adminData[0].auth_verified;
                    data.qrcode = dataUrl;
                    const updateObject = {
                        auth_string: secret.base32
                    };
                    await commonFunctions.updateSingleRowNew(APIRef, 'admin', updateObject, 'admin_id', adminData[0].admin_id, 'update user');
                        
                }
            } else {
                return responses.sendError(res, languageCode, {}, "INCORRECT_EMAIL_PASSWORD", constants.responseMessageCode.INCORRECT_EMAIL_PASSWORD);
            }
        } else {
            return responses.sendError(res, languageCode, {}, "EMAIL_NOT_EXISTS", constants.responseMessageCode.EMAIL_NOT_EXISTS);
        }
        return responses.actionCompleteResponse(res, languageCode, data, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }
});

// Get all users API
routes.get('/user', authenticateController.data.auth_route, async function (req, res) {

    let languageCode = req.query.language;
    try {
        
        let userData = await adminServices.getUsers(req.query);   // Get Users
        let userCount = await adminServices.getUsersCount();    // Get User Count

        let data = {
            total_users: userCount[0].total_users,
            data: userData
        }
        return responses.actionCompleteResponse(res, languageCode, data, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }
});


// Get user liosting with filters API
routes.get('/filterUser', authenticateController.data.auth_route, async function (req, res) {

    let languageCode = req.query.language;
    try {
        
        let userData = await adminServices.filterUsers(req.query);  // Get filter user
        let userCount = await adminServices.filterUsersCount(req.query);  // Get filter count

        let data = {
            total_users: userCount[0].total_users,
            data: userData
        }
        return responses.actionCompleteResponse(res, languageCode, data, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }
});

// Change user status API
routes.post('/changeUserStatus', adminValidator.disableUser, authenticateController.data.auth_route, async function (req, res) {

    let languageCode = req.body.language;
    try {
        
        const userId = req.body.user_id;
        const disableStatus = req.body.disable_status;
        let updateData = {
            user_status: parseInt(disableStatus)
        }
        // Change User Status
        await commonFunctions.updateSingleRowNew(APIRef, 'user', updateData, 'user_id', userId, 'disable user');
        return responses.actionCompleteResponse(res, languageCode, {}, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }
});


// Get user profile API
routes.get('/userProfile', adminValidator.userProfile, authenticateController.data.auth_route, async function (req, res) {

    let languageCode = req.query.language;
    try {
        
        const userId = req.query.user_id;
        let userData = await adminServices.getSingleUser(userId);   // Get Single User
        const activityCount = await adminServices.userActivitiesCount({email: userData[0].email});  // Get User All Activities
        const blockedBy = await adminServices.blockedBy(userId);    // Get User Who Blocked This User
        userData[0].user_activity_count = activityCount[0].total_activities;
        userData[0].blocked_by = blockedBy;
        return responses.actionCompleteResponse(res, languageCode, userData, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }
});


// Get user multiple pics API
routes.post('/user_multiple_pics', Upload, authenticateController.data.auth_route, function (req, res) {

    let languageCode = req.body.language;
    try {
        
        console.log("API", req.protocol + '://' + req.get('host') + req.originalUrl);

        // User Multiple Pics Format Updation
        let image = [];
        if (!req.files.user_multiple_pics || req.files.user_multiple_pics == undefined) {
            console.log('no images');
        } else {
            req.files.user_multiple_pics.forEach((element) => {
                let name = 'user/' + element.key;
                image.push(name);
            });
        }

        return responses.actionCompleteResponse(res, languageCode, image, "DOCUMENT_UPLOADED", constants.responseMessageCode.DOCUMENT_UPLOADED);
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});


// Edit user profile API
routes.put('/editUserProfile', Upload, adminValidator.editUserProfile, authenticateController.data.auth_route, async function (req, res) {

    let languageCode = req.body.language;
    try {
        
        let userDetails = req.body;
        let userId = userDetails.user_id;
        let userData = await adminServices.getSingleUser(userId);
        let userPic = userData[0].user_pic;
        let userPic2 = userData[0].user_pic2;
        let userPic3 = userData[0].user_pic3;
        let userMultiplePics = userData[0].user_multiple_pics;

        if (req.files.user_pic) {
            if (userPic) {
                s3.deleteObject({
                    Bucket: 'swift-spar',
                    Key: userPic
                }, function (err, data) { });    // Delete Old pic from s3
            }

            userPic = 'user/' + req.files.user_pic[0].key;
        }

        if (req.files.user_pic2) {
            console.log(req.files.user_pic2);
            if (userPic2) {
                s3.deleteObject({
                    Bucket: 'swift-spar',
                    Key: userPic2
                }, function (err, data) { });    // Delete Old pic from s3
            }

            userPic2 = req.files.user_pic2[0].key;
        }

        if (req.files.user_pic3) {
            if (userPic3) {
                s3.deleteObject({
                    Bucket: 'swift-spar',
                    Key: userPic3
                }, function (err, data) { });    // Delete Old pic from s3
            }

            userPic3 = req.files.user_pic3[0].key;
        }

        if (userDetails.deleteKeys) {
            // To remove user pics
            let keys = userDetails.deleteKeys;
            userMultiplePics = JSON.parse(userMultiplePics);
            userMultiplePics = userMultiplePics.filter((image) => {
                if (image.primary == 1 && keys.includes(image.id)) {
                    userPic = '';
                }
                return !keys.includes(image.id)
            });

            if (userMultiplePics.length > 0 && userPic == '') {
                userPic = userMultiplePics[0].image;
                userMultiplePics[0].primary = 1;
            }
            userMultiplePics = JSON.stringify(userMultiplePics);
        }

        if (userDetails.disableKeys) {
            // to Disable User Pics
            let keys = userDetails.disableKeys;
            keys = keys.split(',').map(Number);
            ;
            userMultiplePics = JSON.parse(userMultiplePics);
            userMultiplePics = userMultiplePics.filter((image) => {
                if (keys.includes(image.id)) {
                    image.disable = 1;
                } else {
                    image.disable = 0;
                }
                return image
            });
            userMultiplePics = JSON.stringify(userMultiplePics);
        }

        userMultiplePics = JSON.parse(userMultiplePics);
        if (req.files.user_pic && userMultiplePics.length > 0) {
            // For Adding User Pic
            userMultiplePics = userMultiplePics.filter((image) => {
                if (image.primary == 1) {
                    image.image = userPic
                } else {
                    userMultiplePics.push({ id: 1, image: userPic, primary: 1 });
                }
                return image
            });

        } else if (req.files.user_pic && userMultiplePics.length == 0) {
            userMultiplePics.push({ id: 1, image: userPic, primary: 1 });
        }
        userMultiplePics = JSON.stringify(userMultiplePics);

        if (userDetails.user_multiple_pics) {
            // For adding user multiple pics
            let multiplePics = userDetails.user_multiple_pics.split(',');
            userMultiplePics = JSON.parse(userMultiplePics);
            if (multiplePics.length <= 5) {
                let id = userMultiplePics.length > 0 ? userMultiplePics[userMultiplePics.length - 1].id + 1 : 2;
                multiplePics.forEach((element) => {
                    userMultiplePics.push({ id: id, image: element, primary: 0 });
                    id++;
                });

            } else {
                return responses.sendError(res, languageCode, {}, "MULTIPLE_PICS_COUNT", constants.responseMessageCode.MULTIPLE_PICS_COUNT);
            }
            userMultiplePics = JSON.stringify(userMultiplePics)
        }

        if (userDetails.objectId && userDetails.primaryId) {
            // Set profile pic from multiple pics
            userMultiplePics = JSON.parse(userMultiplePics);
            let objectId = userDetails.objectId;
            let primaryId = userDetails.primaryId;
            userMultiplePics.forEach((element) => {
                if (primaryId == element.id) {
                    element.primary = 0;
                }
                if (objectId == element.id) {
                    element.primary = 1;
                    userPic = element.image;
                }

            });
            userMultiplePics = JSON.stringify(userMultiplePics);
        }

        // Update User Info
        let userObject = {
            first_name: userDetails.first_name ? userDetails.first_name : userData[0].first_name,
            last_name: userDetails.last_name ? userDetails.last_name : userData[0].last_name,
            password: userDetails.new_password ? md5(userDetails.new_password) : userData[0].password,
            gender: userDetails.gender ? userDetails.gender : userData[0].gender,
            dob: userDetails.dob ? userDetails.dob : userData[0].dob,
            user_lat: userDetails.user_lat ? userDetails.user_lat : userData[0].user_lat,
            user_long: userDetails.user_long ? userDetails.user_long : userData[0].user_long,
            favourite_team: userDetails.favourite_team ? userDetails.favourite_team : userData[0].favourite_team,
            shoe_size: userDetails.shoe_size ? userDetails.shoe_size : userData[0].shoe_size,
            pant_size: userDetails.pant_size ? userDetails.pant_size : userData[0].pant_size,
            shirt_size: userDetails.shirt_size ? userDetails.shirt_size : userData[0].shirt_size,
            hat_size: userDetails.hat_size ? userDetails.hat_size : userData[0].hat_size,
            tracksuit_size: userDetails.tracksuit_size ? userDetails.tracksuit_size : userData[0].tracksuit_size,
            organization_type: userDetails.organization_type ? userDetails.organization_type : userData[0].organization_type,
            user_available_days: userDetails.user_available_days ? userDetails.user_available_days : userData[0].user_available_days,
            user_stripe_act: userDetails.user_stripe_act ? userDetails.user_stripe_act : userData[0].user_stripe_act,
            favourite_team_id: userDetails.favourite_team_id ? userDetails.favourite_team_id : userData[0].favourite_team_id,
            favourite_brand_id: userDetails.favourite_brand_id ? userDetails.favourite_brand_id : userData[0].favourite_brand_id,
            favourite_events: userDetails.favourite_events ? userDetails.favourite_events : userData[0].favourite_events,
            favourite_fans: userDetails.favourite_fans ? userDetails.favourite_fans : userData[0].favourite_fans,
            user_find_me: userDetails.user_find_me ? userDetails.user_find_me : userData[0].user_find_me,
            user_country: userDetails.user_country ? userDetails.user_country : userData[0].user_country,
            user_state: userDetails.user_state ? userDetails.user_state : userData[0].user_state,
            user_city: userDetails.user_city ? userDetails.user_city : userData[0].user_city,
            zipcode: userDetails.zipcode ? userDetails.zipcode : userData[0].zipcode,
            phone_country_code: userDetails.phone_country_code ? userDetails.phone_country_code : userData[0].phone_country_code,
            user_status: userDetails.user_status ? userDetails.user_status : userData[0].user_status,
            phone_no: userDetails.phone_no ? userDetails.phone_no : userData[0].phone_no,
            user_networks: userDetails.user_networks ? userDetails.user_networks : userData[0].user_networks,
            user_onboarding_country: userDetails.user_onboarding_country ? userDetails.user_onboarding_country : userData[0].user_onboarding_country,
            onboarding_phone_no: userDetails.onboarding_phone_no ? userDetails.onboarding_phone_no : userData[0].onboarding_phone_no,
            onboarding_country_code: userDetails.onboarding_country_code ? userDetails.onboarding_country_code : userData[0].onboarding_country_code,
            user_pic: userPic,
            user_multiple_pics: userMultiplePics,
            user_pic2: userPic2,
            user_pic3: userPic3,
            age_visibility: userDetails.age_visibility == undefined ?  userData[0].age_visibility : userDetails.age_visibility,
            user_language: userDetails.user_language ? userDetails.user_language : userData[0].user_language,
        };

        await commonFunctions.updateSingleRowNew(APIRef, 'user', userObject, 'user_id', userId, 'Upadte user');
        let updatedUserData = await await adminServices.getSingleUser(userId);
        updatedUserData[0].user_multiple_pics = JSON.parse(updatedUserData[0].user_multiple_pics);

        return responses.actionCompleteResponse(res, languageCode, updatedUserData[0], "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);

    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});

// Delete user API
routes.post('/deleteUser', adminValidator.deleteUser, authenticateController.data.auth_route, async function (req, res) {

    let languageCode = req.body.language;
    try {
        
        const userId = req.body.user_id;
        let deletedTime = new Date();
        deletedTime = moment(deletedTime).utc().format();
        // Delete a single user
        const updateData = {
            user_status: 3,
            deleted_on: deletedTime
        }
        await commonFunctions.updateSingleRowNew(APIRef, 'user', updateData, 'user_id', userId, 'disable user');
        return responses.actionCompleteResponse(res, languageCode, {}, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }
});


// Get all language code API
routes.get('/get_language_code', authenticateController.data.auth_route, async function (req, res) {

    const languageCode = req.query.language;
    try {
        
        const userId = authenticateController.data.decode(req.headers['ss_token']);

        const translationCode = await adminServices.getLanguageCode();  // Get Languages Code

        return responses.actionCompleteResponse(res, languageCode, translationCode, "ACTION_COMPLETE", constants.responseMessageCode.ACTION_COMPLETE);
    } catch (err) {
        console.log('Caught an error!', err);
        return responses.sendError(res, languageCode, {}, "", 0);
    }

});


module.exports = routes;