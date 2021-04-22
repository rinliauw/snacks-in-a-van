const mongoose = require("mongoose")

const Order = mongoose.model("Order")
const Van = mongoose.model("Van")

// handle request to get all outstanding orders (not fulfilled) with a van name
// show from the most recent
const getOrderWithVanName = async (req, res) => {
    try {
        //find van
        const oneVan = await Van.findOne( {"name": req.params.name} )
        //find all its outstanding orders
        const vanOrders = await Order.find({ van:oneVan._id, fulfilled:false },{},{sort: '-time_ordered'})
        
        res.send(vanOrders);
        
    } catch (e) {
        res.status(400)
        return res.send("Database query failed - an error occurred")
    }
}

// handle request to mark an order as fulfilled
const markOrderAsFulfilled = async (req, res) => {  
    try {
        //find van
        const oneVan = await Van.findOne( {"name": req.params.name} )
        console.log(oneVan)
        //find order and mark order as fulfilled
        const thisOrder = await Order.findOneAndUpdate( 
            {order_id: req.params.order_id, van:oneVan._id},
            {"$set":{fulfilled:true}},
            {new: true}
            )
        return res.send(thisOrder)  // van was found
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

module.exports = {
    getOrderWithVanName, markOrderAsFulfilled
}