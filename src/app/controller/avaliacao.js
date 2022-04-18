const express = require('express')
const router = express.Router()
const mysql = require('../../database/index').pool
const loginArtista = require('../middleware/loginArtista')
const loginCliente = require('../middleware/loginCliente')


router.post('/avaliarArtista', loginCliente, (req, res, next) => {

    mysql.getConnection((error, conn) => {
        
    })

})


module.exports = router