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
            `SELECT tblObraPronta.idObraPronta, tblArtista.nomeArtistico as nomeArtista, tblObraPronta.nomeObra, tblObraPronta.preco, 
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
                            idObraPronta: obraPronta.idObraPronta,
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
                mysql.releaseConnection(conn)
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
            `SELECT tblArtista.idArtista, tblArtista.nomeArtistico, tblArtista.fotoPerfilArtista, tblEspecialidadeArtista.nomeEspecialidadeArtista
            FROM tblArtista, tblEspecialidadeArtista WHERE tblArtista.idEspecialidadeArtista = tblEspecialidadeArtista.idEspecialidadeArtista AND tblArtista.nomeArtistico LIKE '%${pesquisarArtista}%' ORDER BY tblArtista.nomeArtistico`,
            (error, results, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    qtdArtistas: results.length,
                    artista: results.map(artista => {
                        return {
                            idArtista: artista.idArtista, 
                            nomeArtistico: artista.nomeArtistico, 
                            nomeEspecialidadeArtista: artista.nomeEspecialidadeArtista,
                            fotoPerfilArtista: artista.fotoPerfilArtista,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os artistas',
                                url: 'http://localhost:3000/artista/' + artista.idArtista
                            }
                        }
                    })
                }
                mysql.releaseConnection(conn)
                return res.status(200).send(response)
            }
        )
    })
})
module.exports = router