const mysql = require('mysql');

    const connection = mysql.createPool({
      host     : 'localhost',
      port     : 3306,
      user     : 'root',
      password : 'bcd12345',
      database : 'dbStArt'
    })

exports.pool = connection