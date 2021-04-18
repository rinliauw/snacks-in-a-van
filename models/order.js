module.exports = [
    {
        "number":"1",
        "customer_name":"John",
        "items": ["Capuccino", "Latte"],
        "time_ordered":"00:08:00 1/1/21",
        "fulfilled":false,
        "van_name":"Van_1"
    },
    {
        "number":"2",
        "customer_name":"Jane",
        "items": ["Capuccino", "Long black"],
        "time_ordered":"00:08:01 1/1/21",
        "fulfilled":true,
        "van_name":"Van_2"
    }, 
    {
        "number":"3",
        "customer_name":"Molly",
        "items": ["Long black"],
        "time_ordered":"00:08:02 1/1/21",
        "fulfilled":true,
        "van_name":"Van_1"
    }
]
const mongoose = require("mongoose")
const { timeStamp } = require("node:console")
const orderSchema = new mongoose.Schema({ 
    order_id: {type:int, required:true, unique:true},
    customer_name: {type:String, required:true},
    items: {type:[snackSchema], required:true},
    time_ordered: {type:Date, default:Date.now},
    fulfilled: {type:Boolean, required:true},
    picked_up: {type:Boolean, required:true},
    van_name: {type: mongoose.Schema.Types.ObjectId, ref: "Van"}
})
const Order = mongoose.model("Snack", orderSchema) 
module.exports = Order