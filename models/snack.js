const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
// Define the snack schema
const snackSchema = new mongoose.Schema({ 
    name: {type:String, required:true, unique:true},
    photo: {type:String},
    price: {type:Number, required:true},
    account_type: {type: String}
})

const Snack = mongoose.model("Snack", snackSchema) 

// Define the cart schema
const addCartSchema = new mongoose.Schema({
    snackId: {type: mongoose.Schema.Types.ObjectId, ref: 'Snack'},
    quantity: {type:Number}
})

const addCart = mongoose.model("addCart", addCartSchema) 

// define the customer schema
const customerSchema = new mongoose.Schema({ 
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    nameGiven: {type:String},
    nameFamily: {type:String},
    cart: [addCartSchema],
    account_type: {type: String}
})

// the following two functions are taken from foodbuddy app, provided by INFO30005 Faculty 2021
// method for generating a hash; used for password hashing
customerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
customerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// bcrypt middleware
customerSchema.pre('save', function customerSchemaPre(next) {
    const user = this;
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    console.log(user)
    next();
    
});

const Customer = mongoose.model("Customer", customerSchema)

module.exports = {Customer, Snack, addCart}