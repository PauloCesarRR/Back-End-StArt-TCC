const express = require('express')
const router = express.Router()
const mysql = require('../../database/mysql').pool
const loginArtista = require('../middleware/loginArtista')
const loginCliente = require('../middleware/loginCliente')

router.get('/conversasDeCliente', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT tblChat.*, tblArtista.fotoPerfilArtista, tblArtista.nomeArtistico FROM tblChat, tblArtista WHERE tblChat.idCliente = ? AND tblArtista.idArtista = tblChat.idArtista`,
            [idCliente],

            (error, results, fields) => {
                conn.release()
                
                const response = {
                    qtdChat: results.length,
                    chat: results.map(chat => {
                        return {
                            idChat: chat.idChat,
                            idCliente: chat.idCliente,
                            idArtista: chat.idArtista,
                            imgArtista: chat.fotoPerfilArtista,
                            nomeArtista: chat.nomeArtistico,
                        }
                    })
                }

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send(response)
            }
        )
    })
})

router.get('/conversasDeArtista', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT tblChat.*, tblCliente.fotoPerfilCliente, tblCliente.nomeCompleto FROM tblChat, tblCliente WHERE tblChat.idArtista = ? AND tblCliente.idCliente = tblChat.idCliente`,
            [idArtista],

            (error, results, fields) => {
                conn.release()
                
                const response = {
                    qtdChat: results.length,
                    chat: results.map(chat => {
                        return {
                            idChat: chat.idChat,
                            idCliente: chat.idCliente,
                            idArtista: chat.idArtista,
                            imgCliente: chat.fotoPerfilCliente, 
                            nomeCliente: chat.nomeCompleto
                        }
                    })
                }

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send(response)
            }
        )
    })
})

router.get('/conversaCliente/:idChat', loginCliente, (req, res, next) => {

    const idChat = req.params.idChat

    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT * FROM tblChat WHERE idChat = ?`,
            [idChat],

            (error, results, fields) => {
                conn.release()
        
                const response = {
                    qtdChat: results.length,
                    chat: results.map(chat => {
                        return {
                            idChat: chat.idChat,
                            idCliente: chat.idCliente,
                            idArtista: chat.idArtista,
                        }
                    })
                }

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send(response)
            }
        )
    })
})

router.get('/conversaArtista/:idChat', loginArtista, (req, res, next) => {

    const idChat = req.params.idChat

    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT * FROM tblChat WHERE idChat = ?`,
            [idChat],

            (error, results, fields) => {
                conn.release()
        
                const response = {
                    chat: results.map(chat => {
                        return {
                            idChat: chat.idChat,
                            idCliente: chat.idCliente,
                            idArtista: chat.idArtista,
                        }
                    })
                }

                if (error) { return res.status(500).send({ error: error }) }

                return res.status(200).send(response)
            }
        )
    })
})

router.post('/chatCliente' , loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    const { idArtista } = req.body

    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT * FROM tblChat WHERE idCliente = ? AND idArtista = ?`,
            [idCliente, idArtista],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                if (results.length > 0) {
                    return res.status(200).send({
                        idChat: results[0].idChat,
                        idCliente: results[0].idCliente,
                        idArtista: results[0].idArtista,
                    })
                } else {
                    conn.query(
                        `INSERT INTO tblChat (idCliente, idArtista) VALUES (?, ?)`,
                        [idCliente, idArtista],

                        (error, results, fields) => {
                            conn.release()

                            if (error) { return res.status(500).send({ error: error }) }

                            return res.status(200).send({
                                idChat: results.insertId,
                                idCliente: idCliente,
                                idArtista: idArtista,
                            })
                        }
                    )
                }
            }
        )
    })
})


router.post('/chatArtista' , loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    const { idCliente } = req.body

    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT * FROM tblChat WHERE idCliente = ? AND idArtista = ?`,
            [idCliente, idArtista],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                if (results.length > 0) {
                    return res.status(200).send({
                        idChat: results[0].idChat,
                        idCliente: results[0].idCliente,
                        idArtista: results[0].idArtista,
                    })
                } else {
                    conn.query(
                        `INSERT INTO tblChat (idCliente, idArtista) VALUES (?, ?)`,
                        [idCliente, idArtista],

                        (error, results, fields) => {
                            conn.release()

                            if (error) { return res.status(500).send({ error: error }) }

                            return res.status(200).send({
                                idChat: results.insertId,
                                idCliente: idCliente,
                                idArtista: idArtista,
                            })
                        }
                    )
                }
            }
        )
    })
})







module.exports = router