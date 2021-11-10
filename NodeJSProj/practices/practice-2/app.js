const express = require('express')

const app = express();

app.use('/', (req, res, next) => {
    console.log('always runs')
    next()
})

app.use('/gio', (req, res, next) => {
    console.log('last middleware')
    res.send('<h2> gios page</h2>')
})

app.use('/', (req, res, next) => {
    console.log('first middleware')
    res.send('<h2> main page</h2>')
})

app.listen(5000)