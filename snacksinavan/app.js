const express = require('express');
const snackRouter = require('./routes/snackRouter');
const app = express();

// GET the home page
app.get('/', (req, res) => {
    res.send('<h1>Snacks in a Van</h1>')
})

// Handle the snack requests
app.use('/customer/snacks', snackRouter)


app.listen(3030, () => {
    console.log('The Snacks in a Van app is listening on port 3030!')
})