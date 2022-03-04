App     : Marsverse
Version : 1.0.0
Author  : Vilayhong Anousone
email   : sarlongda514@gmail.com


Notes:
    --> Send token in header in all API's(except signup, login) like:
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
    username*
	wallet_address
	user_pic,
    no_hrs_played
}


Response : 
{
    "status": 200,
    "message": "Registration successful.",
    "data": {
        "user_id": 1,
        "username": "test1",
        "wallet_address": "test1",
        "user_pic": "",
        "no_hrs_played": null,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2NDYzNjIwNDIsImV4cCI6MTY0ODk1NDA0Mn0.a0ICLY4eBLztlzfTOXH8xFqgodPHQa6VvGl8xYZUDnM"
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
	wallet_address*
}


Response : 
{
    "status": 200,
    "message": "Logged in successfully.",
    "data": {
        "user_id": 1,
        "username": "test1",
        "wallet_address": "test1",
        "user_pic": "",
        "no_hrs_played": null,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2NDYzNjQwNDYsImV4cCI6MTY0ODk1NjA0Nn0.Ot0Qr5hfhqjyUfv7w_jY9T_B2YQH80mgi-8VJSc0-oM"
    }
}

//************************* End of User Login ************************//
