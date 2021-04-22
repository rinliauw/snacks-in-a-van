const mongoose = require("mongoose")

const startOrderSchema = new mongoose.Schema({
    
})

const orderSchema = new mongoose.Schema({ 
    order_id: {type:Number, required:true, unique:true},
    customer: {type:String, required:true},
    items: [{type: mongoose.Schema.Types.ObjectId, ref: "Snack"}], //what is the datatype?
    time_ordered: {type:Date, default:Date.now},
    fulfilled: {type:Boolean, required:true},
    picked_up: {type:Boolean, required:true},
    discount: {type:Boolean, required:true}, //change
    van: {type: mongoose.Schema.Types.ObjectId, ref: "Van"}
})

const Order = mongoose.model("Order", orderSchema)
const startOrder = mongoose.model("startOrder", startOrderSchema)

module.exports = Order