// Code taken from foodbuddy app, provided by INFO30005 Faculty 2021
// passport for vendor app

// used to create our local strategy for authenticating using vendor name and password
const LocalStrategy = require('passport-local').Strategy;

// our Van model
const {Van} = require('../models/van');
module.exports = function(passport) {

    // strategy for vendor login
    passport.use('vendor-login', new LocalStrategy({
            usernameField : 'name', 
            passwordField : 'password',
            passReqToCallback : true}, // pass the req as the first arg to the callback for verification 
        function(req, name, password, done) {
            process.nextTick(function() {
                // see if the van with name exists
                Van.findOne({ 'name' :  name }, function(err, user) {
                    // if there are errors, user is not found or password
                    // does match, send back errors
                    if (err){
                        console.log(err);
                        return done(err);
                    }if (!user){ // if user is not found in database
                        console.log("no user found");
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
                    if (!user.validPassword(password)){ // if user is found but password is not valid
                        console.log("found user but invalid password")
                        console.log(password)
                        console.log(user.password)
                        // false in done() indicates to the strategy that authentication has
                        // failed
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // otherwise, authentication successfull, so we put the vendor's name in the session
                    else {
                        req.session.name = name; 
                        return done(null, user, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });
        }));
}
