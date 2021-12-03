const express = require('express');

const app = express();

const feedRoutes = require('./routes/feed')

app.use(express.json()) // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // იგი შემოუშვებს კონკრეტულ ან ნებისმიერ (*) უცხო რექვესს
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE') // იგი ნებას დართავს უცხო რექვესტებს, რომ გამოიყენონ კონკრეტული მეთოდები
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // იგი დააწესებს ან მოთხოვს, სპეციალურ ჰედერებს რომ შეიცავდნენ რექვესტები, რათა პასუხი დაუბრუნოს. აქაც შესაძლოა *-ის გამოყენება
    next()
})

app.use('/feed', feedRoutes)


app.listen(8080, () => {
    console.log('Server connected on 8080 port!')
});