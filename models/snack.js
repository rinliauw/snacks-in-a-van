const mongoose = require("mongoose")
const snackSchema = new mongoose.Schema({ 
    name: {type:String, required:true, unique:true},
    photo: {type:String},
    price: {type:float, required:true}
})
const Snack = mongoose.model("Snack", snackSchema) 
module.exports = Snack