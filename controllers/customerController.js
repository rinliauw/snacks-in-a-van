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

const signUpCustomer = async (req, res) => {
    // first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
	if (!validationErrors.isEmpty() ) {
		return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	}
    // if we get this far, there are no validation errors, so proceed to do the search ...
	
    try {
        // brcrypt code from npm documentation
        const hash_password = 0;;
        const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            hash_password = hash;
        }) 
        const customer = new Customer({
            email: req.body.email,
            password: hash_password,
            nameGiven: req.body.nameGiven,
            nameFamily: req.body.nameFamily
        })
    } catch (err){
        console.log(err);
    }
}

// handle request to login as a customer
const loginCustomer = async (req, res) => {
	// first, validate the user input
	const validationErrors = expressValidator.validationResult(req)
	if (!validationErrors.isEmpty() ) {
		return res.status(422).render('error', {errorCode: '422', message: 'Search works on alphabet characters only.'})
	}
	// if we get this far, there are no validation errors, so proceed to do the search ...
	var query = {}
	if (req.body.email !== '') {
		query["email"] = {$regex: new RegExp(req.body.email, 'i') }
	}
	// the query has been constructed - now execute against the database
	try {
		const customer = await Customer.find(query).lean()
        const hash_input_password = 0;
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            hash_input_password = hash;
        }) 
        bcrypt.compare(customer[password], hash_input_password, function(err, result){
            if (result == true){
                res.render('loginSuccess');
            } else {
                res.render('loginFailure');
            }
        });
		res.render('login', {"customer": customer})	
	} catch (err) {
		console.log(err)
	}
}
//show login page
const showLogin = (req, res) => { // show filter page - currently unused
	res.render('login')
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
    getAllCustomers, getOneCustomer, addItem, getHomePage, loginCustomer, showLogin
}