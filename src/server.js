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
var currentRole = ''

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
          currentRole = decoded.role
          console.log('at authenticateToken: ',currentRole)
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
            const role = row.role
            const token = jwt.sign({role}, process.env.TOKEN)
            currentKey = token
            currentUsername = username
            currentRole = role
            res.redirect('/granted')
            console.log('post /identify: ',role)
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
            console.log("get /identify", decoded.role); 
            return console.log(err.message)
        }
        res.render('admin.ejs', { users: rows })
      })
    } else {
        res.redirect("/identify")
    }

})

app.get('/student1', authenticateToken, (req, res) =>{
    
    const allowedRoles = ['admin', 'teacher', 'student']
    const role = currentRole
    if (allowedRoles.includes(role)){
        db.all(`SELECT * FROM Users WHERE role = ? AND name = ?`, [role, currentUsername], function(err,rows){
            if (err) {
                return console.log(err.message)
            }
            res.render('student1.ejs', {users: rows[0]})
        })
    }else{
        console.log('get /student',role)
        res.redirect('/identify');
        console.log('/student: unauthorized')
    }
})

app.get('/student2', (req, res) =>{
    res.render('student2.ejs')
} )

app.get('/teacher', (req, res) =>{
    res.render('teacher.ejs')
})


app.listen(port, function(){

    console.log(`Server is listening on ${port}...`)
})
