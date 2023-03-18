const sqlite3 = require ('sqlite3').verbose()
const db = new sqlite3.Database('mydatabase.db')

db.serialize(function(){
    
    db.run(`DROP TABLE IF EXISTS Users`)

    db.run(`CREATE TABLE Users (
        userID TEXT PRIMARY KEY,
        role TEXT,
        name TEXT,
        password TEXT)`)

    db.run( `INSERT INTO Users (userID, role, name, password) VALUES
            ('id1', 'student', 'user1', 'password'),
            ('id2', 'student', 'user2', 'password2'),
            ('id3', 'teacher', 'user3', 'password3'),
            ('admin', 'admin', 'admin', 'admin' )`)
    })


module.exports = (db)
