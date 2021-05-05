const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const snackSchema = new mongoose.Schema({ 
    name: {type:String, required:true, unique:true},
    photo: {type:String},
    price: {type:Number, required:true}
})

const Snack = mongoose.model("Snack", snackSchema) 

const addCartSchema = new mongoose.Schema({
    snackId: {type: mongoose.Schema.Types.ObjectId, ref: 'Snack'},
    quantity: {type:Number}
})

const addCart = mongoose.model("addCart", addCartSchema) 

const customerSchema = new mongoose.Schema({ 
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    nameGiven: {type:String},
    nameFamily: {type:String},
    cart: [addCartSchema]
})

// method for generating a hash; used for password hashing
customerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
customerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const Customer = mongoose.model("Customer", customerSchema) 

module.exports = {Customer, Snack, addCart}