const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config/index');

const TOKENTIME = 60*60*24*30
const SECRET = config.SECRET_KEY;
let authenticate = expressJwt({ secret: SECRET });

let generateAccessToken = (req, res, next) => {	
	req.token = req.token || {};
	req.token = jwt.sign({
		id: req.user.id,
	}, SECRET, {
		expiresIn: TOKENTIME
	});
	next();
}

let respond = (req, res, cb) => {
	res.status(200).json({ success: 1, data: req.user, token: req.token });
}


module.exports = {
	authenticate,
	generateAccessToken,
	respond
}
