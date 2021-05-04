const express = require('express')

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

//handle the GET request to login a customer
customerRouter.get('/showLogin', (res, req) => customerController.showLogin(res, req));
customerRouter.post('/loginCustomer', (res, req) => customerController.loginCustomer(res, req));

//handle the GET request to get the home page
customerRouter.get('/', (res, req) => customerController.getHomePage(res, req))

//handle the GET request to get the details of one customer
customerRouter.get('/:id', customerController.getOneCustomer)

customerRouter.post('/:id/order', customerController.addItem)
// export the router
module.exports = customerRouter