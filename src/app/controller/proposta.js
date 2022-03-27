const express = require('express')
const router = express.Router()
const mysql = require('../../database/index').pool
const loginArtista = require('../middleware/loginArtista')
const loginCliente = require('../middleware/loginCliente')

router.get('/', loginArtista || loginCliente, (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblProposta', (error, results, fields) => {
            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Não foi encontrada nenhuma proposta cadastrada"
                })
            }

            const response = {
                qtdPropostas: results.length,
                proposta: results.map(proposta => {
                    return {
                        idProposta: proposta.idProposta,
                        descricao: proposta.descricao,
                        preco: proposta.preco,
                        prazoEntrega: proposta.prazoEntrega,
                        status: proposta.status,
                        idArtista: proposta.idArtista,
                        idPedidoPersonalizado: proposta.idPedidoPersonalizado,
                        idPagamento: proposta.idPagamento,

                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todas as propostas',
                            url: 'http://localhost:3000/artista/' + proposta.idProposta
                        }
                    }
                })
            }

           return res.status(200).send({ propostas: response })

        })
    })
    
})

router.get('/:propostaId', loginArtista || loginCliente, (req, res, next) => {

    const id = req.params.artistaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblProposta WHERE idProposta = ?', [id],
        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Esta proposta não existe"
                })
            }

            const response = {
                proposta: results.map(proposta => {
                    return {
                        idProposta: proposta.idProposta,
                        descricao: proposta.descricao,
                        preco: proposta.preco,
                        prazoEntrega: proposta.prazoEntrega,
                        status: proposta.status,
                        idArtista: proposta.idArtista,
                        idPedidoPersonalizado: proposta.idPedidoPersonalizado,
                        idPagamento: proposta.idPagamento,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna as informações de Proposta'
                        }
                    }
                })
            }

            res.status(200).send(response)
        })
    })

})

router.get('/minhasPropostas', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblProposta WHERE idArtista = ?', [idArtista],
        (error, results, fields) => {
            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Não foi encontrada nenhuma proposta"
                })
            }

            const response = {
                qtdPropostas: results.length,
                proposta: results.map(proposta => {
                    return {
                        idProposta: proposta.idProposta,
                        descricao: proposta.descricao,
                        preco: proposta.preco,
                        prazoEntrega: proposta.prazoEntrega,
                        status: proposta.status,
                        idArtista: proposta.idArtista,
                        idPedidoPersonalizado: proposta.idPedidoPersonalizado,
                        idPagamento: proposta.idPagamento,

                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todas as propostas do artista logado',
                            url: 'http://localhost:3000/artista/' + proposta.idProposta
                        }
                    }
                })
            }

           return res.status(200).send({ propostas: response })

        })
    })

})

router.post('/Proposta', loginArtista, (req, res, next) => {

})

router.patch('/fazerProposta', loginArtista, (req, res, next) => {

})

router.delete('/:propostaId', loginArtista || loginCliente, (req, res, next) => {

})

