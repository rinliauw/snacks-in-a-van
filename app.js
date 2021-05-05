const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

app.use(express.json())   
app.use(express.urlencoded({ extended: true })) // replaces body-parser
app.use(express.static('public'))	// define where static assets live

const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const flash=require('connect-flash-plus');

const expressValidator = require('express-validator');

// configure passport authenticator
const passport = require('passport');
require('./config/passport')(passport);

require('./models');
const bcrypt = require('bcrypt');

app.use(cors({
    credentials: true, // add Access-Control-Allow-Credentials to header
    origin: "http://localhost:3030" 
  }));
  
  
  // setup a session store signing the contents using the secret key
  app.use(session({ secret: process.env.PASSPORT_KEY,
    resave: true,
    saveUninitialized: true
   }));
  
  //middleware that's required for passport to operate
  app.use(passport.initialize());
  
  // middleware to store user object
  app.use(passport.session());
  
  // use flash to store messages
  app.use(flash());
  
  // we need to add the following line so that we can access the 
  // body of a POST request as  using JSON like syntax
  app.use(express.urlencoded({ extended: true })) 
  



// set the template engine to handlebars
app.engine('hbs', exphbs({
    defaultLayout:'main',
    extname:'hbs',
    helpers: require(__dirname + "/public/js/helpers.js").helpers
}))

// set the view engine
app.set('view engine', 'hbs')

// set up routers
const customerRouter = require('./routes/customerRouter');
const vendorRouter = require('./routes/vendorRouter');

// GET the home page
app.get('/', (req, res) => {
    res.send('<h1>Snacks in a Van</h1>')
})

// Handle the customer requests
app.use('/customer', customerRouter)

// Handle the vendor requests
app.use('/vendor', vendorRouter)

app.listen(process.env.PORT || 3030, () => {
     console.log('The Snacks in a Van app is running!')
})