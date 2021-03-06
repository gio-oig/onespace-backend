const Helper = require('../utils/helper');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const HttpError = require('../utils/errorHelper');

const { loginValidation, registerValidation } = require('../validations');

const register = async (req, res, next) => {
	// console.log(req.file);
	// return;
	const { name, email, password } = req.body;

	try {
		await registerValidation(req.body);
	} catch (error) {
		const errors = {};
		for (err of error.details) {
			errors[err.context.key] = err.message;
			console.log(err.message);
		}
		return res.status(422).json({
			error: errors,
		});
	}

	const userExists = await User.findOne({ email });
	if (userExists) {
		return res.status(422).json({
			error: { email: 'User already exists with this email' },
		});
		// return next(new HttpError('user already exists with this email', 422));
	}

	let hashPass;
	try {
		// generate hashed passsword
		hashPass = await bcrypt.hash(password, await bcrypt.genSalt());
	} catch (error) {
		return next(new Error(error.message));
	}

	// const expireAt = Helper.getExpireDate();
	// const TOKEN = Helper.getJWTtoken(email, expireAt);
	// console.log(expireAt);
	// res.cookie('token', TOKEN, { httpOnly: true, expires: new Date(expireAt) });
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
		return next(new Error('Logging in faild, please try later', 500));
	}

	res.json(createdUser);
};
const login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		await loginValidation({ email, password });
	} catch (error) {
		const errors = {};
		for (err of error.details) {
			errors[err.context.key] = err.message;
			console.log(err.message);
		}
		res.statusCode = 422;
		return res.json({
			error: errors,
		});
		// return next(new Error('validation error'));
	}

	let existingUser;
	try {
		existingUser = await User.findOne({ email });
		if (!existingUser) {
			return res.status(422).json({
				error: { email: 'Invalid Email' },
			});
			// return next(new HttpError('Wrong Email', 500));
		}
	} catch (error) {
		return next(new HttpError(error.message, 500));
	}
	const validPassword = await bcrypt.compare(password, existingUser.password);
	if (!validPassword) {
		return res.status(422).json({
			error: { password: 'Invalid Password' },
		});
		// return next(new Error('Invalid Password'));
	}

	// get token and set into cookies
	const expireAt = Helper.getExpireDate();
	const token = Helper.getJWTtoken(email, expireAt);

	return res.json({ user: existingUser, token });
};
const logout = async (req, res, next) => {
	res.send('logged out');
};
const isLogedIn = async (req, res, next) => {
	const token = req.headers['authorization'];
	console.log('token on refresh ' + token);
	if (!token) {
		return next(new Error('Unauthorized Access', 500));
	}
	try {
		//token validation
		const email = Helper.verifyJWTtoken(token);
		console.log('email ' + email);
		let user = await User.findOne({ email });
		res.json({ user }); // logged in
	} catch (e) {
		return next(new Error(e.message, 400));
		// res.send(false);
	}
};

module.exports = { register, login, logout, isLogedIn };
