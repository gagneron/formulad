module.exports = function(io, tables) {

	var messages = io.of('/tableMessages').on('connection', function(socket) {
		console.log('connected to table');

		socket.on('joinTable', function(data, callback) {
			var userName = data.userName;
			var tableNum = data.tableNum;
			var table = getTable(tableNum);

			if (!table) {
				var error = {
					error: true,
					msg: 'noTable'
				};
				return callback(error);
			}
			console.log('joined table', data);

			socket.playerName = userName;
			socket.tableNum = tableNum;
			socket.join(tableNum);
			
			var newPlayer = {
				name: userName,
				// pic: data.userPic,
				isReady: false
			};
			table.players.push(newPlayer);
			table.numHumans++;
			if (table.numHumans === 1) {
				table.host = newPlayer;
			}

			updatePlayerList(tableNum, true);
		});

		socket.on('chatFeed', function(data) {
			console.log('message received', data);
			var tableNum = data.tableNum;
			io.of('/tableMessages').in(tableNum).emit('incomingChatMessage', data);
			// io.sockets.in(tableNum).emit('incomingChatMessage', data);
		});

		socket.on('readyStatusChange', function(data) {
			socketReadyStatusChange(data);
		});

		socket.on('attemptStart', function(data) {
			socketAttemptStart(data);
		});

		socket.on('disconnect', function(data) {
			socketDisconnect(data);
		});

		function socketAttemptStart(data) {

		}

		function socketReadyStatusChange(data) {
			var tableNum = data.tableNum;
			var playerName = data.userName;
			var isReady = data.isReady;
			var table = getTable(tableNum);
			var player;
			for (var i = 0; i < table.numHumans; i++) {
				player = table.players[i];
				if (player.name === playerName) {
					player.isReady = isReady;
					updatePlayerList(tableNum, true);
					return;
				}
			}
		}

		function socketDisconnect(data) {
			var tableNum = socket.tableNum;
			var playerName = socket.playerName;
			var table = getTable(tableNum);
			if (tableNum == null) {
				return;
			}
			var player;
			var leavingPlayer;
			for (var i = 0; i < table.numHumans; i++) {
				player = table.players[i];
				if (player.name === playerName) {
					leavingPlayer = table.players.splice(i, 1)[0];
					delete table.sockets[socket.playerName];
					break;
				}
			}
			table.numHumans--;
			if (table.host.playerName === playerName) {
				tables.host = tables.players[0];
			}
			// xx need to handle empty table
			updatePlayerList(tableNum, true);
		}

		function getTable(tableNum) {
			for (var i = 0; i < tables.length; i++) {
				if (tables[i].num === tableNum) {
					return tables[i];
				}
			}
			return null;
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
		function updatePlayerList(tableNum, updateAll) {
			console.log('going to update playerlist');
			var table = getTable(tableNum);
			var playerList = table.players;
			var host = table.host;
			var playerInfo = {
				playerList: playerList,
				host: host
			}
			// socket.to(tableNum).emit('updatePlayerList', JSON.stringify(playerInfo));
			if (updateAll) {
				// socket.broadcast.to(tableNum).emit('updatePlayerList', JSON.stringify(playerInfo));
				// io.of('/tableMessages').in(tableNum).emit('updatePlayerList', JSON.stringify(playerInfo));
				io.of('/tableMessages').in(tableNum).emit('updatePlayerList', playerInfo);
			} else {
				socket.emit('updatePlayerList', playerInfo); 
				
			}
		}


		 function findClientsSocket(tableNum) {
	        var res = [],
	        	ns = io.of("/tableMessages");
	        if (ns) {
	            for (var id in ns.connected) {
	                if(roomId) {
	                    var index = ns.connected[id].rooms.indexOf(tableNum);
	                    if(index !== -1) {
	                        res.push(ns.connected[id]);
	                    }
	                }
	                else {
	                    res.push(ns.connected[id]);
	                }
	            }
	        }
	        return res;
	    }
	});
};