const express = require('express');
const app = express();

require('./models');

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