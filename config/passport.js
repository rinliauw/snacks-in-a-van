require('dotenv').config()    // for JWT password key

// used to create our local strategy for authenticating
// using username and password
const LocalStrategy = require('passport-local').Strategy;

// our user model
const {Customer} = require('../models/snack');

// the following is required IF you wanted to use passport-jwt
// JSON Web Tokens
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

module.exports = function(passport) {

    // these two functions are used by passport to store information
    // in and retrieve data from sessions. We are using user's object id
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
        Customer.findById(_id, function(err, user) {
            done(err, user);
        });
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

    // used to demonstrate JWT
    let opts = {};
    // extract token information
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    // key that was used to hash the token
    opts.secretOrKey = process.env.PASSPORT_KEY;

    // depending on what data you store in your token, setup a strategy
    // to verify that the token is valid....
    passport.use('jwt', new JwtStrategy(opts, (jwt_payload, done) => {

        // here I'm simply searching for a user with the email addr
        // that was added to the token
        Customer.findOne({'email':jwt_payload.body._id}, (err, user) => {

            if(err){
                return done(err, false);
            }

            if(user){
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

    //Create a passport middleware to handle user login
    passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    }, async (email, password, done) => {
        try {
            //Find the user associated with the email provided by the user
            Customer.findOne({ 'email' :  email }, function(err, user) {

                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, {message: 'No user found.'});

                if (!user.validPassword(password))
                    return done(null, false, {message: 'Oops! Wrong password.'});


                else {
                    return done(null, user, {message: 'Login successful'});
                }
            });
        } catch (error) {
            return done(error);
        }
    }));


};



