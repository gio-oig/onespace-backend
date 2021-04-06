const Helper = require('../utils/helper');
const bcrypt = require('bcryptjs');
const HttpError = require('../utils/errorHelper');
const User = require('../models/User');

const register = async (req, res, next) => {
	// console.log(req.file);
	// return;
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });
	if (userExists) {
		return next(new HttpError('user already exists with this email', 400));
	}

	let hashPass;
	try {
		// generate hashed passsword
		hashPass = await bcrypt.hash(password, await bcrypt.genSalt());
	} catch (error) {
		return next(new HttpError(error));
	}

	const expireAt = Helper.getExpireDate();
	const TOKEN = Helper.getJWTtoken(email, expireAt);
	// console.log(expireAt);
	res.cookie('token', TOKEN, { httpOnly: true, expires: new Date(expireAt) });
	// let image;
	// try {
	// 	image = req.file ? req.file.filename : null;
	// } catch (error) {
	// 	console.log(error);
	// }
	// console.log(image);
	const user = new User({
		name,
		email,
		image: req?.file?.filename || '',
		password: hashPass,
	});

	let createdUser;
	try {
		createdUser = await user.save();
	} catch (error) {
		return next(new HttpError('Logging in faild, please try later', 500));
	}

	res.json(createdUser);
};
const login = async (req, res, next) => {
	const { email, password } = req.body;

	// res.sendStatus(500);
	// console.log(req.body);
	// return;

	let existingUser;
	try {
		existingUser = await User.findOne({ email });
		console.log(existingUser);
		if (!existingUser) {
			return next(new HttpError('Wrong Email'));
		}
	} catch (error) {
		console.log(error);
	}
	const validPassword = await bcrypt.compare(password, existingUser.password);
	if (!validPassword) return next(new HttpError('Invalid Password'));

	// get token and set into cookies
	const expireAt = Helper.getExpireDate();
	const token = Helper.getJWTtoken(email, expireAt);

	res.cookie('token', token, {
		httpOnly: true,
		expires: new Date(expireAt),
	});

	return res.json(existingUser);
};
const logout = async (req, res, next) => {
	res.cookie('token', '', {
		httpOnly: true,
		expires: new Date(0),
	});
	res.send('logged out');
};
const isLogedIn = async (req, res, next) => {
	console.log(req.cookies);
	try {
		const token = req.cookies.token;
		if (!token) {
			throw new Error('Unauthorized Access');
		}
		//token validation
		const email = Helper.verifyJWTtoken(token);
		console.log(email);
		let user = await User.findOne({ email });

		res.send(user); // logged in
	} catch (e) {
		//remove the old/expire token
		res.cookie('token', '', {
			httpOnly: true,
			expires: new Date(0),
		});
		// return next(new HttpError(e.message, 400));
		res.send(false);
	}
};

module.exports = { register, login, logout, isLogedIn };
