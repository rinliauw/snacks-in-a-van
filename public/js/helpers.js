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

      var seconds = Math.floor((diff / 1000) % 60);
      var minutes = Math.floor((diff / (60 * 1000)) % 60);
      var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      return hours + ":" + minutes + ":" + seconds;
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
    // for each helper defined above (we have only one, listfood)
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
