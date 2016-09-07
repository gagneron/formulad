myApp =  angular.module('myApp', [
	'btford.socket-io'

	]);
// myApp.config(['$routeProvider'])

myApp.factory('socket', ['socketFactory', function(socketFactory) {
	return socketFactory({
		ioSocket: io.connect('/lobby')
	});
}]);

myApp.controller('LobbyController', ['$scope', 'socket', function($scope, socket) {
	$scope.tables = [];
	$scope.newTableName = "";
	socket.on('connect', function() {
		console.log('connection made');
	});

	socket.on('tableUpdate', function(tables) {
		$scope.tables = JSON.parse(tables);
	});

	function createTable() {
		// var tableName = $('#newTableName').val();
		var tableName = $scope.newTableName;
		if (tableName.trim() !== "") {
			var tableNum = parseInt(Math.random() * 10000);
			socket.emit('newTable', {
				tableName: tableName,
				tableNum: tableNum
			});
			$scope.newTableName = "";
		}
	}

	$scope.newTableKeyDown = function($event) {
		if ($event.which === 13) {
			createTable();
		}
	};

	$scope.createTable = createTable;
}]);

myApp.controller('OtherController', ['$scope', 'socket', function($scope, socket) {
	$scope.tables = [];
	$scope.newTableName = "";
	socket.on('connect', function() {
		console.log('connection made');
	});

	socket.on('tableUpdate', function(tables) {
		$scope.tables = JSON.parse(tables);
	});

	$scope.createTable = function() {
		// var tableName = $('#newTableName').val();
		var tableName = $scope.newTableName;
		if (tableName.trim() !== "") {
			var tableNum = parseInt(Math.random() * 10000);
			socket.emit('newTable', {
				tableName: tableName,
				tableNum: tableNum
			});
			$scope.newTableName = "";
		}
	}
}]);