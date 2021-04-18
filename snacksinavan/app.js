const express = require('express');
const customerRouter = require('./routes/customerRouter');
const vendorRouter = require('./routes/vendorRouter');
const app = express();

// GET the home page
app.get('/', (req, res) => {
    res.send('<h1>Snacks in a Van</h1>')
})

// Handle the customer requests
app.use('/customer', customerRouter)

// Handle the vendor requests
app.use('/vendor', vendorRouter)


app.listen(3030, () => {
    console.log('The Snacks in a Van app is listening on port 3030!')
})