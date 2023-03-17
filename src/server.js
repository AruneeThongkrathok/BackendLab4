const express = require ('express');
const app = express();
const db = require('./database.js')

let port = 3000;

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/admin', (req, res) => {

    db.all (`SELECT * FROM Users`, [], (err, rows) =>{
        if(err){
            throw err;
        }
        res.render('admin.ejs', {users: rows})
    })
});

app.listen(port, function(){
    console.log(`Server is listening on ${port}...`)
});
