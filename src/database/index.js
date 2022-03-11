const mysql = require('mysql2');

    const pool = mysql.createPool({
      user     : "root",
      password : "bcd12345",
      database : "dbStArt",
      host     : "localhost",
      port     : 3306
    })

// const conn = mysql.createConnection({
//       host: process.env.MYSQL_HOST,
//       user: process.env.MYSQL_USER,
//       database: process.env.MYSQL_DATABASE
//     });

exports.pool = pool