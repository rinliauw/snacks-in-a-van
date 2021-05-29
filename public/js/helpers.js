const mongoose = require("mongoose");
const customerOrder = mongoose.model("customerOrder");

var register = function (Handlebars) {
  var helpers = {
    multiply: function (num1, num2) {
      return num1 * num2;
    },
    // stringify json object
    stringify: function (object) {
      return JSON.stringify(object);
    },
    // subtract between current time and time ordered
    subtract: function (time_ordered, current_time) {
      var diff = Math.abs(Date.parse(current_time) - Date.parse(time_ordered)); // in miliseconds
      // now we want to convert to hours
      var MILLI_15_MIN = 900000;
      time_rem = MILLI_15_MIN - diff;
      if (time_rem <= 0){
        return "0:0:0";
      }
      var seconds = Math.floor((time_rem / 1000) % 60);
      var minutes = Math.floor((time_rem / (60 * 1000)) % 60);
      var hours = Math.floor((time_rem / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      
      return hours + ":" + minutes + ":" + seconds;
    },
    //print to two decimal places
    two_dp: function (price){
      return price.toFixed(2);
    },
    // check if a discount should  be applied
    discount: function (time_rem){
      return ("0:0:0"==time_rem);
    },

    //update the discount value in the object stored in the database
    update_discount: function (id){
      const thisOrder = customerOrder.findOneAndUpdate(
        { _id: id},
        { $set: { discount: true } },
        { new: true }).lean();
    },
    
    json: function(obj) {
      return JSON.stringify(obj);
    },

    van_helper: function (thisVan) {
      var ret = "";

      for (var i = 0, j = thisVan.length; i < j; i++) {
        ret =
          ret +
          "<p>" +
          thisVan[i].name +
          "<br>" +
          thisVan[i].location_description +
          " </p>" +
          "<p><span class = van_lat_" +
          String(i) +
          '">' +
          thisVan[i].location.latitude +
          "</span>" +
          " " +
          "<span class = van_long_" +
          String(i) +
          '">' +
          thisVan[i].location.longitude +
          "</span></p>";
      }
      return ret;
    },
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    // register helpers
    // for each helper defined above 
    for (var prop in helpers) {
      // we register helper using the registerHelper method
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    // just return helpers object if we can't register helpers here
    return helpers;
  }
};

// export helpers to be used in our express app
module.exports.register = register;
module.exports.helpers = register(null);
