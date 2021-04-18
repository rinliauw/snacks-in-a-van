const orders = require('../models/order')

// handle request to get all orders with a van name
const getOrderWithVanName = (req, res) => {
    const order = orders.find(order =>order.van_name === req.params.van_name)
    if (order){
        res.send(order)
    } else {
        res.send("Could not find any orders for this van") // send back an error message
    }
}


module.exports = {
    getOrderWithVanName
}