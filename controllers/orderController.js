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
        const oneVan = await Van.findOne( {"name": req.session.name} )
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

// handles request to confirm order
const confirmOrder = async (req, res, current_van) => {
    try {
        //find the customer
        const oneCust = await Customer.findOne( {email: req.session.email} ).lean()

        const oneCart = oneCust.cart
        if(oneCart.length === 0) { // if cart is 0, render 'cart is empty page'
            const thisOrder = await customerOrder.find({customer: oneCust._id},{},{sort: '-time_ordered'}).populate({path:'items.snackId', model:'Snack'}).lean()
            return res.render('orderdetails', {"thisOrder": thisOrder, "loggedin": req.isAuthenticated()})
        }
        var isnotEmpty = 0; // check if cart is not empty
        for(var i=0; i<oneCart.length; i++) {
            if(oneCart[i].quantity != 0) {
                isnotEmpty = 1;
            }
        }
        if(!isnotEmpty){ // if cart is not empty, render 'order details' page
            const thisOrder = await customerOrder.find({customer: oneCust._id},{},{sort: '-time_ordered'}).populate({path:'items.snackId', model:'Snack'}).lean()
            return res.render('orderdetails', {"thisOrder": thisOrder, "loggedin": req.isAuthenticated()})
        }
        
        // start to make a new order
        const newOrder = new customerOrder({customer: oneCust._id})
        
        //make order outstanding
        newOrder.fulfilled = false; // set all to false
        newOrder.picked_up = false;
        newOrder.discount = false;
        newOrder.van = JSON.parse(current_van); // add current van from sessionstorage

        // save items from cart to newOrder
        for(var i=0; i<oneCart.length; i++) {
            var newItem = new startOrder({snackId: oneCart[i].snackId, quantity: oneCart[i].quantity})
            newOrder.items.push(newItem)
        }
        console.log("finish for loop")
        
        await newOrder.save() // save neworder
        console.log(newOrder)

        await Customer.updateOne({_id: oneCust._id}, { $set: { cart: [] }}, function(err, affected){
            console.log('affected: ', affected);
        });

        const thisOrder = await customerOrder.find({customer: oneCust._id},{},{sort: '-time_ordered'}).populate([{path:'items.snackId', model:'Snack'}, {path: 'van', model: 'Van'}]).lean()
        // renders a page that shows customer's new order
        return res.render('orderdetails', {"thisOrder": thisOrder, "loggedin": req.isAuthenticated()})
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

// handles request to view order history
const viewOrderHistory = async (req, res) => {
    console.log("view order history")
    try {
        //find the customer
        const oneCust = await Customer.findOne( {email: req.session.email} ).lean()
        
        const thisOrder = await customerOrder.find({customer: oneCust._id},{},{sort: '-time_ordered'}).populate([{path:'items.snackId', model:'Snack'}, {path: 'van', model: 'Van'}]).lean()
        
        return res.render('orderhistory', {"thisOrder": thisOrder, "loggedin": req.isAuthenticated()})
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

module.exports = {
    getOrderWithVanName, markOrderAsFulfilled, confirmOrder, viewOrderHistory
}