const express = require('express');
const route = express.Router()

const names = []

route.get('', (req, res) => {
    res.render('form', {
        title: 'Form',
    })
})

route.post('/add', (req, res) => {
    if(req.body.name.length > 1) {
        names.push(req.body.name)
        return res.redirect('/users')
    }
    res.send({error: 'fill input'})
})

route.get('/users', (req, res) => {
    res.render('users', {
        title: 'Users',
        userNames: names
    })
})

module.exports = route