const express = require('express')

// add the router
const customerRouter = express.Router()

// require the snackc otnroller
const customerController = require('../controllers/snackController.js')

// handle the GET request to get all snacks
customerRouter.get('/snacks', customerController.getAllSnacks)

//handle the GET request to get the details of one snack
customerRouter.get('/snacks/:name', customerController.getOneSnack)

// export the router
module.exports =customerRouter