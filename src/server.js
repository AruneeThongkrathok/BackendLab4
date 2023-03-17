const express = require ('express');
const app = express();
const db = require('./database.js')

let port = 3000;

app.set('view engine', 'ejs')
app.set('views', __dirname + '/src/lab4')

app.get('/admin', (req, res) => {
    res.render('admin.ejs', {users: users})
})

app.listen(port, function(){
    console.log(`Server is listening on ${port}...`)
})
