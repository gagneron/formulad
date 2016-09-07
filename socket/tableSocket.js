module.exports = function(io, tables) {

	var messages = io.of('/tableMessages').on('connection', function(socket) {
		console.log('connected to table');

		socket.on('joinTable', function(data) {
			console.log('joined table', data);
			socket.userName = data.userName;
			var tableNum = data.tableNum;
			socket.join(tableNum);
			var newPlayer = {
				name: data.userName,
				pic: data.userPic,
				isReady: false
			};
			var table = getTable(tableNum);
			table.players.push(newPlayer);
			table.numHumans++;
			if (table.numHumans === 1) {
				table.host = newPlayer;
			}

		});

		socket.on('chatFeed', function(data) {
			console.log('message received', data);
			var tableNum = data.tableNum;
			io.of('/tableMessages').in(tableNum).emit('incomingChatMessage', data);
			io.sockets.in(tableNum).emit('incomingChatMessage', data);
		});

		function getTable(tableNum) {
			for (var i = 0; i < tables.length; i++) {
				if (tables[i].num === tableNum) {
					return tables[i];
				}
			}
		}


		// function updateUserList(tableNum, updateAll) {
		// 	var getUsers = io.of('/tableMessages').clients(tableNum);
		// 	var userList = {};
		// 	for (var i in getUsers) {
		// 		userList.push({user: getUsers[i].userName});
		// 	}
		// 	socket.to(tableNum).emit('updateUserList', JSON.stringify(userList));
		// 	if (updateAll) {
		// 		socket.broadcast.to(tableNum).emit('updateUserList', JSON.stringify(userList));
		// 	}
		// }

		// socket.on('updateUserList', function(data) {
		// 	updateUserList(data.tableNum);
		// });


		// updates the front end player list
		function updatePlayerList(tableNumber, updateAll) {
			var playerList = tables[socket.tableNumber].players;
			var host = tables[socket.tableNumber].host;
			var playerInfo = {
				playerList: playerList,
				host: host
			}
			socket.to(tableNumber).emit('updatePlayerList', JSON.stringify(playerInfo));
			if (updateAll) {
				socket.broadcast.to(tableNumber).emit('updatePlayerList', JSON.stringify(playerInfo));
			}
		}
	});
};