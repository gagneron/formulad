module.exports = function(express, app, passport, config, tables) {
	var router = express.Router();

	router.get('/', function(req, res, next) {
		res.render('index', {title: 'Formula D'});
	});

	// middleware for checking if logged in when user navigates urls
	function securePages(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/'); // send them to login page if not logged in
		}
	}

	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect:'/lobby',
		failureRedirect: '/' // could use different route to show error message
	}));

	router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
	router.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect:'/lobby',
		failureRedirect: '/' // could use different route to show error message
	}));

	router.get('/logout', function(req, res, next) {
		req.logout();
		res.redirect('/');
	});

	router.get('/lobby', securePages, function(req, res, next) {
		res.render('lobby', {title: 'Formula D Lobby', user:req.user, host: config.host});
	});

	router.get('/table/:id', securePages, function(req, res, next) {
		var tableName = findTitle(req.params.id);
		var tableInfo = {
			tableName: tableName,
			tableNum: req.params.id
		};
		res.render('table', {user: req.user, tableInfo, host: config.host});
	});

	// START SET SESSION

	// router.get('/setcolor', function(req, res, next) {
	// 	req.session.favColor = "Red";
	// 	res.send('Setting favorite color');
	// });

	// // getting session info from a different route
	// router.get('/getcolor', function(req, res, next) {
	// 	res.send('favorite color: ' + (req.session.favColor === undefined ? "Not found": req.session.favColor));
	// });

	// END GET SESSION

	app.use('/', router);

	function findTitle(tableId) {
		tableId = parseInt(tableId);
		for (var i = 0; i < tables.length; i++) {
			if (tables[i].tableNum === tableId) {
				return tables[i].tableName;
			}
		}
		return null;
	}
};