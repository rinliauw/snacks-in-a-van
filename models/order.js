const mongoose = require("mongoose");

// schema for items in order schema
const startOrderSchema = new mongoose.Schema({
  snackId: { type: mongoose.Schema.Types.ObjectId, ref: "Snack" },
  quantity: { type: Number },
});

const startOrder = mongoose.model("startOrder", startOrderSchema);

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  items: [startOrderSchema], //what is the datatype?
  time_ordered: { type: Date, default: Date.now },
  fulfilled: { type: Boolean, required: true },
  picked_up: { type: Boolean, required: true },
  discount: { type: Boolean, required: true }, //change
  van: { type: mongoose.Schema.Types.ObjectId, ref: "Van" },
});

const Order = mongoose.model("Order", orderSchema);

const customerOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  items: [startOrderSchema], //what is the datatype?
  time_ordered: { type: Date, default: Date.now },
  fulfilled: { type: Boolean, required: true },
  picked_up: { type: Boolean, required: true },
  discount: { type: Boolean, required: true }, //change
  van: { type: mongoose.Schema.Types.ObjectId, ref: "Van" },
});

const customerOrder = mongoose.model("customerOrder", customerOrderSchema);

module.exports = { Order, startOrder, customerOrder };
