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


router.get('/:propostaId', loginArtista || loginCliente, (req, res, next) => {

    const id = req.params.propostaId

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


router.post('/fazerProposta/:pedidoPersonalizadoId', loginArtista, (req, res, next) => {

    const {
        descricao, preco, 
        prazoEntrega, status
    } = req.body
    
    const idArtista = req.artista.id_Artista
    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `INSERT INTO tblProposta(descricao, preco, prazoEntrega, status, idArtista, idPedidoPersonalizado) 
                VALUES(?,?,?,?,?,?)`,
                [descricao, preco, prazoEntrega, status, idArtista, idPedidoPersonalizado],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Proposta enviada com sucesso',
                    obraCadastrada: {
                        idProposta: results.insertId,
                        descricao: req.body.descricao,
                        preco: req.body.preco,
                        prazoEntrega: req.body.prazoEntrega,
                        status: req.body.status,
                        request: {
                            tipo: 'POST',
                            descricao: 'Faz propostaId',
                            url: 'http://localhost:3000/proposta/' + results.insertId
                        }
                    }
                }

                res.status(201).send({
                    obraCadastrada: response
                })

            }
        )
    })

})


router.patch('/atualizarProposta/:propostaId', loginArtista, (req, res, next) => {

    const {
        descricao, preco, 
        prazoEntrega, status,
        idPedidoPersonalizado
    } = req.body
    
    const idProposta  = req.params.propostaId


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE tblProposta SET descricao = ?, preco = ?, prazoEntrega = ?, status = ? WHERE idPedidoPersonalizado = ?`,
                [descricao, preco, prazoEntrega, status, idPedidoPersonalizado],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Proposta atualizada com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Faz propostaId',
                        url: 'http://localhost:3000/proposta/' + idProposta
                    }
                }

                res.status(201).send({
                    obraAtualizada: response
                })

            }
        )
    })

})


router.delete('/:propostaId', loginArtista || loginCliente, (req, res, next) => {

    const idProposta = req.params.propostaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `DELETE FROM tblProposta WHERE idProposta = ?` , [idProposta],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: "Proposta foi excluída com sucesso"
                }

                res.status(201).send(response)

            }
        )
    })

})


module.exports = router
