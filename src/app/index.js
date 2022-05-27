const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const clienteController = require('./controller/cliente')
const artistaController = require('./controller/artista')
const formaRecebimentoController = require('./controller/formaRecebimento')
const obraProntaController = require('./controller/obraPronta')
const propostaController = require('./controller/proposta')
const pedidosPersonalizadosController = require('./controller/pedidosPersonalizados')
const pesquisaController = require('./controller/pesquisa')
const negociacoesController = require('./controller/negociacoes')
const carrinhoController = require('./controller/carrinho.js')
const favoritarObrasController = require('./controller/favoritarObras')
const avaliacaoController = require('./controller/avaliacao')
const diversasController = require('./controller/diversas')
const chatController = require('./controller/chat')

app.use(cors())
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
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

app.use('/cliente', clienteController)
app.use('/artista', artistaController) 
app.use('/formaRecebimento', formaRecebimentoController)
app.use('/obraPronta', obraProntaController)
app.use('/proposta', propostaController)
app.use('/pedidosPersonalizados', pedidosPersonalizadosController)
app.use('/carrinho', carrinhoController)
app.use('/pesquisa', pesquisaController)
app.use('/favoritarObras', favoritarObrasController)
app.use('/negociacoes', negociacoesController)
app.use('/avaliacao', avaliacaoController)
app.use('/diversas', diversasController)
app.use('/chat', chatController)

module.exports = app