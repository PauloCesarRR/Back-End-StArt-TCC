const express = require('express')
const router = express.Router()
const mysql = require('../../database/mysql').pool
const loginArtista = require('../middleware/loginArtista')
const loginCliente = require('../middleware/loginCliente')

router.get('/', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT tblObraPronta.imagem1obrigatoria, tblObraPronta.nomeObra, tblObraPronta.preco, 
             tblObraPronta.desconto, tblObraPronta.quantidade, tblArtista.nomeArtistico as nomeArtista, 
             tblObraPronta.tecnica, tblCategoria.nomeCategoria FROM tblObraPronta, tblCategoria, tblArtista, tblCompra
             WHERE tblObraPronta.idCategoria = tblCategoria.idCategoria AND 
             tblObraPronta.idArtista = tblArtista.idArtista AND 
             tblCompra.idObraPronta = tblObraPronta.idObraPronta AND tblCompra.idCliente = ?`,
            [idCliente],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send({ pedidos: results })
            }
        )
    })
})


router.post('/adicionarAoCarrinho', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente
    const idObraPronta = req.body.idObraPronta

    mysql.getConnection((error, conn) => {

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


router.delete('/deletarObradeCarrinho/:obraProntaId', loginCliente, (req, res, next) => {

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