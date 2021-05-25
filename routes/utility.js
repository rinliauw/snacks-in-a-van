// Code taken from foodbuddy app, provided by INFO30005 Faculty 2021

// middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  // if not logged in, redirect to login form
  res.redirect("/customer/getLoginPage");
}

// export the function so that we can use
// in other parts of our all
module.exports = {
  isLoggedIn,
};
