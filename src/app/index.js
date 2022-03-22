const express = require('express')
const app = express()
const morgan = require('morgan')
const clienteRoutes = require('./routes/cliente')
const artistaRoutes = require('./routes/artista')
const formaRecebimentoRoutes = require('./routes/formaRecebimento')

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*')
    res.header(
        'Acces-Control-Allow-Header', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (req.method === 'OPTIONS') {
        res.headers('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }
    next()
})

app.use('/cliente', clienteRoutes)
app.use('/artista', artistaRoutes) 
app.use('/formaRecebimento', formaRecebimentoRoutes)

app.use((req, res, next) => {
    const erro = new Error('Não encontrado')
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app