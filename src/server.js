const express = require ('express');
const app = express();

let port = 3000;

app.listen(port, function(){
    console.log(`Server is listening on ${port}...`)
})
