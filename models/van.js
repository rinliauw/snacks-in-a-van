const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const vanSchema = new mongoose.Schema({ 
    name: {type:String, required:true, unique:true},
    location: {type:Array},
    location_description: {type:String},
    ready_for_order: {type:Boolean},
    password: {type: String},
    account_type: {type: String}
})

// checks if password is valid
// testing : 
// user SisterCoffee
// password 123456

vanSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const Van = mongoose.model("Van", vanSchema) 

module.exports = {Van}