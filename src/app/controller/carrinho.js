const express = require('express')
const router = express.Router()
const mysql = require('../../database/index').pool
const loginArtista = require('../middleware/loginArtista')
const loginCliente = require('../middleware/loginCliente')

router.get('/', loginCliente, (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT * FROM tblCompra WHERE idCliente = ?`,
            [req.session.userId],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send({ pedidos: results })
            }
        )
    })
})


router.post('adicionarAoCarrinho/:obraProntaId', loginCliente, (req, res, next) => {

    mysql.getConnection((error, conn) => {

        const idCliente = req.cliente.id_Cliente
        const idObraPronta = req.params.obraProntaId

        conn.query(
            `INSERT INTO tblCompra(idCliente,idObraPronta) VALUES(?,?)`,
            [idCliente,idObraPronta],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Obra adicionada ao carrinho com sucesso',
                    idCompra: results.insertId
                }

                return res.status(201).send(response)
            }
        )
    })
})


router.delete('deletarObradeCarrinho/:obraProntaId', loginCliente, (req, res, next) => {

    mysql.getConnection((error, conn) => {

        const idObraPronta = req.params.obraProntaId

        conn.query(
            `DELETE FROM tblCompra WHERE idObraPronta = ?`,
            [idObraPronta],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Obra deletada do carrinho com sucesso',
                }

                return res.status(201).send(response)
            }
        )
    })
})

module.exports = router