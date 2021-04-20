let users = [];
let usersMap = {};

const addUser = ({ userId, socketId }) => {
	usersMap[userId] = socketId;
	users.push(userId);
	console.log(usersMap, users);
};

const getUserList = () => {
	return users;
};

const getUsersMap = (userId) => {
	return usersMap[userId];
};

const removeUser = (userId) => {
	users = users.filter((id) => id !== userId);

	if (usersMap.hasOwnProperty(userId)) {
		delete usersMap[userId];
		// console.log(usersMap, users);

		console.log(`deleted user id: ${userId}`);
	} else {
		console.log('could not find user id');
	}
};

module.exports = { addUser, getUserList, getUsersMap, removeUser };
