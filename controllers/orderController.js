const mongoose = require("mongoose");

const Van = mongoose.model("Van");
const Customer = mongoose.model("Customer");
const customerOrder = mongoose.model("customerOrder");
const startOrder = mongoose.model("startOrder");

const getVanOrder= async (req, res) => {
  try{
    console.log("inside")
    const order = await customerOrder.findById(req.params.id)
    .populate([{path: 'van', model: 'Van'}, {path: 'customer', model: 'Customer'},
  {path: 'items.snackId', model: 'Snack'}]).lean();
    console.log(order)
    // create currtime attribute for each order with the current time
    let date_ob = Date();
    order.current_date = date_ob;
    
    //count total
    const items = order.items;
    var total = 0;
    var totalEach = new Array(items.length);
    for (var i = 0; i < items.length; i++) {
      var currentItem = items[i];
      totalEach[i] = currentItem.snackId.price * currentItem.quantity;
      total += currentItem.snackId.price * currentItem.quantity;
    }
    if (order) {
      return res.render('van-orderdetails', {'order': order, layout: 'vendor-main', 'total': total, 'vanloggedin': req.isAuthenticated()})
    } else {
      res.status(404);
      return res.send("Customer is not found in database");
    }
  }
  catch (e){
    res.status(400)
    return res.send("Database query failed - an error occured")
  }
}
// handle request to get all outstanding orders (not fulfilled) with a van name
// show from the most recent

const getOrderWithVanName = function(io){
  return async (req, res) => {
      try {
          //find van
          const oneVan = await Van.findOne( {"name": req.session.name} )
          //find all its outstanding orders
          const vanOrders = await customerOrder.find({ van:oneVan._id, fulfilled:false },{},{sort: 'time_ordered'}).populate({path: 'customer'}).lean()
          let date_ob = Date()
          for (var i=0; i < vanOrders.length; i++){
              vanOrders[i].current_date = date_ob
          }
          console.log;(vanOrders)
          res.render('van-orders', {"vanOrders": vanOrders, "oneVan": oneVan._id, layout: 'vendor-main', "vanloggedin": req.isAuthenticated()});
          
      } catch (e) {
          res.status(400)
          return res.send("Database query failed - an error occurred")
      }
  }
}



const getPickedupOrder = async (req, res) => {
  try {
    //find van
    const oneVan = await Van.findOne({ name: req.session.name });
    //find all its outstanding orders
    const vanOrders = await customerOrder
      .find(
        { van: oneVan._id, picked_up: true },
        {},
        { sort: "-time_ordered" }
      )
      .populate({ path: "customer" })
      .lean();
    let date_ob = Date();
    for (var i = 0; i < vanOrders.length; i++) {
      vanOrders[i].current_date = date_ob;
    }
    console.log;
    vanOrders;
    return res.render("van-pickedup-orders", {
      vanOrders: vanOrders,
      layout: "vendor-main",
      vanloggedin: req.isAuthenticated(),
    });
  } catch (e) {
    res.status(400);
    return res.send("Database query failed - an error occurred");
  }
};

