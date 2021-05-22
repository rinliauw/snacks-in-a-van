var register = function(Handlebars) {

  var helpers = { 
    multiply: function (num1, num2) {
      return num1*num2
    },

    van_helper: function (thisVan){
      var ret = "";

      for (var i = 0, j = thisVan.length; i < j; i++){
        ret = ret + "<p>" + thisVan[i].name + "<br>" + thisVan[i].location_description + " </p>" 
        + "<p><span id = van_lat_" + String(i) + '">' + thisVan[i].location.latitude +
        "</span>" + " " + "<span id = van_long_" + String(i) + '">' + thisVan[i].location.longitude +
        "</span></p>"
      }
      return ret;
    }
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
  