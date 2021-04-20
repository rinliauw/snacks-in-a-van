const mongoose = require("mongoose")

const Order = mongoose.model("Order")

// handle request to get all outstanding orders (not fulfilled) with a van name
// show from the most recent
const getOrderWithVanName = async (req, res) => {
    try {
        const vanOrders = await Order.find({ van_name:req.params.van_name })
        
        if (vanOrders){
            res.send(vanOrders)
        } else {
            res.status(404)
            return res.send("No outstanding orders for this van")
        }
    } catch (e) {
        res.status(400)
        return res.send("Database query failed - an error occurred")
    }
}


module.exports = {
    getOrderWithVanName
}