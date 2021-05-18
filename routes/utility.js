// Code taken from foodbuddy app, provided by INFO30005 Faculty 2021

// middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    // if not logged in, redirect to login form
    res.redirect('/customer/getLoginPage');
}

// middleware to ensure user is logged in
function isLoggedIn2(req, res, next) {
    if (req.isAuthenticated())
        return next();
    // if not logged in, redirect to login form
    res.redirect('/vendor/');
}

function isAuthenticated2(req, res) {
    if (req.session.name)
        return true;
    // if not logged in, redirect to login form
    return false;
}

// export the function so that we can use
// in other parts of our all
module.exports = {
    isLoggedIn, isLoggedIn2, isAuthenticated2
}