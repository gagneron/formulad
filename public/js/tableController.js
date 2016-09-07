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
	socket.on('connect', function() {
		console.log('connection made');
		var data = {
			tableNum: tableNum, 
			userName: userName, 
			userPic: userPic
		}
		socket.emit('joinTable', data);
	});

	socket.on('updateUserList', function(users) {
		$scope.users = users;
	});
}]);
