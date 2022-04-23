const express = require('express')
const router = express.Router()
const mysql = require('../../database/index').pool

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

module.exports = router