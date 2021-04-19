const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({ 
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    nameGiven: {type:String},
    nameFamily: {type:String}
})
const Van = mongoose.model("User", userSchema) 

module.exports = User