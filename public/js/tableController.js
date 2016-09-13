myApp =  angular.module('myApp', [
	'btford.socket-io',
	'tableMessaging'


	]);
// app = myApp;
// myApp.config(['$routeProvider'])

myApp.factory('socket', ['socketFactory', function(socketFactory) {
	return socketFactory({
		ioSocket: io.connect('/tableMessages')
	});
}]);

myApp.controller('TableController', ['$scope', 'socket', function($scope, socket) {
	$scope.tables = [];
	$scope.newTableName = "";
	$scope.userName = userName;
	$scope.users = [];
	$scope.chatMessages = [];
	$scope.playerReady = false;

	$scope.updateReadyState = function() {
		var data = {
			tableNum: tableNum,
			userName: userName,
			isReady: $scope.playerReady
		}
		socket.emit('readyStatusChange', data, function(retData) {

		});
	};

	socket.on('connect', function() {
		console.log('connection made');
		var data = {
			tableNum: tableNum, 
			userName: userName, 
			userPic: userPic
		}
		socket.emit('joinTable', data, function(retData) {
			if (retData) {
				if (retData.error) {
					showError(retData.msg);
				}
			}
		});
	});

	socket.on('updatePlayerList', function(playerInfo) {
		$scope.users = playerInfo.playerList;
	});


	function showError(message) {
        // xx need to empty display
        var text;
        switch (message) {
            case ('tooMany'):
                text = "Room is full.";
                break;
            case ('noTable'):
                text = "Table does not exist. Create or select a table from the lobby.";
                break;
            case ('spyMasterTaken'):
                text = "Room already has a spymaster."
                break;
            case ('guesserTaken'):
                text = "Room already has a guesser."
                break;
            default:
                break;
        }
        // window.location.replace("/");
        var ask = window.confirm(text);
        if (ask) {
            document.location.href = "/lobby";
        } else {
            document.location.href = "/lobby";
        }
    }
}]);
