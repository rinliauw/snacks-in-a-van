const express = require('express')

// add the router
const vendorRouter = express.Router()

// require the snack controller
const orderController = require('../controllers/orderController.js')

// require the van controller
const vanController = require('../controllers/vanController.js')

// handle the GET request to get all outstanding orders with this van 
vendorRouter.get('/:name/outstanding-orders', orderController.getOrderWithVanName)

// handle the PUT request to mark an order from a van as fulfilled
vendorRouter.put('/:name/outstanding-orders/:order_id/fulfilled', orderController.markOrderAsFulfilled)

// handle the GET request to view a van details
vendorRouter.get('/:name/update-van-details', vanController.showVanDetail)

// handle the PUT request to update van status to close
vendorRouter.put('/:name/update-van-details/close', vanController.closeVan)

// handle the POST request to update van status to open and new location
vendorRouter.post('/:name/update-van-details/open', vanController.locateVan)
// export the router
module.exports = vendorRouter