const mongoose = require("mongoose");

// import customer, snack, and addcart models
const Customer = mongoose.model("Customer");
const addCart = mongoose.model("addCart");
const Snack = mongoose.model("Snack");

// require vanController module to get nearest van
const vanController = require("../controllers/vanController.js");

// get express-validator, to validate user data in forms
const expressValidator = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");

// update

// get top 5 nearest van and show them on the map
const getNearestforCustomer = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      // console.log('locate van')
      console.log(typeof req.body.location);
      customerlocation = JSON.parse(req.body.location);
      // console.log(await vanController.getNearestVan(customerlocation))
      const nearestVan = await vanController.getNearestVan(customerlocation);
      //res.send(nearestVan)
      console.log(nearestVan);
      return res.render("nearest-van.hbs", {
        nearestVan: nearestVan,
        loggedin: req.isAuthenticated(),
      });
    } else {
      return res.redirect("/customer/getLoginPage");
    }
  } catch (e) {
    console.log(e);
  }
};

//handle request to get customer homepage
const getHomePage = async (req, res) => {
  try {
    //console.log(req.user)
    res.render("homepage", { loggedin: req.isAuthenticated() });
  } catch (e) {
    console.log(e);
  }
};

//handle request to get login homepage
const getLoginPage = async (req, res) => {
  try {
    //console.log(req.flash('loginMessage')[0])
    res.render("login", {
      loggedin: req.isAuthenticated(),
      message: req.flash("loginMessage")[0],
    });
  } catch (e) {
    console.log(e);
  }
};

//handle request to get signup page
const getSignUpPage = async (req, res) => {
  try {
    res.render("signup", {
      loggedin: req.isAuthenticated(),
      message: req.flash("signupMessage")[0],
    });
  } catch (e) {
    console.log(e);
  }
};

// handle request to get list of customer
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    return res.send(customers);
  } catch (e) {
    res.status(400);
    return res.send("Database query failed - users could not be found");
  }
};


// handle request to get one customer
const getOneCustomer = async (req, res) => {
  try {
    const oneCust = await Customer.findById(req.params.id);
    if (oneCust) {
      return res.send(oneCust);
    } else {
      res.status(404);
      return res.send("Customer is not found in database");
    }
  } catch (e) {
    res.status(400);
    return res.send("Database query failed - this customer could not be found");
  }
};

// handle request to show current customer's cart
const getCustomerCart = async (req, res) => {
  try {
    let oneCust = await Customer.findOne({ email: req.session.email })
      .populate({ path: "cart.snackId", model: "Snack" })
      .lean();

    console.log(oneCust.cart);
    // calculate the cart's total price
    if (oneCust) {
      const cart = oneCust.cart;
      var total = 0;
      var totalEach = new Array(cart.length);
      for (var i = 0; i < cart.length; i++) {
        var currentItem = cart[i];
        totalEach[i] = currentItem.snackId.price * currentItem.quantity;
        total += currentItem.snackId.price * currentItem.quantity;
      }
      return res.render("cart", {
        cart,
        total,
        totalEach,
        loggedin: req.isAuthenticated(),
      });
    } else {
      res.status(404);
      return res.send("Customer is not found in database");
    }
  } catch (e) {
    res.status(400);
    return res.send("Database query failed - this customer could not be found");
  }
};

