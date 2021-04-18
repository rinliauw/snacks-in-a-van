const express = require('express')

// add the router
const vendorRouter = express.Router()

// require the snack otnroller
const orderController = require('../controllers/orderController.js')

// handle the GET request to get all orders with this van 
vendorRouter.get('/:van_name', orderController.getOrderWithVanName)

// export the router
module.exports = vendorRouter