module.exports = function(io, tables) {
	var messages = io.of('/messages').on('connection', function(socket) {
		console.log('connected to table');

		socket.on('joinTable', function(data) {
			socket.userName = data.userName;
			socket.join(data.tableNum); 
		});


		function updateUserList(tableNum, updateAll) {
			var getUsers = io.of('/messages').clients(tableNum);
			var userList = {};
			for (var i in getUsers) {
				userList.push({user: getUsers[i].userName});
			}
			socket.to(tableNum).emit('updateUserList', JSON.stringify(userList));
			if (updateAll) {
				socket.broadcast.to(tableNum).emit('updateUserList', JSON.stringify(userList));
			}
		}

		socket.on('updateUserList', function(data) {
			updateUserList(data.tableNum);
		});
	});
};