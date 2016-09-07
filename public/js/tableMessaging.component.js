(function() {
	var app = angular.module('tableMessaging', []);

	app.component('tableMessaging', {
		templateUrl: '../js/tableMessaging.template.html',
		controller: ['socket', function(socket) {
		self = this;
		self.chatMessages = [];

		socket.on('incomingChatMessage', function(data) {
				console.log('incoming', data);
				self.chatMessages.push(data);
			});

			console.log('ya?', self);

			function sendChatMessage() {
				// var tableName = $('#newTableName').val();
				var newMessage = self.newMessage;
				if (newMessage.trim() !== "") {
					
					socket.emit('chatFeed', {
						message: newMessage,
						userName: userName,
						tableNum: tableNum
					});
					self.newMessage = "";
				}
			}

			self.chatBoxKeyDown = function($event) {
				if ($event.which === 13) {
					sendChatMessage();
				}
			};
	}]});

	// app.directive('tableMessaging', function() {
	// 	return {
	// 		restrict: 'E',
	// 		// replace: true,
	// 		// transclude: true,
	// 		templateUrl: "../js/tableMessaging.template.html",
	// 		controller: "tableMessagingController",
	// 		// scope: true,
	// 		link: function(scope, elem, attrs) {

	// 		}
	// 	}
	// });
})();
