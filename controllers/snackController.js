const mongoose = require("mongoose")

// import snack model
const Snack = mongoose.model("Snack")


//handle request to get all snacks
const getAllSnacks = async (req, res) => {
    try {
        const snacks = await Snack.find().lean()
        res.render('menu', {"snacks": snacks})
        // return res.send(snacks)
    } catch (e){
        res.status(400)
        return res.send("Database query failed - snacks could not be found")
    }
}

// handle request to get one snack
const getOneSnack = async(req, res) => {
    try{
        const desiredSnack = await Snack.findOne({"name":req.params.name}).lean()
        if (desiredSnack){
            return res.render('snackdetails', {"desiredSnack": desiredSnack})
        } else {
            res.status(404)
            return res.send("Snack not found in database")
        }
    } catch (e){
        res.status(400)
        return res.send("Database query failed - this snack could not be found")
    }
}

module.exports = {
    getAllSnacks,
    getOneSnack
}