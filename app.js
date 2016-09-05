var express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session), // can store session on it's own
	mongoose = require('mongoose').connect(config.dbURL), // helps us interact with connectMongo and add fields such as username, fullname etc
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	tables = [];

app.set('views', path.join(__dirname, 'views'));
// first param is the variable we will use to direc to the views folder, which is in the 2nd param


app.engine('html', require('ejs').renderFile); // use ejs to pass data to view files
app.set('view engine', 'html'); // uses .html files for rendering rather than .ejs

app.use(express.static(path.join(__dirname, 'public'))); // sets up the root folder for static files
app.use(cookieParser()); // for sessions

var env = process.env.NODE_ENV || 'development'; // to change from dev to prod environment
// if wnat to change from dev to prod, go to the console and type in: set NODE_ENV=production
if (env === "development") {
	app.use(session({secret: config.sessionSecret, saveUninitialized: true, resave:true}));
} else { // env === "production"
	app.use(session({
		secret: config.sessionSecret, 
		store: new ConnectMongo({
			// url: config.dbURL, // used if there wasn't mongoose (with mongoose its redundant)
			mongooseConnection: mongoose.connections[0],
			stringify: true
		}),
		saveUninitialized: true, 
		resave:true
	}));
}

// below is for testing adding a user to mongo db
// 
// var userSchema = mongoose.Schema({
// 	username: String,
// 	password: String,
// 	fullname: String
// });

// var Person = mongoose.model('users', userSchema);

// var John = new Person({
// 	username: 'Johndoe',
// 	password: 'somepassword',
// 	fullname: 'John Doe'
// });

// John.save(function(err) {
// 	console.log('Done!');
// });
// 
// above is for testing adding a user to mongo db

app.use(passport.initialize());
app.use(passport.session());
require('./auth/passportAuth.js')(passport, FacebookStrategy, GoogleStrategy, config, mongoose); // invoke it

require('./routes/routes.js')(express, app, passport, config, tables); // invoke and pass in references

// app.listen(3000, function(){
// 	console.log('port 3000 listening');
// 	console.log('Mode: ' + env);
// });
app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, tables);
// require('./socket/tableSocket.js')(io, tables);
server.listen(app.get('port'), function() {
	console.log('on port: ' + app.get('port'));
});