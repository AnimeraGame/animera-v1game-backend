const logger = require('../helperFunction/logger');
const { responseMessageCode, responseMessageFlags } = require('./constants');
const {
    getResponseMessage
} = require('../services/multilingualService');

const actionCompleteResponse = (res, languageCode, data, msg, successCode) => {
    switch (successCode) {
        case responseMessageCode.ACTION_COMPLETE:
        case responseMessageCode.REGISTRATION_SUCCESSFUL:
        case responseMessageCode.LOGIN_SUCCESSFULLY:
        case responseMessageCode.LOGIN_SUCCESSFULLY_NOT_VERIFY:
        case responseMessageCode.PROFILE_UPDATED:
        case responseMessageCode.USER_SUBSCRIBED_SUCCESSFULLY:
        case responseMessageCode.ACCOUNT_VERIFIED:
        case responseMessageCode.VERSION_FETCHED:
        case responseMessageCode.SAME_PREFRENCES:
        case responseMessageCode.FEEDBACK:
        case responseMessageCode.DEVICE_TOKEN_UPDATED:
        case responseMessageCode.USER_AVAILABLE:
        case responseMessageCode.TICKET_VIEWED:
        case responseMessageCode.REQUEST_ALREADY_SENT:
        case responseMessageCode.ALREADY_FRIEND:
        case responseMessageCode.ALREADY_INTERESTED:
        case responseMessageCode.ALREADY_VIEWED_DEAL:
        case responseMessageCode.ALREADY_FOLLOWED:
        case responseMessageCode.DOCUMENT_UPLOADED:
        case responseMessageCode.OTP_IS_SEND_ON_REGISTERED_EMAIL:
        case responseMessageCode.FRIEND_REQUEST_CANCLLED:
        case responseMessageCode.EVENT_REQUEST_ACCEPETD:
        case responseMessageCode.REQUEST_SENT:
        case responseMessageCode.GROUP_CHAT_DELETED:
        case responseMessageCode.FRIEND_REQUEST_ACCEPTED:
        case responseMessageCode.FRIEND_REQUEST_REJECTED:
        case responseMessageCode.CHECK_EMAIL_FOR_VERIFICATION_CODE:
        case responseMessageCode.DEACTIVE_ACCOUNT:
        case responseMessageCode.CREATE_GROUP_ACTIVITY:
        case responseMessageCode.GROUP_ACTIVITY_UPDATED:
        case responseMessageCode.DEAL_ADDED:
        case responseMessageCode.GROUP_EDIT:
        case responseMessageCode.CREATE_GROUP:
        case responseMessageCode.CREATE_EVENT:
        case responseMessageCode.EVENT_UPDATED:
        case responseMessageCode.FEED_POSTED:
        case responseMessageCode.LINKUP_ACTIVITY_CREATED:
        case responseMessageCode.LINKUP_UPDATED:
        case responseMessageCode.EMPTY_PREFRENCES:
            msg = getResponseMessage(successCode, languageCode);
            break;
        default:
            break;
    }
    const response = {
        status: responseMessageFlags.ACTION_COMPLETE,
        message: msg || getResponseMessage(
            responseMessageCode.ACTION_COMPLETE,
            languageCode
        ),
        data: data || {}
    };
    res.status(responseMessageFlags.ACTION_COMPLETE).send(response);
};

