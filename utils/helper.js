require('dotenv').config();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const HttpError = require('./errorHelper');

const Helper = {
	// get a day after 1 day @return miliseconds
	getExpireDate: (day = 1) => {
		return moment().add(day, 'days').valueOf();
	},
	// @return token:string
	getJWTtoken: (email, expires) => {
		return jwt.sign({ email: email }, process.env.ACCESS_SECRET, {
			expiresIn: expires,
		});
	},
	// @return email:string
	verifyJWTtoken: (token) => {
		try {
			if (!token) {
				throw new HttpError('Unauthorized Access');
			}
			const email = jwt.verify(token, process.env.ACCESS_SECRET);
			// console.log('email:' + email);
			return email.email;
		} catch (error) {
			throw new HttpError('Unauthorized Access');
		}
	},
};

module.exports = Helper;
