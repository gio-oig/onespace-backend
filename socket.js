const { addUser, removeUser, getUserList, getUsersMap } = require('./users');
const { createComment } = require('./utils/commentHandler');

const socket = (io) =>
	io.on('connection', (socket) => {
		// console.log(socket.handshake.query);

		console.log('socketId: ' + socket.id);
		socket.onAny((...args) => {
			console.log(args);
		});

		console.log(' %s sockets connected', io.engine.clientsCount);

		// console.log('usersList: ' + getUserList());

		socket.on('join', ({ userId }) => {
			addUser({ userId, socketId: socket.id });
			socket.userId = userId;
			io.emit('onlineUsers', { onlineUsers: getUserList() });
		});

		socket.on('logout', ({ userId }) => {
			removeUser(userId);
			io.emit('onlineUsers', { onlineUsers: getUserList() });
			// console.log(getUserList());
		});

		socket.on('createComment', async (body) => {
			const newComment = await createComment(body);
			console.log(newComment);
			await io.emit('newComment', newComment);
		});

		// socket.on('sendMessage', ({ userId: receiverId, message }) => {
		// 	console.log('receiverId ' + receiverId);
		// 	const receiverSocketId = getUsersMap(receiverId);
		// 	console.log('receiverSocketId ' + receiverSocketId);
		// 	socket.to(receiverSocketId).emit('getMessage', message);
		// });

		// socket.on('end', ({ userId }) => {
		// 	removeUser(userId);
		// 	socket.disconnect();
		// });

		socket.on('disconnect', () => {
			console.log(socket.userId);
			removeUser(socket.userId);
			console.log('user had left');
		});
	});

module.exports = socket;