//handle request to add a snack to a customer cart
const addItem = async (req, res) => {
  try {
    //find customer
    let thisCust = await Customer.findById(req.params.id);
    if (thisCust === null) {
      // no customer found in database
      res.status(404);
      return res.send("Customer is not found");
    }
    //find the snack
    let desiredSnack = await Snack.findById(req.body.snackId);
    let desiredQuantity = req.body.quantity;
    console.log(desiredQuantity);
    //add item to this customer's cart
    cartRecord = new addCart({
      snackId: desiredSnack._id,
      quantity: desiredQuantity,
    });

    await thisCust.cart.push(cartRecord);
    // save customer's updated record to database
    await thisCust.save();
    // show the new customer record
    result = await Customer.findById(req.params.id);
    console.log(result);
    res.send(result);
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// handle request to save to Cart
const saveCart = async (req, res, items, qty) => {
  try {
    if (req.session.email && items.length > 0) {
      // find user in database
      let user = await Customer.findOne({ email: req.session.email });

      items = JSON.parse(items);
      qty = JSON.parse(qty);
      itemsArray = [];

      for (let i = 0; i < items.length; ++i) {
        let snackid = items[i].replace(/[\\]"/g, "");
        let snackqty = qty[i].replace(/[\\]"/g, "");
        var found = 0;
        for (let j = 0; j < user.cart.length; j++) {
          if (snackid === user.cart[j].snackId.toString()) {
            //overwrite the quantity if the same item is found in db
            user.cart[j].quantity = snackqty;
            found = 1;
            break;
          }
        }
        //no same item found
        if (!found) {
          user.cart.push({ snackId: snackid, quantity: snackqty });
          itemsArray.push({ snackId: snackid });
        }
      }
      // save user's current cart to db

      user.save();
    }
  } catch (err) {
    console.log(err);
  }
};

// handle request to save cart after logging out
const saveAfterLogOut = async (req, res, logoutitems, logoutqty) => {
  try {
    // get the user whose email is stored in the session -- user is logged in
    // and that we are saving at least one item
    if (req.session.email && logoutitems.length > 0) {
      // find user in database
      let user = await Customer.findOne({ email: req.session.email });

      logoutitems = JSON.parse(logoutitems);
      logoutqty = JSON.parse(logoutqty);
      itemsArray = [];

      for (let i = 0; i < logoutitems.length; ++i) {
        let snackid = logoutitems[i].replace(/[\\]"/g, "");
        let snackqty = logoutqty[i].replace(/[\\]"/g, "");
        var found = 0;
        for (let j = 0; j < user.cart.length; j++) {
          if (snackid === user.cart[j].snackId.toString()) {
            user.cart[j].quantity = snackqty;
            found = 1;
            break;
          }
        }

        if (!found) {
          user.cart.push({ snackId: snackid, quantity: snackqty });
          itemsArray.push({ snackId: snackid });
        }
      }
      // save user's current cart to db

      user.save();
    }
  } catch (err) {
    console.log(err);
  }
};

//get user's profile page
const getProfilePage = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      // find user in database
      let user = await Customer.findOne({ email: req.session.email });
      return res.render("profile", {
        email: user.email,
        loggedin: req.isAuthenticated(),
        givenname: user.nameGiven,
        familyname: user.nameFamily,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//get user's edit profile page
const getEditProfilePage = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      // find user in database
      let user = await Customer.findOne({ email: req.session.email });
      return res.render("editprofile", {
        loggedin: req.isAuthenticated(),
        givenname: user.nameGiven,
        familyname: user.nameFamily,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//update user's profile details  (fam name + given name)
const editProfile = async (req, res, next) => {
  try {
    var nameGiven = req.body.nameGiven;
    var nameFamily = req.body.nameFamily;

    //find the user in the database
    let user = await Customer.findOne({ email: req.session.email });

    user.nameGiven = nameGiven;
    user.nameFamily = nameFamily;
    
    //save the new values
    user.save(function (err) {
      if (err) {
        next(err);
      } else {
        console.log("edit profile successful")
        console.log(user)
        res.redirect("/customer/profile/");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//update user's password
const changePassword = async (req, res, next) => {
  try {
    var newpassword = req.body.newpassword;
    var confirmpassword = req.body.confirmpassword;

    //find the user in the database
    let user = await Customer.findOne({ email: req.session.email });
    
    if (newpassword !== confirmpassword) {
      //send error message if the new password and confirmed password is different
      return res.render("changepassword", {
        loggedin: req.isAuthenticated(),
        msg: "Password and Confirm Password do not match!",
      });
    }

    //password is empty, send error message
    if(!newpassword || !confirmpassword) {
      return res.render("changepassword", {
        loggedin: req.isAuthenticated(),
        msg: "Password and Confirm Password cannot be blank."
      });
    }
    else {
        console.log("password is in valid format");
        user.password = user.generateHash(confirmpassword);
    }
    
    //save the new values
    user.save(function (err) {
      if (err) {
        next(err);
      } else {
        console.log("change password successful")
        console.log(user)
        res.redirect("/customer/profile/");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//get user's edit profile page
const getChangePasswordPage = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      return res.render("changepassword", {
        loggedin: req.isAuthenticated(),
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllCustomers,
  getOneCustomer,
  getSignUpPage,
  getCustomerCart,
  addItem,
  getHomePage,
  getLoginPage,
  saveCart,
  saveAfterLogOut,
  getNearestforCustomer,
  getProfilePage,
  getEditProfilePage,
  editProfile,
  changePassword,
  getChangePasswordPage,
};