// handle request to mark an order as fulfilled
const markOrderAsFulfilled = async (req, res) => {
  try {
    //find van
    const oneVan = await Van.findOne({ name: req.session.name });
    console.log(oneVan);
    //find all its outstanding orders
    const vanOrders = await customerOrder
      .find(
        { van: oneVan._id, picked_up: false },
        {},
        { sort: "-time_ordered" }
      )
      .populate({ path: "customer" })
      .lean();
    //find order and mark order as fulfilled
    const thisOrder = await customerOrder.findOneAndUpdate(
      { _id: req.params.order_id, van: oneVan._id },
      { $set: { fulfilled: true } },
      { new: true }).lean();
    return res.render("van-orders", {
      vanOrders: vanOrders,
      layout: "vendor-main",
      vanloggedin: req.isAuthenticated(),
    });
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// handle request to get an order discount
const markOrderAsDiscounted = async (req, res) => {
  try {
    //find van
    const oneVan = await Van.findOne({ name: req.session.name });
    console.log(oneVan);
    //find order and mark order as fulfilled
    const thisOrder = await customerOrder.findOneAndUpdate(
      { _id: req.params.order_id, van: oneVan._id },
      { $set: { discount: true } },
      { new: true }).lean();
    return res.render("van-orderdetails", {
      order: thisOrder,
      layout: "vendor-main",
      vanloggedin: req.isAuthenticated(),
    });
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};


// handle request to mark an order as picked up
const markOrderAsPickedUp = async (req, res) => {
  try {
    //find van
    const oneVan = await Van.findOne({ name: req.session.name });
    console.log(oneVan);
    //find order and mark order as fulfilled
    const thisOrder = await customerOrder.findOneAndUpdate(
      { _id: req.params.order_id, van: oneVan._id },
      { $set: { picked_up: true } },
      { new: true }).lean();
    //find all its outstanding orders
    const vanOrders = await customerOrder
      .find(
        { van: oneVan._id, picked_up: false },
        {},
        { sort: "-time_ordered" }
      )
      .populate({ path: "customer" })
      .lean();
    return res.render("van-orders", {
      vanOrders: vanOrders,
      layout: "vendor-main",
      vanloggedin: req.isAuthenticated(),
    }); // van was found
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// handles request to confirm order
const confirmOrder = async (req, res, current_van, io) => {
  try {
    //find the customer
    const oneCust = await Customer.findOne({ email: req.session.email }).lean();
    console.log(current_van);
    // if hasn't found a van, redirect to find the nearest van
    if (!Object.keys(current_van).length) {
      return res.redirect("/customer/");
    } else {
      // if has chosen a van, proceed to create an order
      // console.log(oneCust) for debugging purposes
      // console.log("confirmorder")
      // console.log(typeof(current_van))
      // console.log("after")

      const oneCart = oneCust.cart;
      if (oneCart.length === 0) {
        // if cart is 0, render 'cart is empty page'
        const thisOrder = await customerOrder
          .findOne({ customer: oneCust._id }, {}, { sort: "-time_ordered" })
          .populate([
            { path: "items.snackId", model: "Snack" },
            { path: "van", model: "Van" },
          ])
          .lean();
        //count total
        const items = thisOrder.items;
        var total = 0;
        var totalEach = new Array(items.length);
        for (var i = 0; i < items.length; i++) {
          var currentItem = items[i];
          totalEach[i] = currentItem.snackId.price * currentItem.quantity;
          total += currentItem.snackId.price * currentItem.quantity;
        }
        return res.render("orderdetails", {
          thisOrder: thisOrder,
          total: total,
          loggedin: req.isAuthenticated(),
        });
      }
      var isnotEmpty = 0; // check if cart is not empty
      for (var i = 0; i < oneCart.length; i++) {
        if (oneCart[i].quantity != 0) {
          isnotEmpty = 1;
        }
      }

      if (!isnotEmpty) {
        // if cart is not empty, render 'order details' page
        const thisOrder = await customerOrder
          .findOne({ customer: oneCust._id }, {}, { sort: "-time_ordered" })
          .populate([
            { path: "items.snackId", model: "Snack" },
            { path: "van", model: "Van" },
          ])
          .lean();
        //count total
        const items = thisOrder.items;
        var total = 0;
        var totalEach = new Array(items.length);
        for (var i = 0; i < items.length; i++) {
          var currentItem = items[i];
          totalEach[i] = currentItem.snackId.price * currentItem.quantity;
          total += currentItem.snackId.price * currentItem.quantity;
        }
        return res.render("orderdetails", {
          thisOrder: thisOrder,
          total: total,
          loggedin: req.isAuthenticated(),
        });
      }

      // make new order
      const newOrder = new customerOrder({ customer: oneCust._id });

      //make order outstanding
      newOrder.fulfilled = false;
      newOrder.picked_up = false;
      newOrder.discount = false;
      newOrder.van = JSON.parse(current_van); // add van details (JSON) from sessionstorage to the database
      const vanID = newOrder.van

      for (var i = 0; i < oneCart.length; i++) {
        var newItem = new startOrder({
          snackId: oneCart[i].snackId,
          quantity: oneCart[i].quantity,
        });

        newOrder.items.push(newItem);
      }
      console.log("finish for loop");

      await newOrder.save(); // update the new order to the database
      console.log(newOrder);

      await Customer.updateOne(
        { _id: oneCust._id },
        { $set: { cart: [] } },
        function (err, affected) {
          console.log("affected: ", affected);
        }
      );

      const thisOrder = await customerOrder
        .findOne({ customer: oneCust._id }, {}, { sort: "-time_ordered" })
        .populate([
          { path: "items.snackId", model: "Snack" },
          { path: "van", model: "Van" },
        ])
        .lean();

        // socket io emit 
        const SocketEventName = "new_order_van_" + vanID
        const isSuccess = io.emit(SocketEventName, thisOrder)
        console.log("Socket IO Emmiting on ", SocketEventName, " status:", isSuccess)

      return res.render("orderdetails", {
        thisOrder: thisOrder,
        total: total,
        loggedin: req.isAuthenticated(),
      });
    }
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// handles request to view order history
const viewOrderHistory = async (req, res) => {
  console.log("view order history");
  try {
    //find the customer
    const oneCust = await Customer.findOne({ email: req.session.email }).lean();

    const thisOrder = await customerOrder
      .find({ customer: oneCust._id }, {}, { sort: "-time_ordered" })
      .populate([
        { path: "items.snackId", model: "Snack" },
        { path: "van", model: "Van" },
      ])
      .lean();

    return res.render("orderhistory", {
      thisOrder: thisOrder,
      loggedin: req.isAuthenticated(),
    });
  } catch (e) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};



module.exports = {
  getVanOrder,
  getOrderWithVanName,
  markOrderAsFulfilled,
  confirmOrder,
  viewOrderHistory,
  getPickedupOrder,
  markOrderAsPickedUp,
  markOrderAsDiscounted
};
