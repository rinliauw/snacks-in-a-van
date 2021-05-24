const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const vanSchema = new mongoose.Schema({ 
    name: {type:String, required:true, unique:true},
    location: {type:Object},
    location_description: {type:String},
    ready_for_order: {type:Boolean},
    password: {type: String},
    account_type: {type: String}
})

vanSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const Van = mongoose.model("Van", vanSchema) 

module.exports = {Van}