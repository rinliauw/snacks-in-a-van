const mongoose = require("mongoose")

const Order = mongoose.model("Order")
const Van = mongoose.model("Van")
const Customer = mongoose.model("Customer")
const customerOrder = mongoose.model("customerOrder")
const startOrder = mongoose.model("startOrder")

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

const confirmOrder = async (req, res) => {
    console.log("confirmorder")
    try {
        //find the customer
        const oneCust = await Customer.findOne( {email: req.session.email} ).lean()
        console.log(oneCust)
        const oneCart = oneCust.cart
        if(oneCart.length === 0) {
            const thisOrder = await customerOrder.find({customer: oneCust._id},{},{sort: '-time_ordered'}).populate({path:'items.snackId', model:'Snack'}).lean()
            return res.render('orderdetails', {"thisOrder": thisOrder})
        }
        var isnotEmpty = 0;
        for(var i=0; i<oneCart.length; i++) {
            
            if(oneCart[i].quantity != 0) {
                isnotEmpty = 1;
            }
        }

        if(!isnotEmpty){
            const thisOrder = await customerOrder.find({customer: oneCust._id},{},{sort: '-time_ordered'}).populate({path:'items.snackId', model:'Snack'}).lean()
            return res.render('orderdetails', {"thisOrder": thisOrder})
        }
        
        const newOrder = new customerOrder({customer: oneCust._id})
        
        //make order outstanding
        newOrder.fulfilled = false;
        newOrder.picked_up = false;
        newOrder.discount = false;
        
        for(var i=0; i<oneCart.length; i++) {
            
            var newItem = new startOrder({snackId: oneCart[i].snackId, quantity: oneCart[i].quantity})
            
            newOrder.items.push(newItem)
        }
        console.log("finish for loop")
        
        await newOrder.save()
        console.log(newOrder)
        await Customer.updateOne({_id: oneCust._id}, { $set: { cart: [] }}, function(err, affected){
            console.log('affected: ', affected);
        });

        const thisOrder = await customerOrder.find({customer: oneCust._id},{},{sort: '-time_ordered'}).populate({path:'items.snackId', model:'Snack'}).lean()
        
        return res.render('orderdetails', {"thisOrder": thisOrder})
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

const viewOrderHistory = async (req, res) => {
    console.log("view order history")
    try {
        //find the customer
        const oneCust = await Customer.findOne( {email: req.session.email} ).lean()
        
        const thisOrder = await customerOrder.find({customer: oneCust._id},{},{sort: '-time_ordered'}).populate({path:'items.snackId', model:'Snack'}).lean()
        
        return res.render('orderhistory', {"thisOrder": thisOrder})
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}


module.exports = {
    getOrderWithVanName, markOrderAsFulfilled, confirmOrder, viewOrderHistory
}