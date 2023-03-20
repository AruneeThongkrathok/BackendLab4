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
var currentHashedPassword = ''

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/', (req,res) => {
    res.redirect('identify')
})

// middleware
function authenticateToken(req, res, next) {

    if (currentKey == "") {
        console.log('no token found')
        res.redirect("/identify");
    } else {
      jwt.verify(currentKey, process.env.TOKEN, function (err, decoded) {
        if (err) {
          res.status(401).send("Unauthorized");
          console.log("at authentication: Token not verified ");
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

    db.get(`SELECT * FROM Users WHERE name = ?`, [username], function(err, row) {

        if (err) {
            res.status(500).send('Internal server error');
            console.log(err);
            return;
          }

        if (!row) {
            res.render('fail.ejs')
            console.log(`User with name '${username}' does not exist.`)
            return;
        }
        
        //run this code to test requirements for grade 3 and 4
        const userId = row.userID
        const token = jwt.sign({userId}, process.env.TOKEN)
        currentKey = token
        currentUsername = username
        currentUserID = userId
        currentHashedPassword = row.password
        res.redirect('/granted')
        console.log('post /identify: ',userId)
        
        //run this code to test requirements for grade 5
        /*bcrypt.compare(password, row.password, function(err, result){
            if (err){
                console.log(err)
                res.status(500).send('Internal server error')
            }else if (result){
                const userId = row.userID
                const token = jwt.sign({userId}, process.env.TOKEN)
                currentKey = token
                currentUsername = username
                currentUserID = userId
                currentHashedPassword = row.password
                res.redirect('/granted')
                console.log('post /identify: ',userId)
            }else{
                res.render('fail.ejs')
                console.log(`User with name '${username}' entered the wrong password.`);

            }
            
        })*/
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
    const {username, password, role} = req.body

    db.get('SELECT * From Users where name = ?', [username], function (err, row){
        if (err){
            console.log(err)
            res.status(500).send('User already exist')

        }else if (row){
            res.render('failRegistration.ejs')

        } else {

            bcrypt.hash(password, 10, function (err, hashedPassword){
                if(err){
                    console.log(err)
                    res.status(500).send('Internal Server Error')
                }else{
                    const userID = 'user' + Math.floor(Math.random() * 100)
                    db.run('INSERT INTO Users(userID, role, name, password) VALUES (?,?,?,?)', [userID, role ,username, hashedPassword], function(err){
                        if (err){
                            console.log(err)
                            res.status(500).send('Internal Server Error')
                        } else {
                            console.log(userID, username, hashedPassword, role )
                            currentHashedPassword = hashedPassword
                            res.redirect('/identify')
                        }
                    })
                }
            })
        }
    })
})

app.listen(port, function(){

    console.log(`Server is listening on ${port}...`)
})
