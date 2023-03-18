const express = require ('express')
const app = express()
const db = require('./database.js')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config()

let port = 3000

var currentKey = ''
var currentUsername = ''

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/', (req,res) => {
    res.redirect('identify')
})

// middleware
function authenticateToken (req, res, next){

    if(currentKey == ""){
        res.redirect("/identify")

    }else if(jwt.verify(currentKey, process.env.TOKEN)){
        req.role = jwt.decode(currentKey)
        console.log(currentKey)
        next();
    }else{
        res.status(401).send('Unauthorized')
    }
}

//user verification
app.post('/identify', (req, res) => {

    const username = req.body.username
    const password = req.body.password

    db.get(`SELECT * FROM Users WHERE name = ? AND password = ?`, [username, password], function(err, row) {
        if (err) {
          console.log(err.message)
          res.status(500).send('Internal Server Error')
        } else if (!row) {
            res.render('fail.ejs')
        } else {
            const token = jwt.sign(username, process.env.TOKEN)
            currentKey = token
            currentUsername = username
            res.redirect('/granted')
            console.log(token)
        }
    })
})

app.get('/identify', (req, res) => {
    res.render('login.ejs')
})

app.get('/granted', authenticateToken, (req, res) => {
    res.render('start.ejs')
})

app.get('/admin', authenticateToken, (req, res) => {

    if (req.role === 'admin') {
      db.all(`SELECT * FROM Users`, function(err, rows) {
        if (err) {
          return console.log(err.message)
        }
        res.render('admin.ejs', { users: rows })
      })
    } else {
        res.redirect("/identify")
      
    }

})

app.listen(port, function(){

    console.log(`Server is listening on ${port}...`)
})
