// This contains all of the routes for customer related functions
const express = require('express')
const passport = require('passport');
require('../config/passport')(passport); // import passport

// add the router
const customerRouter = express.Router()

// express-validator, to validate user data in forms
const expressValidator = require('express-validator')

// require the snack controller
const snackController = require('../controllers/snackController.js')

// require the user controller
const customerController = require('../controllers/customerController.js')

// require the order controller
const orderController = require('../controllers/orderController.js')

//handle GET request for find nearest van
customerRouter.post('/nearest-van', customerController.getNearestforCustomer)

//handle the GET request to get the home page
customerRouter.get('/', (res, req) => customerController.getHomePage(res, req))
customerRouter.get('/getLoginPage', (res, req) => customerController.getLoginPage(res, req))
customerRouter.get('/getSignUpPage', (res, req) => customerController.getSignUpPage(res, req))
customerRouter.get('/profile', (res, req) => customerController.getProfilePage(res, req))
customerRouter.get('/edit-profile', (res, req) => customerController.getEditProfilePage(res, req))
// handle the GET request to get all snacks
customerRouter.get('/snacks', snackController.getAllSnacks)

//handle the GET request to get the details of one snack
customerRouter.get('/snacks/:name', snackController.getOneSnack)

//handle the GET request to get the customer's cart
customerRouter.get('/cart', customerController.getCustomerCart2)

//handle the GET request to get customer order details
// customerRouter.post('/order-details', orderController.confirmOrder)
customerRouter.post('/order-details', async function(req, res) {
    await orderController.confirmOrder(req,res,req.body.current_van);
});


//handle the GET request to get customer order history
customerRouter.get('/order-history', orderController.viewOrderHistory)

// POST login form -- authenticate user
customerRouter.post('/login', passport.authenticate('local-login', {
    successRedirect : '/customer', // redirect to the homepage
    failureRedirect : '/customer/getLoginPage', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
}));

// POST - user submits the signup form -- signup a new user
customerRouter.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/customer', // redirect to the homepage
    failureRedirect : '/customer/getSignUpPage/', // redirect to signup page
    failureFlash : true // allow flash messages
}));

// LOGOUT - for customer
customerRouter.post('/logout', function(req, res) {
    // save the favourites
    customerController.saveAfterLogOut(req,res,req.body.logoutitems, req.body.logoutqty)
    req.logout();
    req.flash('');
    res.redirect('/customer/');
});

// GET - show the signup form to the user
// http:localhost:5000/user/signup
customerRouter.get("/signup", (req, res) => {
    res.render('signup');
});

// POST - user submits the signup form -- signup a new user
// http:localhost:5000/user/signup
customerRouter.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/customer', // redirect to the homepage
    failureRedirect : '/customer/signup/', // redirect to signup page
    failureFlash : true // allow flash messages
}));

// SHOPPING CART
customerRouter.post('/cart', async function(req, res) {
    await customerController.saveCart(req,res,req.body.items, req.body.qty)
    res.redirect('/customer/cart');
});

//handle the GET request to get the home page
customerRouter.get('/', (res, req) => customerController.getStartPage(res, req))

//handle the GET request to get the details of one customer
customerRouter.get('/:id', customerController.getOneCustomer) 
customerRouter.post('/:id/order', customerController.addItem)

//handle the GET request to get the customer order
customerRouter.get('/:id/cart', customerController.getCustomerCart) 

customerRouter.post('/edit-profile', customerController.editProfile)
// export the router
module.exports = customerRouter