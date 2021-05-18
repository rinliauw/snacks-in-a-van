// Code taken from foodbuddy app, provided by INFO30005 Faculty 2021


// used to create our local strategy for authenticating
// using username and password
const LocalStrategy = require('passport-local').Strategy;

// our user model
const {Customer} = require('../models/snack');
const {Van} = require('../models/van');

module.exports = function(passport) {

    // these two functions are used by passport to store information
    // in and retrieve data from sessions. We are using user's object id
    passport.serializeUser(function(user, done) {
        done(null, {'id': user._id, 'type': user.account_type});
    });

    passport.deserializeUser(function(user, done) {
        //console.log(user.type, 'user')
        //console.log(user.id, 'user') debug
        if (user.type === 'vendor') {
        Van.findById(user.id, function(err, user) {
            done(err, user);
        });
        } else {
        Customer.findById(user.id, function(err, user) {
            done(err, user);
        });
        }
    });

    // strategy to login
    // this method only takes in username and password, and the field names
    // should match of those in the login form
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email', 
            passwordField : 'password',
            passReqToCallback : true}, // pass the req as the first arg to the callback for verification 
        function(req, email, password, done) {
            
            // you can read more about the nextTick() function here: 
            // https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
            // we are using it because without it the Customer.findOne does not work,
            // so it's part of the 'syntax'
            process.nextTick(function() {
                // see if the user with the email exists
                Customer.findOne({ 'email' :  email }, function(err, user) {
                    // if there are errors, user is not found or password
                    // does match, send back errors
                    if (err){
                        console.log(err);
                        return done(err);
                    }if (!user){
                        console.log("no user found");
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
                    if (!user.validPassword(password)){
                        console.log("found user but invalid password")
                        console.log(password)
                        console.log(user.password)
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
                        req.session.email = email; // for demonstration of using express-session
                        // done() is used by the strategy to set the authentication status with
                        // details of the user who was authenticated
                        return done(null, user, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));

    // for signup
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true }, // pass the req as the first arg to the callback for verification 
            
         function(req, email, password, done) {             
            process.nextTick( function() {
                Customer.findOne({'email': email}, function(err, existingCustomer) {
                    // search a user by the username (email in our case)
                    // if user is not found or exists, exit with false indicating
                    // authentication failure
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (existingCustomer) {
                        console.log("existing");
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    else {
                        // otherwise
                        // create a new user
                        var newCustomer = new Customer();
                        newCustomer.email = email;
                        newCustomer.password = newCustomer.generateHash(password);
                        newCustomer.nameFamily = req.body.nameFamily;
                        newCustomer.nameGiven = req.body.nameGiven;
                        newCustomer.favourites = [];
                        newCustomer.accoun_type = 'customer';

                        // and save the user
                        newCustomer.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newCustomer);
                        });

                        // put the user's email in the session so that it can now be used for all
                        // communications between the client (browser) and the FoodBuddy app
                        req.session.email=email;
                    }
                });
            });
        }));
}