const sendError = (res, languageCode, data, msg, errCode) => {
    let statusCode = responseMessageFlags.CLIENT_ERROR;
    if (errCode == 'DISABLED_ACCOUNT') {
        statusCode = responseMessageFlags.UNAUTHORIZED;
    }
    if (errCode == 'INVALID_ACCESS_TOKEN') {
        statusCode = responseMessageFlags.UNAUTHORIZED;
    }
    if (errCode == 'USER_NOT_EXIST') {
        statusCode = responseMessageFlags.UNAUTHORIZED;
    }
    if (errCode == 'NO_DATA_FOUND') {
        statusCode = responseMessageFlags.ACTION_COMPLETE;
    }
    switch (errCode) {
        case responseMessageCode.PARAMETER_MISSING:
        case responseMessageCode.INCORRECT_EMAIL_PASSWORD:
        case responseMessageCode.INCORRECT_WALLET_ADDRESS:
        case responseMessageCode.DISABLED_ACCOUNT:
        case responseMessageCode.INVALID_CODE:
        case responseMessageCode.EMAIL_NOT_EXISTS:
        case responseMessageCode.USER_NOT_EXIST:
        case responseMessageCode.PLAN_EXISTS:
        case responseMessageCode.ADD_PAYMENT_CARD:
        case responseMessageCode.COACH_BANK_DETAILS:
        case responseMessageCode.INVALID_ACCESS_TOKEN:
        case responseMessageCode.ACCESS_TOKEN_REQUIRED:
        case responseMessageCode.FORGOT_PASSWORD_MAIL_EXPIRE:
        case responseMessageCode.SELECT_PREFRENCES:
        case responseMessageCode.FIND_ME:
        case responseMessageCode.FEEDBACK_ERROR:
        case responseMessageCode.DOB_MAX_UPDATE:
        case responseMessageCode.MULTIPLE_PICS_COUNT:
        case responseMessageCode.INVALID_SOCIAL_LOGIN:
        case responseMessageCode.OLD_PASSWORD_INCORRECT:
        case responseMessageCode.PLAN_ID_NOT_VALID:
        case responseMessageCode.NO_DATA_FOUND:
        case responseMessageCode.ERROR_IN_EXECUTION:
        case responseMessageCode.INVALID_CARD:
        case responseMessageCode.ACTIVE_CARD:
        case responseMessageCode.ACTIVE_SUBSCRIPTION:
        case responseMessageCode.COACH_SUBSCRIPTION_PLAN_NOT_AVAILED:
        case responseMessageCode.COACH_MAX_BANK_ACCOUNT:
        case responseMessageCode.COACH_ACCOUNT_ERROR:
        case responseMessageCode.PAYOUT_ACCOUNT:
        case responseMessageCode.EMAIL_ALREADY_EXISTS:
        case responseMessageCode.WALLET_ALREADY_EXISTS:
        case responseMessageCode.INVALID_CREDENTIALS:
        case responseMessageCode.NOT_A_VALID_IMAGE_LIST:
        case responseMessageCode.SIZE_EXCEEDS:
        case responseMessageCode.VIDEO_SIZE_EXCEEDS:
        case responseMessageCode.ACCOUNT_NOT_REGISTER:
        case responseMessageCode.USER_ALREADY_EXISTS:
        case responseMessageCode.NO_USER_FOR_THIS_TOKEN:
        case responseMessageCode.PLEASE_PROVIDE_TOKEN:
        case responseMessageCode.INVALID_OTP:
        case responseMessageCode.ERROR_IN_SENDING_OTP:
        case responseMessageCode.INVALID_SUBSCRIPTION:
        case responseMessageCode.ACTIVITY_ALREADY_REPORTED:
        case responseMessageCode.GROUP_ALREADY_REPORTED:
        case responseMessageCode.OWN_ACTIVITY_REPORT:
        case responseMessageCode.OWN_GROUP_REPORT:
        case responseMessageCode.OWN_PROFILE_REPORT:
        case responseMessageCode.USER_ALREADY_REPORT:
        case responseMessageCode.MAXIMUM_CAPACITY_CREATOR:
        case responseMessageCode.MAXIMUM_CAPACITY_MEMBER:
        case responseMessageCode.GROUP_CAHT_MEMBER_ERROR:
        case responseMessageCode.DISABLE_LINKUP_ACTIVITY:
            msg = getResponseMessage(errCode, languageCode);
            break;
        default:
            statusCode = responseMessageFlags.INTERNAL_SERVER_ERROR;
            break;
    }

    const response = {
        status: statusCode,
        message: msg || getResponseMessage(
            responseMessageCode.ERROR_IN_EXECUTION,
            languageCode
        ),
        data: data || {}
    };
    res.status(statusCode).send(response);
};

const parameterMissingResponse = (res, languageCode, err, data) => {
    if(err){
        try {
            err = err + getResponseMessage(responseMessageCode.MISSING_PARAMETER, languageCode);
        } catch (exception) {
            err = null;
        }
    }
    const response = {
        status: responseMessageFlags.BAD_REQUEST,
        message: err || getResponseMessage(
            responseMessageCode.MISSING_PARAMETER,
            languageCode
        ),
        data: data || {}
    };
    res.status(responseMessageFlags.BAD_REQUEST).send(response);
}

module.exports = {
    actionCompleteResponse,
    sendError,
    parameterMissingResponse
};
