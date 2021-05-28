// This contains all of the routes for vendor related functions
const passport = require("passport");
require("../config/passportvan")(passport);
const express = require("express");

const utility = require("../routes/utility.js");

module.exports = function (io){
  const vendorRouter = express.Router();
  
  // require the snack controller
  const orderController = require("../controllers/orderController.js");
  // require the van controller
  const vanController = require("../controllers/vanController.js");
  vendorRouter.get("/orders/:id", orderController.getVanOrder);

  // handle the GET request to get all outstanding orders with this van
  // vendorRouter.get('/:name/outstanding-orders', orderController.getOrderWithVanName)

  // handle the GET request to get all outstanding orders with current logged in
  vendorRouter.get("/outstanding-orders", orderController.getOrderWithVanName(io));


  // handle the GET request to get all outstanding orders with current logged in
  vendorRouter.get("/pickedup-orders", orderController.getPickedupOrder);

  // handle the POST request to mark an order from a van as fulfilled
  vendorRouter.post("/orders/:order_id/fulfilled", orderController.markOrderAsFulfilled);

  // handle the POST request to mark an order from a van as picked up
  vendorRouter.post("/orders/:order_id/pickedup", orderController.markOrderAsPickedUp);

  // handle the POST request to mark an order from a van as discounted
  vendorRouter.post("/orders/:order_id/discounted", orderController.markOrderAsDiscounted);


  // handle the GET request to view a van details
  vendorRouter.get("/:name/update-van-details", vanController.showVanDetail);
  // /vendor/Sister Coffee/update-van-details

  // handle the PUT request to update van status to close
  vendorRouter.post("/update-van-details/close", vanController.closeVan);

  // handle the POST request to update van status to open and new location
  vendorRouter.post("/update-van-details/open", vanController.locateVan);

  //handle the GET request to all vans
  //vendorRouter.get('/', vanController.getAllVans)
  vendorRouter.get("/", vanController.getVanLogin);
  vendorRouter.post(
    "/login",
    passport.authenticate("vendor-login", {
      successRedirect: "/vendor/location", // redirect to set the location
      failureRedirect: "/vendor", // redirect back to the login page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // GET page for set up location
  vendorRouter.get("/location", vanController.getVanLocation);

  // LOGOUT - for logging out after user authentication
  vendorRouter.get("/logout", function (req, res) {
    // save the favourites
    req.logout();
    req.flash("");
    res.redirect("/vendor/");
  });
  return vendorRouter;
}