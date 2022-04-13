const express = require('express')
const router = express.Router()
const mysql = require('../../database/index').pool
const loginArtista = require('../middleware/loginArtista')
const loginCliente = require('../middleware/loginCliente')


router.post('fazerNegociacao/:propostaId', loginCliente, (req, res, next) => {

    const {
        idFormaPgto
    } = req.body


    const data_hora = Date.now()
    const idProposta = req.params.propostaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT preco, idPedidoPersonalizado FROM tblProposta WHERE idProposta = ?`,
            [idProposta],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) } 

                const valor = results[0].preco
                const idPedidoPersonalizado = results[0].idPedidoPersonalizado

                conn.query(
                    `INSERT INTO tblPagamento(valor,data_hora,idProposta,idFormaPgto) VALUES(?,?,?,?)`,
                    [valor, data_hora, idProposta, idFormaPgto],
                    (error, results, fields) => {
                        conn.release()

                        if (error) { return res.status(500).send({ error: error }) } 

                        conn.query(
                            `UPDATE tblProposta SET status = 'Aceita' WHERE idProposta = ?`,
                                [idProposta],
                
                            (error, results, fields) => {
                                conn.release()
                
                                if (error) { return res.status(500).send({ error: error }) } 

                                conn.query(
                                    `DELETE FROM tblProposta WHERE idPedidoPersonalizado = ?`,
                                    [idPedidoPersonalizado],

                                    (error, results, fields) => {
                                        conn.release()
                
                                        if (error) { return res.status(500).send({ error: error }) } 

                                        const response = {
                                            mensagem: 'Pagamento realizado com sucesso',
                                        }
                    
                                        res.status(201).send(response)

                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    })
})


router.post('cancelarNegociacaoCliente/:propostaId', loginCliente, (req, res, next) => {

    const idProposta = req.params.propostaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT valor FROM tblProposta WHERE idProposta = ?`,
            [idProposta],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) } 

                const valor = results[0].valor
                const reembolso = valor / 2

                conn.query(
                    `UPDATE tblPagamento SET valor = ? WHERE idProposta = ?`,
                    [reembolso,idProposta],
        
                    (error, results, fields) => {
                        conn.release()
        
                        if (error) { return res.status(500).send({ error: error }) } 
        
                        const response = {
                            mensagem: 'Negociação cancelada com sucesso',
                        }
            
                        res.status(201).send(response)
        
                    }
                )
            }
        )    
    })

})


router.post('cancelarNegociacaoArtista', loginArtista, (req, res, next) => {

    const idProposta = req.params.propostaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM tblPagamento WHERE idProposta = ?`,
            [idProposta],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Negociação cancelada com sucesso',
                }
    
                res.status(201).send(response)

            }
        )
    })
})

module.exports = router