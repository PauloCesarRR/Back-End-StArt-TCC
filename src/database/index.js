const mysql = require('mysql2');

    const pool = mysql.createPool({
      user     : "root",
      password : "12345678",
      database : "dbStArt",
      host     : "localhost",
      port     : 3306
    })

exports.pool = pool