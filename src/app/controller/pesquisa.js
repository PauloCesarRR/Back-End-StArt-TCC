const express = require('express')
const router = express.Router()
const mysql = require('../../database/mysql').pool
const loginCliente = require('../middleware/loginCliente')
const loginArtista = require('../middleware/loginArtista')

router.get('/pesquisarObraPronta/:pesquisa', (req, res, next) => {

    const pesquisarObraPronta = req.params.pesquisa

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT tblArtista.nomeArtistico as nomeArtista, tblObraPronta.nomeObra, tblObraPronta.preco, 
             tblObraPronta.quantidade, tblObraPronta.tecnica, tblObraPronta.desconto, tblObraPronta.eExclusiva,
             tblObraPronta.descricao, tblObraPronta.imagem1obrigatoria, tblCategoria.nomeCategoria FROM tblObraPronta, tblArtista, tblCategoria
             WHERE nomeObra LIKE '%${pesquisarObraPronta}%' AND tblObraPronta.idCategoria = tblCategoria.idCategoria AND 
             tblObraPronta.idArtista = tblArtista.idArtista`,
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    obrasProntas: result.map(obraPronta => {
                        return {
                            nomeObra: obraPronta.nomeObra,
                            preco: obraPronta.preco,
                            quantidade: obraPronta.quantidade,
                            nomeArtista: obraPronta.nomeArtista,
                            tecnica: obraPronta.tecnica,
                            desconto: obraPronta.desconto,
                            descricao: obraPronta.descricao,
                            eExclusiva: obraPronta.eExclusiva,
                            imagem1obrigatoria: obraPronta.imagem1obrigatoria,
                            nomeCategoria: obraPronta.nomeCategoria,
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
})

router.get('/pesquisarArtista/:pesquisa', (req, res, next) => {

    const pesquisarArtista = req.params.pesquisa

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT idArtista, nomeArtistico as nomeArtista, fotoPerfilArtista
            FROM tblArtista WHERE nomeArtistico LIKE '%${pesquisarArtista}%'`,
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    artista: result.map(artista => {
                        return {
                            idArtista: artista.idArtista,
                            nomeArtista: artista.nomeArtista,
                            fotoPerfilArtista: artista.fotoPerfilArtista,
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
})
module.exports = router