module.exports = function(passport, FacebookStrategy, GoogleStrategy, config, mongoose) {
	
	// var user = new mongoose.Schema({
	// 	profileID: String,
	// 	fullname: String,
	// 	profilePic: String
	// });
	var user = new mongoose.Schema({
		local: {
			username: String,
			password: String
		},
		facebook: {
			profileID: String,
			fullname: String,
			profilePic: String
		},
		google: {
			profileID: String,
			fullname: String,
			email: String
		}
	});

	var userModel = mongoose.model('user', user);

	passport.serializeUser(function(user, done) { // used to store a user's reference in the session
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) { // finds user's record in the DB and returns it
		userModel.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new FacebookStrategy({
		clientID: config.fb.appID,
		clientSecret: config.fb.appSecret,
		callbackURL: config.fb.callbackURL,
		profileFields: ['id', 'displayName', 'photos']
	}, function(accessToken, refreshToken, profile, done) {
		// call back function
		// check if the user exists in mongoDB db
		// if not, create one and return the profile
		// if the user exists, simply return the profile
		userModel.findOne({'profileID':profile.id}, function(err, result) {
			if (result) {
				done(null, result);
			} else {
				// create a new user in mongoLab account;
				var newUser = new userModel({
					profileID: profile.id,
					fullname: profile.displayName,
					profilePic: profile.photos[0].value || ""
				});

				newUser.save(function(err) {
					done(null, newUser);
				})
			}
		});
	}));

	passport.use(new GoogleStrategy({
		clientID: config.googleAuth.appID,
		clientSecret: config.googleAuth.appSecret,
		callbackURL: config.googleAuth.callbackURL,
		profileFields: ['id', 'displayName', 'photos']
	}, function(accessToken, refreshToken, profile, done) {
		// call back function
		// check if the user exists in mongoDB db
		// if not, create one and return the profile
		// if the user exists, simply return the profile
		userModel.findOne({'google.profileID':profile.id}, function(err, result) {
			if (result) {
				done(null, result);
			} else {
				// create a new user in mongoLab account;
				var newUser = new userModel({
					google: {
						profileID: profile.id,
						fullname: profile.displayName,
						email: profile.emails[0].value || ""
					}
					
				});

				newUser.save(function(err) {
					done(null, newUser);
				})
			}
		});
	}));
};