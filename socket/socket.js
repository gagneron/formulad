module.exports = function(io, tables) {
	var Table = function(tableName, tableNumber) {
		this.name = tableName;
		this.num = tableNumber;
		this.players = [];
		this.numHumans = 0;
		this.numBots = 2;
		this.host;
		this.everyoneReady = false;
		this.sockets = {};
	};

	var lobby = io.of('/lobby').on('connection', function(socket) {
		socket.emit('tableUpdate', JSON.stringify(tables)); // send to only the active socket
		
		socket.on('newTable', function(data) {
			var table = new Table(data.tableName, data.tableNum);
			tables.push(table);
			socket.broadcast.emit('tableUpdate', JSON.stringify(tables)); // send to everyone except active socket
			socket.emit('tableUpdate', JSON.stringify(tables)); // send to only the active socket
		});
	});
};