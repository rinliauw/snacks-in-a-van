const express = require('express')
const passport = require('passport');
require('../config/passport')(passport);

// add the router
const customerRouter = express.Router()

// express-validator, to validate user data in forms
const expressValidator = require('express-validator')

// require the snack controller
const snackController = require('../controllers/snackController.js')

// require the user controller
const customerController = require('../controllers/customerController.js')

// handle the GET request to get all snacks
customerRouter.get('/snacks', snackController.getAllSnacks)

//handle the GET request to get the details of one snack
customerRouter.get('/snacks/:name', snackController.getOneSnack)

//handle the GET request to go to the customer login page
customerRouter.get('/showLogin', (res, req) => customerController.showLogin(res, req));

// POST login form -- authenticate user
customerRouter.post('/login', passport.authenticate('local-login', {
    successRedirect : '/customer', // redirect to the homepage
    failureRedirect : '/customer/showLogin', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
}));

// POST - user submits the signup form -- signup a new user
customerRouter.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the homepage
    failureRedirect : '/customer/signup/', // redirect to signup page
    failureFlash : true // allow flash messages
}));

// LOGOUT
customerRouter.post('/logout', function(req, res) {
    // save the favourites
    customerController.saveCart(req,res,req.body.cart)
    req.logout();
    req.flash('');
    res.redirect('/customer/');
});

//handle the GET request to get the home page
customerRouter.get('/', (res, req) => customerController.getHomePage(res, req))

customerRouter.post('/:id/order', customerController.addItem)
// export the router
module.exports = customerRouter