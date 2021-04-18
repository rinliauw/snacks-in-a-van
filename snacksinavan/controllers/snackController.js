const snacks = require('../models/snack')

//handle request to get all snacks
const getAllSnacks = (req, res) => {
    res.send(snacks)
}

// handle request to get one snack
const getOneSnack = (req, res) => {
    const snack = snacks.find(snack => snack.name === req.params.name)
    if (snack){
        res.send(snack) // send back the snack details
    } else {
        res.send([]) // just send back an empty list
    }
}

module.exports = {
    getAllSnacks,
    getOneSnack
}