const mongoose = require("mongoose")

// import van model
const Van = mongoose.model("Van")
const utility = require('../routes/utility.js')

//handle request to get login homepage
const getVanLogin = async(req, res) => {
    try {
        res.render('van-login.hbs', {layout: 'vendor-main.hbs'});
    } catch (e){
        console.log(e);
    }
}

const getVanLocation = async(req, res) => {
    try {
        //console.log(req.session)
        //console.log(req.user)
        //console.log(req.isAuthenticated())
        res.header('Access-Control-Allow-Credentials', true);
        res.render('van-location', {layout: 'vendor-main.hbs', "vanloggedin": req.isAuthenticated()});
    } catch (e){
        console.log(e);
    }
}

// handle request to show a van detail
const showVanDetail = async (req, res) => {  
    try {
        const oneVan = await Van.findOne( {"name": req.params.name} )
        if (oneVan === null) {   // no van found in database
            res.status(404)
            return res.send("Van not found")
        }
        return res.render('van-location')  // van was found
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

//handle request to update van status to 'closed'
const closeVan = async (req, res) => {  
    try {
        //find van and change status to closed
        const oneVan = await Van.findOneAndUpdate( 
            {"name": req.session.name},
            {"$set":{ready_for_order:false}},
            {new: true}
            ).lean()
        if (oneVan === null) {   // no van found in database
            res.status(404)
            return res.send("Van not found")
        }
        return res.render('van-close', {"oneVan": oneVan, layout: 'vendor-main.hbs'})  // van was found
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

//handle request to update van location and status to 'open'
const locateVan = async (req, res) => {
    console.log(req.body.location)
    const new_loc_desc = req.body.location_description
    const new_loc = req.body.location
    
    try {
        //find van
        //update new location and change status to open
        const oneVan = await Van.findOneAndUpdate( 
            {"name": req.session.name},
            {"$set":{"location_description": new_loc_desc, "location": new_loc, "ready_for_order": true}},
            {new: true}
            ).lean()
        if (oneVan === null) {   // no van found in database
            res.status(404)
            return res.send("Van not found")
        }
        
        return res.render('van-open', {"oneVan": oneVan, layout: 'vendor-main.hbs'})  // van was found
        
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

//handle request to get all vans
const getAllVans = async (req, res) => {
    try {
        const vans = await Van.find()
        return res.send(vans)
    } catch (e){
        res.status(400)
        return res.send("Database query failed - vans could not be found")
    }
}

const showIdDetail = async (req, res) => {  
    try {
        const oneVan = await Van.findById(req.user.id)
        if (oneVan === null) {   // no van found in database
            res.status(404)
            return res.send("Van not found")
        }
        return res.send(req.user.id)  // van was found
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}


// export the functions
module.exports = {
    showVanDetail, closeVan, locateVan, getAllVans, getVanLogin, getVanLocation, showIdDetail
}