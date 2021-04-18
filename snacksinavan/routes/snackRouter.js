const express = require('express')

// add the router
const snackRouter = express.Router()

// require the snackc otnroller
const snackController = require('../controllers/snackController.js')

// handle the GET request to get all snacks
snackRouter.get('/', snackController.getAllSnacks)

//handle the GET request to get the details of one snack
snackRouter.get('/:name', snackController.getOneSnack)

// export the router
module.exports = snackRouter