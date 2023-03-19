const express = require ('express')
const app = express()
const db = require('./database.js')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config()
const bcrypt = require('bcrypt')

let port = 3000

var currentKey = ''
var currentUsername = ''
var currentUserID = ''

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/', (req,res) => {
    res.redirect('identify')
})

// middleware
function authenticateToken(req, res, next) {

    if (currentKey == "") {
      res.redirect("/identify");
    } else {
      jwt.verify(currentKey, process.env.TOKEN, function (err, decoded) {
        if (err) {
          res.status(401).send("Unauthorized");
          console.log("401: Unauthorized");
        } else {
          currentUserID = decoded.userId
          console.log('at authenticateToken: ', currentUserID)
          next();
        }
      });
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
            const userId = row.userID
            const token = jwt.sign({userId}, process.env.TOKEN)
            currentKey = token
            currentUsername = username
            currentUserID = userId
            res.redirect('/granted')
            console.log('post /identify: ',userId)
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

    if (currentUserID === 'admin') {
      db.all(`SELECT * FROM Users`, function(err, rows) {
        if (err) {
            console.log("get /admin", currentUserID); 
            return console.log(err.message)
        }
        res.render('admin.ejs', { users: rows })
      })
    } else {
        res.redirect("/identify")
        console.log('get /admin', currentUserID)
    }

})

app.get('/student1', authenticateToken, (req, res) =>{
    
    const allowedRoles = ['admin', 'id1', 'id3']
    const userId = currentUserID
    if (allowedRoles.includes(userId)){
        db.all(`SELECT * FROM Users WHERE userID = ? AND name = ?`, [userId, currentUsername], function(err,rows){
            if (err) {
                return console.log(err.message)
            }
            res.render('student1.ejs', {users: rows[0]})
        })
    }else{
        console.log('get /student1',userId)
        res.redirect('/identify');
        console.log('/student1: unauthorized')
    }
})

app.get('/student2', (req, res) =>{

    const allowedRoles = ['admin', 'id2', 'id3']
    const userId = currentUserID
    if (allowedRoles.includes(userId)){
        db.all(`SELECT * FROM Users WHERE userID = ? AND name = ?`, [userId, currentUsername], function(err,rows){
            if (err) {
                return console.log(err.message)
            }
            res.render('student2.ejs', {users: rows[0]})
        })
    }else{
        console.log('get /student2',userId)
        res.redirect('/identify');
        console.log('/student2: unauthorized')
    }
} )

app.get('/teacher', (req, res) =>{

    const allowedRoles = ['admin', 'id3']
    const userId = currentUserID
    if (allowedRoles.includes(userId)){
        db.all(`SELECT * FROM Users WHERE userID = ? AND name = ?`, [userId, currentUsername], function(err,rows){
            if (err) {
                return console.log(err.message)
            }
            res.render('teacher.ejs', {users: rows[0]})
        })
    }else{
        console.log('get /teacher',userId)
        res.redirect('/identify');
        console.log('/teacher: unauthorized')
    }
})

app.get('/register', (req,res) =>{
    res.render('register.ejs')
})

app.post('/register', (req, res) =>{
    const {name, password, role} = req.body

    

})

app.listen(port, function(){

    console.log(`Server is listening on ${port}...`)
})
