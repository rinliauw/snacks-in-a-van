// Code taken from foodbuddy app, provided by INFO30005 Faculty 2021
// used to create our local strategy for authenticating
// using username and password
const LocalStrategy = require('passport-local').Strategy;

// our user model
const {Van} = require('../models/van');

module.exports = function(passport) {

    // these two functions are used by passport to store information
    // in and retrieve data from sessions. We are using user's object id
    passport.serializeUser(function(userr, done) {
        done(null, userr._id);
    });

    passport.deserializeUser(function(_id, done) {
        Van.findById(_id, function(err, userr) {
            done(err, userr);
        });
    });

    // strategy to login
    // this method only takes in username and password, and the field names
    // should match of those in the login form
    passport.use('vendor-login', new LocalStrategy({
            usernameField : 'name', 
            passwordField : 'password',
            passReqToCallback : true}, // pass the req as the first arg to the callback for verification 
        function(req, name, password, done) {
            
            // you can read more about the nextTick() function here: 
            // https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
            // we are using it because without it the Customer.findOne does not work,
            // so it's part of the 'syntax'
            process.nextTick(function() {
                // see if the user with the email exists
                Van.findOne({ 'name' :  name }, function(err, userr) {
                    // if there are errors, user is not found or password
                    // does match, send back errors
                    if (err){
                        console.log(err);
                        return done(err);
                    }if (!userr){
                        console.log("no user found");
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
                    if (!userr.validPassword(password)){
                        console.log("found user but invalid password")
                        console.log(password)
                        console.log(userr.password)
                        // false in done() indicates to the strategy that authentication has
                        // failed
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // otherwise, we put the user's email in the session
                    else {
                        // in app.js, we have indicated that we will be using sessions
                        // the server uses the included modules to create and manage
                        // sessions. each client gets assigned a unique identifier and the
                        // server uses that identifier to identify different clients
                        // all this is handled by the session middleware that we are using 
                        req.session.name = name; // for demonstration of using express-session
                        
                        // done() is used by the strategy to set the authentication status with
                        // details of the user who was authenticated
                        return done(null, userr, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));
}
