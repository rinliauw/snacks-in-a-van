const mongoose = require("mongoose")

// import van model
const Van = mongoose.model("Van")

// handle request to show a van detail
const showVanDetail = async (req, res) => {  
    try {
        const oneVan = await Van.findOne( {"name": req.params.name} )
        if (oneVan === null) {   // no van found in database
            res.status(404)
            return res.send("Van not found")
        }
        return res.send(oneVan)  // van was found
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

// change a van (POST)
const updateVan = async (req, res) => {
  const new_van = req.body   // construct changed Van object from body of POST

  try {
    const van = await Van.findOne( {"name": req.body.name} )  // check that a van with this name exists
    if (!van) {    // if van is not already in database, return an error
      res.status(400)
      return res.send("Van is not found in database")
    }

    Object.assign(van, new_van)   // replace properties that are listed in the POST body
    let result = await van.save()    // save updated van to database
    return res.send(result)             // return saved van to sender

    } catch (e) {   // error detected
        res.status(400)
        return res.send("Database update failed")
    }
}

//handle request to update van status to 'closed'
const closeVan = async (req, res) => {  
    try {
        //find van and change status to closed
        const oneVan = await Van.findOneAndUpdate( 
            {"name": req.params.name},
            {"$set":{ready_for_order:false}},
            {new: true}
            )
        if (oneVan === null) {   // no van found in database
            res.status(404)
            return res.send("Van not found")
        }
        return res.send(oneVan)  // van was found
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

//handle request to update van location and status to 'open'
const locateVan = async (req, res) => {
    
    const new_loc_desc = req.body.location_description
    const new_loc = req.body.location
    
    try {
        //find van
        //update new location and change status to open
        const oneVan = await Van.findOneAndUpdate( 
            {"name": req.params.name},
            {"$set":{"location_description": new_loc_desc, "location": new_loc, "ready_for_order": true}},
            {new: true}
            )
        if (oneVan === null) {   // no van found in database
            res.status(404)
            return res.send("Van not found")
        }
        
        return res.send(oneVan)  // van was found
        
    } catch (e) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}
// export the functions
module.exports = {
    showVanDetail, updateVan, closeVan, locateVan
}