var register = function(Handlebars) {

  var helpers = { 
    multiply: function (num1, num2) {
      return num1*num2
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
  