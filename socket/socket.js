module.exports = function(io, tables) {
	var lobby = io.of('/lobby').on('connection', function(socket) {
		console.log('connection made on server');
		socket.emit('tableUpdate', JSON.stringify(tables)); // send to only the active socket
		
		socket.on('newTable', function(data) {
			tables.push(data);
			socket.broadcast.emit('tableUpdate', JSON.stringify(tables)); // send to everyone except active socket
			socket.emit('tableUpdate', JSON.stringify(tables)); // send to only the active socket
		});
	});
};