const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Snacks in a Van</h1>')
})

app.listen(3030, () => {
    console.log('The Snacks in a Van app is listening on port 3030!')
})