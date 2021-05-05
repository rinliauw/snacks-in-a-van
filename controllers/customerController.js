const mongoose = require("mongoose");

// import customer, snack, and addcart models
const Customer = mongoose.model("Customer");
const addCart = mongoose.model("addCart");
const Snack = mongoose.model("Snack");

// get express-validator, to validate user data in forms
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');

//handle request to get customer homepage
const getHomePage = async(req, res) => {
    try {
        res.render('homepage');
    } catch (e){
        console.log(e);
    }
}


//handle request to get login homepage
const getLoginPage = async(req, res) => {
    try {
        res.render('login');
    } catch (e){
        console.log(e);
    }
}

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

// handle request to show current customer's cart
const getCustomerCart = async(req, res) => {
    try{
        const oneCust = await Customer.findById(req.params.id).populate({path:'cart.snackId', model:'Snack'}).lean()
        if (oneCust){
            const cart = oneCust.cart
            //console.log(oneCust.cart.length)
            var total = 0;
            var totalEach = new Array(cart.length);
            for (var i = 0; i < cart.length; i++) {
                var currentItem = cart[i];
                totalEach[i] = currentItem.snackId.price*currentItem.quantity
                total+=(currentItem.snackId.price*currentItem.quantity)
            }
            
            return res.render('cart', {cart, total, totalEach})
        } else {
            res.status(404)
            return res.send("Customer is not found in database")
        }
    } catch (e){
        res.status(400)
        return res.send("Database query failed - this customer could not be found")
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
        let desiredQuantity = req.body.quantity
        console.log(desiredQuantity)
        //add item to this customer's cart
        cartRecord = new addCart({snackId: desiredSnack._id, quantity: desiredQuantity})
        
        await thisCust.cart.push(cartRecord)
        // save customer's updated record to database
        await thisCust.save()
        // show the new customer record
        result = await Customer.findById(req.params.id)
        console.log(result)
        res.send(result)
        
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

const saveCart =  async (req, res, cart) => { // get one food, and render it
	try {
		// get the user whose email is stored in the session -- user is logged in
		// and that we are saving at least one favourite food
		if(req.session.email && cart.length > 0){
			// find user in database	
			let customer = await Customer.findOne( {email: req.session.email} )
			
			// create a list of Favourites
			cart = JSON.parse(cart)
			cartArray = []
			for (let i = 0; i < cart.length; ++i) {                
				let snackid = cart[i].replace(/[\\]"/g, '');;
				snack = await Snack.findOne( {_id: snackid} ).lean()
				cartArray.push(snack);			
			}
			// save user's favourite foods to the database
			customer.cart = cartArray		
			customer.save()
		}
	} catch (err) {
		console.log(err)
	}
}

module.exports = {
    getAllCustomers, getOneCustomer, addItem, getHomePage, getCustomerCart, getLoginPage, saveCart
}
