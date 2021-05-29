const { compareSync } = require("bcrypt");
const mongoose = require("mongoose");

// import van model
const Van = require("../models/van");
const utility = require("../routes/utility.js");

// get nearest van
const getNearestVan = async (customerlocation, limit = 5) => {
  try {
    console.log(customerlocation);
    const vans = await Van.find().lean();
    console.log(customerlocation.longitude);
    for (i = 0; i < vans.length; i++) {
      long = vans[i].location.longitude - customerlocation.longitude;
      latitude = vans[i].location.latitude - customerlocation.latitude;
      distance = Math.sqrt(long ** 2 + latitude ** 2);

      vans[i].distance = distance;
    }

    // sort by distance
    vans.sort((a, b) => {
      return a.distance - b.distance;
    });

    for (i = 0; i < vans.length; i++) {
      console.log(vans[i].distance);
      console.log(vans[i].location);
    }
    return vans.slice(0, limit);
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// handles request to get van login page
const getVanLogin = async (req, res) => {
  try {
    // Testing Purpose Only Remove this later :)
    console.log("getNearest");
    const customerLocation = { latitude: 100, longitude: 120 };
    const getResponse = await getNearestVan(customerLocation);
    console.log(getResponse);
    console.log("IsAuthenticated:");
    console.log(req.isAuthenticated());
    //If not logged in, display the login page
    if (!req.isAuthenticated()){
      res.render("van-login.hbs", {
        layout: "vendor-main.hbs",
        vanloggedin: req.isAuthenticated(),
        message: req.flash("loginMessage")[0],
      });
    // if already logged in, display the location page instead
    } else {
      res.header("Access-Control-Allow-Credentials", true);
      res.render("van-location", {
        layout: "vendor-main.hbs",
        vanloggedin: req.isAuthenticated(),
      });
    }
    
  } catch (e) {
    console.log(e);
  }
};

// handles request to get van location
const getVanLocation = async (req, res) => {
  try {
    // Testing
    res.header("Access-Control-Allow-Credentials", true);
    console.log("IsAuthenticated:");
    console.log(req.isAuthenticated());
    res.render("van-location", {
      layout: "vendor-main.hbs",
      vanloggedin: req.isAuthenticated(),
    });
  } catch (e) {
    console.log(e);
  }
};

// handle request to show a van detail
const showVanDetail = async (req, res) => {
  try {
    const oneVan = await Van.findOne({ name: req.params.name });
    if (oneVan === null) {
      // no van found in database
      res.status(404);
      return res.send("Van not found");
    }
    return res.render("van-location"); // van was found
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

//handle request to update van status to 'closed'
const closeVan = async (req, res) => {
  try {
    //find van and change status to closed
    const oneVan = await Van.findOneAndUpdate(
      { name: req.session.name },
      { $set: { ready_for_order: false } },
      { new: true }
    ).lean();
    if (oneVan === null) {
      // no van found in database
      res.status(404);
      return res.send("Van not found");
    }
    return res.render("van-close", {
      oneVan: oneVan,
      layout: "vendor-main.hbs",
      vanloggedin: req.isAuthenticated(),
    }); // van was found
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

//handle request to update van location and status to 'open'
const locateVan = async (req, res) => {
  console.log("locate van");
  // console.log(req.body.location);
  // console.log(req.session.name)
  // console.log(req.body.location_description)
  const new_loc_desc = req.body.location_description;
  const new_loc = req.body.location; //req.body is the json file
console.log(new_loc,  new_loc_desc, req.session.name)
  try {
    console.log("inside")
    //find van
    //update new location and change status to open
    const oneVan = await Van.findOneAndUpdate(
      { name: req.session.name },
      {
        $set: {
          location_description: new_loc_desc,
          location: JSON.parse(new_loc),
          ready_for_order: true,
        },
      },
      { new: true }
    ).lean();
    console.log(oneVan)
    if (oneVan === null) {
      // no van found in database
      res.status(404);
      return res.send("Van not found");
    }
    console.log(oneVan);
    return res.render("van-open", {
      oneVan: oneVan,
      layout: "vendor-main.hbs",
      vanloggedin: req.isAuthenticated(),
    }); // van was found
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

//handle request to get all vans
const getAllVans = async (req, res) => {
  try {
    const vans = await Van.find();
    return res.send(vans);
  } catch (e) {
    res.status(400);
    return res.send("Database query failed - vans could not be found");
  }
};

// show id details
const showIdDetail = async (req, res) => {
  try {
    const oneVan = await Van.findById(req.user.id);
    if (oneVan === null) {
      // no van found in database
      res.status(404);
      return res.send("Van not found");
    }
    return res.send(req.user.id); // van was found
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// export the functions
module.exports = {
  showVanDetail,
  closeVan,
  locateVan,
  getAllVans,
  getVanLogin,
  getVanLocation,
  showIdDetail,
  getNearestVan,
};
