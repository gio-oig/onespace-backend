const User = require('../models/User');

const getAllUsers = async (req, res) => {
	const users = await User.find({}).select({ image: 1, name: 1 });

	res.json(users);
};

module.exports = { getAllUsers };
