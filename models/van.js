const mongoose = require("mongoose")
const vanSchema = new mongoose.Schema({ 
    name: {type:String, required:true, unique:true},
    location: {type:Array},
    location_description: {type:String},
    ready_for_order: {type:Boolean},
    password: {type: String}
})


vanSchema.methods.validPassword = function(password) {
    if (password === this.password){
        return true;
    }
    return false;
    
};


const Van = mongoose.model("Van", vanSchema) 

module.exports = {Van}