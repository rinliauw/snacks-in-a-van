const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

app.use(express.json())   // replaces body-parser
app.use(express.urlencoded({ extended: true })) // replaces body-parser
app.use(express.static('public'))	// define where static assets live

require('./models');

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
    res.send('<h1>Snacks in a Van<h1>')
})

// Handle the customer requests
app.use('/customer', customerRouter)

// Handle the vendor requests
app.use('/vendor', vendorRouter)

app.listen(process.env.PORT || 3030, () => {
     console.log('The Snacks in a Van app is running!')
})