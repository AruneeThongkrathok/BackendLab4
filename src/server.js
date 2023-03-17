const express = require ('express')
const app = express()
const db = require('./database.js')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config()

let port = 3000

var currentKey = ''
var currentPassword = ''

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/', (req,res) => {
    res.redirect('identify')
})

app.post('/identify', (req, res) => {
    const username = req.body.password
    const token = jwt.sign(username, process.env.TOKEN)
    currentPassword = username
    res.redirect('/granted')
    console.log(token)

})

app.get('/identify', (req, res) => {
    res.render('login.ejs')
})

app.get('/granted', (req, res) => {
    res.render('start.ejs')
})

app.get('/admin', (req, res) => {

    db.all (`SELECT * FROM Users`, [], (err, rows) =>{
        if(err){
            throw err
        }
        res.render('admin.ejs', {users: rows})
    })
})

app.listen(port, function(){

    console.log(`Server is listening on ${port}...`)
})
