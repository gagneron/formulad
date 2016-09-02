$(document).ready(function() {
			
	// var socket = io.connect(host + '/lobby');

	// socket.on('connect', function() {
	// 	console.log('connection made');
	// });

	// socket.on('tableUpdate', function(tables) {
	// 	tables = JSON.parse(tables);
	// 	var html = "";
	// 	for (var i = 0; i < tables.length; i++) {
	// 		html += '<li><a href="table/' + tables[i].tableNum + '">' +
	// 					tables[i].tableName + '</a></li>';
	// 	}
	// 	$('.tableList').html(html);
	// });

	// $('#createTable').click(function() {
	// 	var tableName = $('#newTableName').val();
	// 	if (tableName.trim() !== "") {
	// 		var tableNum = parseInt(Math.random() * 10000);
	// 		socket.emit('newTable', {
	// 			tableName: tableName,
	// 			tableNum: tableNum
	// 		});
	// 		$('#newTableName').val("");
	// 	}
	// });
});

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