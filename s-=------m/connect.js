const mysql = require( 'mysql')
 const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:"social"
  })
db.connect(function(err) {  
    if (err) throw err;  
    console.log("Connected!");  
  });  
  
  module.exports ={
    db
  }