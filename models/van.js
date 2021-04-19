const mongoose = require("mongoose")
const vanSchema = new mongoose.Schema({ 
    name: {type:String, required:true, unique:true},
    location: {type:[Number]},
    location_description: {type:String},
    ready_for_order: {type:Boolean}
})
const Van = mongoose.model("Van", vanSchema) 

module.exports = Van