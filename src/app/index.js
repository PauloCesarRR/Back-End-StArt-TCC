const express = require('express')
const app = express()
const morgan = require('morgan')

const clienteController = require('./controllers/clienteController')

app.use('/clientes', clienteController)


module.exports = app