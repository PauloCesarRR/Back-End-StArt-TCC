const express = require('express')
const router = express.Router()
const mysql = require('../../database/mysql').pool
const loginCliente = require('../middleware/loginCliente')

router.get('/', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT tblObraPronta.imagem1obrigatoria, tblObraPronta.nomeObra, tblObraPronta.preco, 
             tblObraPronta.desconto, tblObraPronta.quantidade, tblArtista.nomeArtistico as nomeArtista, 
             tblObraPronta.tecnica, tblCategoria.nomeCategoria FROM tblObraPronta, tblCategoria, tblArtista, tblObraFavorita
             WHERE tblObraPronta.idCategoria = tblCategoria.idCategoria AND 
             tblObraPronta.idArtista = tblArtista.idArtista AND 
             tblObraFavorita.idObraPronta = tblObraPronta.idObraPronta AND tblObraFavorita.idCliente = ?`,
            [idCliente],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send({ pedidos: results })
            }
        )
    })
})


router.post('/favoritarObra', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente
    const idObraPronta = req.body.idObraPronta

    mysql.getConnection((error, conn) => {

        conn.query(
            `INSERT INTO tblObraFavorita(idCliente,idObraPronta) VALUES(?,?)`,
            [idCliente,idObraPronta],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Obra favoritada',
                    idObrasFavoritas: results.insertId
                }

                return res.status(201).send(response)
            }
        )
    })
})


router.delete('/desfavoritarObra/:obraProntaId', loginCliente, (req, res, next) => {

    mysql.getConnection((error, conn) => {

        const idObraPronta = req.params.obraProntaId

        conn.query(
            `DELETE FROM tblObraFavorita WHERE idObraPronta = ?`,
            [idObraPronta],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Obra desfavoritada com sucesso',
                }

                return res.status(201).send(response)
            }
        )
    })
})


module.exports = router