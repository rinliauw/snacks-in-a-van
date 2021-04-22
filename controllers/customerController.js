const mongoose = require("mongoose")

// import customer, snack, and addcart models
const Customer = mongoose.model("Customer")
const addCart = mongoose.model("addCart")
const Snack = mongoose.model("Snack")

// handle request to get list of customer
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
        return res.send(customers)
    } catch (e){
        res.status(400)
        return res.send("Database query failed - users could not be found")
    }
}

// handle request to get one customer
const getOneCustomer = async(req, res) => {
    try{
        const oneCust = await Customer.findById(req.params.id)
        if (oneCust){
            return res.send(oneCust)
        } else {
            res.status(404)
            return res.send("Customer is not found in database")
        }
    } catch (e){
        res.status(400)
        return res.send("Database query failed - this customer could not be found")
    }
}

//handle request to add a snack to a customer cart
const addItem = async (req, res) => {
    try {
        //find customer
        let thisCust = await Customer.findById(req.params.id)
        if (thisCust === null) {   // no customer found in database
            res.status(404)
            return res.send("Customer is not found")
        }
        //find the snack
        let desiredSnack = await Snack.findById(req.body.snackId)
        
        //add item to this customer's cart
        cartRecord = new addCart({snackId: desiredSnack._id})
        
        await thisCust.cart.push(cartRecord)
        // save customer's updated record to database
        await thisCust.save()
        // show the new customer record
        result = await Customer.findById(req.params.id)
        res.send(result)
        
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

module.exports = {
    getAllCustomers, getOneCustomer, addItem
}