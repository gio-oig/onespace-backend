const socket = (io) =>
	io.on('connect', (socket) => {
		socket.on('createPost', () => {
			console.log('object');
		});
	});

module.exports = socket;
