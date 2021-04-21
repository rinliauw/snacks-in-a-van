const mongoose = require("mongoose")

const snackSchema = new mongoose.Schema({ 
    name: {type:String, required:true, unique:true},
    photo: {type:String},
    price: {type:Number, required:true}
})

const Snack = mongoose.model("Snack", snackSchema) 

const addCartSchema = new mongoose.Schema({
    snackId: {type: mongoose.Schema.Types.ObjectId, ref: 'Snack'}
})

const addCart = mongoose.model("addCart", addCartSchema) 

const customerSchema = new mongoose.Schema({ 
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    nameGiven: {type:String},
    nameFamily: {type:String},
    cart: [addCartSchema]
})

const Customer = mongoose.model("Customer", customerSchema) 

module.exports = Snack, addCart, Customer