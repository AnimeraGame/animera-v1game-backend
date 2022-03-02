App     : SwiftSpar
Version : 1.0.0
Author  : Shubham Anand
email   : anandshubham.emilence@gmail.com/shubham@emilence.com

baseUrl: https://44.227.97.173:3000/swiftSpar/
uploadPath: https://s3-us-west-2.amazonaws.com/swift-spar/
readmePath: https://dev.swiftspar.com:3000/swiftSpar/readme/readme.txt

basicAuth credentials:
    UserName: swiftspar@emilence.com
    Password: Emilence@1

Notes:
    --> Send token in header in all API's(except signup, login and forgotPassword API's) like:
    ss_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE1MzExMjM3NDAsImV4cCI6MTUzMzcxNTc0MH0.ARupD0Y3bvzvCVDHeZtTFNU_6cFjNmwTMrqsIjD_C7M
    
    --> send languageCode as query parameter in GET, DELETE type APIs and in body in PUT, POST APIs

        en: english
        ar: arabic 

        send like:
            language: en

=========================== Request Status Codes =======================

    ACTION_COMPLETE: 200,
    CLIENT_ERROR: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500


//********************************************************************//
//                         User Sign up                               //
//********************************************************************//

1. User Sign up 

Request Type = Post
Header : Formdata
Request URL: baseurl/user_auth/sign_up   

Request Params : {
    first_name*
	last_name
	email*
	password*
	gender
	dob
	user_lat
	user_long
	zipcode
	user_pic,
    installed_app_version
}


Response : 
{
    "status": 200,
    "message": "Registration successful.",
    "data": {
        "user_id": 46,
        "first_name": "Shubham",
        "last_name": "",
        "email": "shubham@emilence.com",
        "password": "c4ca4238a0b923820dcc509a6f75849b",
        "user_pic": "",
        "user_multiple_pics": [],
        "user_pic2": "",
        "user_pic3": "",
        "user_lat": "",
        "user_long": "",
        "distance": "",
        "google_id": "",
        "reset_password": "",
        "facebook_id": "",
        "twitter_id": "",
        "gender": "",
        "dob": "",
        "dob_count": 0,
        "dob_max_count": 3,
        "favourite_team": "",
        "favourite_team_id": "",
        "favourite_brand_id": "",
        "favourite_events": "",
        "favourite_fans": "",
        "shoe_size": "",
        "pant_size": "",
        "shirt_size": "",
        "hat_size": "",
        "tracksuit_size": "",
        "device_token": "",
        "device_type": "0",
        "type": "personal",
        "randomCode": "H5LLH",
        "random_valid_up_tp": "",
        "verifyAccount": "not verified",
        "organization_type": "",
        "user_country": "",
        "user_state": "",
        "user_city": "",
        "zipcode": "",
        "user_available_days": "",
        "badge_count": 0,
        "user_stripe_act": "",
        "user_org_paid": 0,
        "user_status": 1,
        "user_find_me": 0,
        "customer_id_stripe": "",
        "installed_app_version": "",
        "build_no": "",
        "os_version": "",
        "user_language": "",
        "phone_country_code": "",
        "phone_no": "",
        "user_networks": "",
        "onboarding_country_code": "",
        "user_onboarding_country": "",
        "onboarding_phone_no": "",
        "age_visibility": 1,
        "user_created_on": "2020-01-10T10:40:29.000Z",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0NiwiaWF0IjoxNTc4NjUyODI5LCJleHAiOjE1ODEyNDQ4Mjl9.XUxyeOr3jq7pXiAWC0W7nEVlItpzZGVSYiQ7UnHFISc",
        "share_count": 0,
        "user_multiple_pics_count": "6"
    }
}

//************************ End of User Sign up ***********************//


//********************************************************************//
//                           user login                               //
//********************************************************************//

2. User Login 

Request Type = Post
Header : X-www-form-encoded
Request URL: baseurl/user_auth/login  

Request Params :
{
	email*
	password*
}


Response : 
{
    "status": 200,
    "message": "Please verify your account.",
    "data": {
        "user_id": 46,
        "first_name": "Shubham",
        "last_name": "",
        "email": "shubham@emilence.com",
        "password": "c4ca4238a0b923820dcc509a6f75849b",
        "user_pic": "",
        "user_multiple_pics": [],
        "user_pic2": "",
        "user_pic3": "",
        "user_lat": "",
        "user_long": "",
        "distance": "",
        "google_id": "",
        "reset_password": "",
        "facebook_id": "",
        "twitter_id": "",
        "gender": "",
        "dob": "",
        "dob_count": 0,
        "dob_max_count": 3,
        "favourite_team": "",
        "favourite_team_id": "",
        "favourite_brand_id": "",
        "favourite_events": "",
        "favourite_fans": "",
        "shoe_size": "",
        "pant_size": "",
        "shirt_size": "",
        "hat_size": "",
        "tracksuit_size": "",
        "device_token": "",
        "device_type": "0",
        "type": "personal",
        "randomCode": "H5LLH",
        "random_valid_up_tp": "",
        "verifyAccount": "not verified",
        "organization_type": "",
        "user_country": "",
        "user_state": "",
        "user_city": "",
        "zipcode": "",
        "user_available_days": "",
        "badge_count": 0,
        "user_stripe_act": "",
        "user_org_paid": 0,
        "user_status": 1,
        "user_find_me": 0,
        "customer_id_stripe": "",
        "installed_app_version": "",
        "build_no": "",
        "os_version": "",
        "user_language": "",
        "phone_country_code": "",
        "phone_no": "",
        "user_networks": "",
        "onboarding_country_code": "",
        "user_onboarding_country": "",
        "onboarding_phone_no": "",
        "age_visibility": 1,
        "user_created_on": "2020-01-10T10:40:29.000Z",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0NiwiaWF0IjoxNTc4NjUzMjI0LCJleHAiOjE1ODEyNDUyMjR9.UQ5TYEb3XdyVMfxBH6j3-Gbk7WRc7aT6YRICT2cHMSI",
        "temp_resolve": 2,
        "package_bought": 0,
        "returning_user": 1,
        "user_multiple_pics_count": "6"
    }
}

//************************* End of User Login ************************//
