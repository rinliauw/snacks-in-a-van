const express = require('express')

// add the router
const vendorRouter = express.Router()

// require the snack controller
const orderController = require('../controllers/orderController.js')

// require the van controller
const vanController = require('../controllers/vanController.js')

// handle the GET request to get all outstanding orders with this van 
vendorRouter.get('/:van_name', orderController.getOustandingOrderWithVanName)

// handle the POST request to update van details
// update location, location detail, ready_for_order label
vendorRouter.post('/:name/update-van-details', vanController.updateVan)

// handle the GET request to view a van details
vendorRouter.get('/:name/update-van-details', vanController.showVanDetail)

// export the router
module.exports = vendorRouter