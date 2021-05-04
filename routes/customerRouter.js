const express = require('express')

// add the router
const customerRouter = express.Router()

// require the snack controller
const snackController = require('../controllers/snackController.js')

// require the user controller
const customerController = require('../controllers/customerController.js')

//handle the GET request to get the home page
customerRouter.get('/', (res, req) => customerController.getHomePage(res, req))

// handle the GET request to get all snacks
customerRouter.get('/snacks', snackController.getAllSnacks)

//handle the GET request to get the details of one snack
customerRouter.get('/snacks/:name', snackController.getOneSnack)

//handle the GET request to get the details of one customer
customerRouter.get('/:id', customerController.getOneCustomer) // nomor 3

customerRouter.post('/:id/order', customerController.addItem)

// export the router
module.exports = customerRouter