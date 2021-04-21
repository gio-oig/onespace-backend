require('dotenv').config();
const jwt = require('jsonwebtoken');

const HttpError = require('../utils/errorHelper');

const verifyToken = (req, res, next) => {
	// check if token in in header and get it's value
	const token = req.headers['authorization'];

	if (!token) return next(new HttpError('Access Denied', 401));

	try {
		// verify user email saved in token
		const verified = jwt.verify(token, process.env.ACCESS_SECRET);
		// add user email in request object
		console.log(verified);
		req.user = verified.email;
	} catch (error) {
		return next(new HttpError('Invalid Token', 400));
	}
	next();
};

module.exports = { verifyToken };
