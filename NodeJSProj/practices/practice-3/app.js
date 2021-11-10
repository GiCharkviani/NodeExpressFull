const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})


app.listen(3536, ()=>{
    console.log('Listening...')
})