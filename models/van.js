const mongoose = require("mongoose")
const vanSchema = new mongoose.Schema({ 
    name: {type:String, required:true, unique:true},
    location: {type:String},
    location_description: {type:String}
})
const Van = mongoose.model("Van", vanSchema) 
module.exports = Van