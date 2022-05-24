const express = require('express')
const router = express.Router()
const mysql = require('../../database/mysql').pool
const loginArtista = require('../middleware/loginArtista')
const loginCliente = require('../middleware/loginCliente')

router.get('/especialidades', (req, res) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 

        conn.query(
            `SELECT * FROM tblEspecialidade`,
            (error, results, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    qtdEspecialidades: results.length,
                    especialidades: results.map(especialidade => {
                        return {
                            idEspecialidade: especialidade.idEspecialidade,
                            nomeEspecialidade: especialidade.nomeEspecialidade, 
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todas as especialidades',
                            }
                        }
                    })
                }
    
               return res.status(200).send(response)
            }
        )
    })

})

router.get('/categorias', (req, res) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 

        conn.query(
            `SELECT * FROM tblCategoria`,
            (error, results, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    qtdCategorias: results.length,
                    categorias: results.map(categoria => {
                        return {
                            idCategoria: categoria.idCategoria,
                            nomeCategoria: categoria.nomeCategoria, 
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todas as Categorias',
                            }
                        }
                    })
                }
    
               return res.status(200).send(response)
            }
        )
    })

})

router.get('/especialidadesArtista', (req, res) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 

        conn.query(
            `SELECT * FROM tblEspecialidadeArtista`,
            (error, results, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    qtdEspecialidades: results.length,
                    especialidadesArtista: results.map(especialidadeArtista => {
                        return {
                            idEspecialidadeArtista: especialidadeArtista.idEspecialidadeArtista,
                            nomeEspecialidadeArtista: especialidadeArtista.nomeEspecialidadeArtista, 
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todas as especialidades de artista',
                            }
                        }
                    })
                }
    
               return res.status(200).send(response)
            }
        )
    })

})

router.get('/cidades/:idEstado', (req, res) => {

    const idEstado = req.params.idEstado

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 

        conn.query(
            `SELECT * FROM tblCidade WHERE idEstado = ?`,
            [idEstado],
            (error, results, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    qtdCidades: results.length,
                    cidades: results.map(cidade => {
                        return {
                            idCidade: cidade.idCidade,
                            nomeCidade: cidade.nomeCidade,
                            idEstado: cidade.idEstado,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todas as cidades',
                            }
                        }
                    })
                }
    
               return res.status(200).send(response)
            }
        )
    })

})

router.get('/artistasParceiros', loginCliente, (req, res) => {

    const idCliente = req.cliente.id_Cliente

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 

        conn.query(
            `SELECT tblArtistasParceiros.idCliente, tblArtistasParceiros.idArtista, tblArtista.nomeArtistico, tblArtista.fotoPerfilArtista FROM tblArtistasParceiros, 
            tblArtista WHERE tblArtistasParceiros.idArtista = tblArtista.idArtista AND tblArtistasParceiros.idCliente = ?`, 
            [idCliente],
            (error, results, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    qtdArtistas: results.length,
                    artistasParceiros: results.map(artistasParceiros => {
                        return {
                            idArtistasParceiros: artistasParceiros.idArtistasParceiros,
                            idArtista: artistasParceiros.idArtista,
                            idCliente: artistasParceiros.idCliente,
                            nomeArtistico: artistasParceiros.nomeArtistico,
                            fotoPerfilArtista: artistasParceiros.fotoPerfilArtista,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os artistas parceiros',
                            }
                        }
                    })
                }
    
               return res.status(200).send(response)
            }
        )
    })

})

router.get('/artistasParceirosDeCliente/:idCliente', (req, res) => {

    const idCliente = req.params.idCliente

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 

        conn.query(
            `SELECT tblArtistasParceiros.idCliente, tblArtistasParceiros.idArtista, tblArtista.nomeArtistico, tblArtista.fotoPerfilArtista FROM tblArtistasParceiros, 
            tblArtista WHERE tblArtistasParceiros.idArtista = tblArtista.idArtista AND tblArtistasParceiros.idCliente = ?`, 
            [idCliente],
            (error, results, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    qtdArtistas: results.length,
                    artistasParceiros: results.map(artistasParceiros => {
                        return {
                            idArtistasParceiros: artistasParceiros.idArtistasParceiros,
                            idArtista: artistasParceiros.idArtista,
                            idCliente: artistasParceiros.idCliente,
                            nomeArtistico: artistasParceiros.nomeArtistico,
                            fotoPerfilArtista: artistasParceiros.fotoPerfilArtista,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os artistas parceiros',
                            }
                        }
                    })
                }
    
               return res.status(200).send(response)
            }
        )
    })

})

router.get('/estados', (req, res) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 

        conn.query(
            `SELECT * FROM tblEstado`,
            (error, results, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    qtdEstados: results.length,
                    estados: results.map(estado => {
                        return {
                            idEstado: estado.idEstado,
                            nomeEstado: estado.nomeEstado, 
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os estados',
                            }
                        }
                    })
                }
    
               return res.status(200).send(response)
            }
        )
    })

})

router.get('/obrasFavoritas', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 

        conn.query(
            `SELECT tblObraFavorita.idObrasFavoritas, tblObraPronta.idObraPronta, tblObraPronta.nomeObra, tblObraPronta.preco, tblObraPronta.tecnica, tblCategoria.nomeCategoria, 
            tblObraPronta.imagem1obrigatoria, tblArtista.nomeArtistico 
            FROM tblObraFavorita, tblObraPronta, tblArtista, tblEspecialidade, tblCategoria 
            WHERE tblObraPronta.idObraPronta = tblObraFavorita.idObraPronta 
            AND tblObraPronta.idCategoria = tblCategoria.idCategoria 
            AND tblObraPronta.idEspecialidade = tblEspecialidade.idEspecialidade 
            AND tblArtista.idArtista = tblObraPronta.idArtista 
            AND tblobrafavorita.idCliente = ?`,
            [idCliente],
            (error, results, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    qtdObrasFavoritas: results.length,
                    obrasFavoritas: results.map(obrasFavoritas => {
                        return {
                            idObrasFavoritas: obrasFavoritas.idObrasFavoritas,
                            idObraPronta: obrasFavoritas.idObraPronta,
                            nomeObra: obrasFavoritas.nomeObra,
                            nomeArtistico: obrasFavoritas.nomeArtistico,
                            preco: obrasFavoritas.preco,
                            tecnica: obrasFavoritas.tecnica,
                            nomeCategoria: obrasFavoritas.nomeCategoria,
                            imagem1obrigatoria: obrasFavoritas.imagem1obrigatoria,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os estados',
                            }
                        }
                    })
                }
    
               return res.status(200).send(response)
            }
        )
    })

})


router.delete('/desfavoritarObras/:idObrasFavoritas', loginCliente, (req, res, next) => {

    const idObrasFavoritas = req.params.idObrasFavoritas

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 

        conn.query(
            `DELETE FROM tblObraFavorita WHERE idObrasFavoritas = ?`,
            [idObrasFavoritas],
            (error, results, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                   mensagem: "Obra desfavoritada com sucesso"
                }
    
               return res.status(200).send(response)
            }
        )
    })

})

module.exports = router