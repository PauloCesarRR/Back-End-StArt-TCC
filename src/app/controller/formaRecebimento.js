const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const loginArtista = require('../middleware/loginArtista')
const mysql = require('../../database/mysql').pool


router.get('/pix', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblPixArtista`, 
        
        (error, results, fields) => {
            conn.release()

            if (error) { return res.status(500).send({ error: error }) } 

            res.status(200).send({
                    pix: results
            })
        })
    })
    
})


router.get('/pix/:artistaId',loginArtista, (req, res, next) => {

    const id = req.params.artistaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblPixArtista WHERE idArtista = ?`, [id], 
        (error, results, fields) => {

            conn.release()

            if (error) { return res.status(500).send({ error: error }) } 

            res.status(200).send({
                    pixDeArtista: results
            })
        })
    })

})

router.post('/pix', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    const {
        tipoChave, chave
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(
            `INSERT INTO tblPixArtista(tipoChave, chave, idArtista) 
                VALUES(?,?,?)`,
                [tipoChave,chave,idArtista],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    
                    tipoChave: req.body.tipoChave,
                    chave: req.body.chave, 
                    mensagem: 'Pix de Artista cadastrado com sucesso'
            
                }

                conn.query('SELECT * FROM tblContaBancariaArtista WHERE idArtista = ?', [idArtista], 
                    (error, results) => {
                        conn.release()
                        if (error) { return res.status(500).send({ error: error }) } 
                        if (results.length > 0){
                            conn.query(
                                `DELETE FROM tblContaBancariaArtista WHERE idArtista = ?`, [idArtista],
                                (error, results) => {
                                    conn.release()
                                    if (error) { return res.status(500).send({ error: error }) } 
                                }
                            )
                        }
                    }
                )

                res.status(201).send(response)

            }
        )
    })


})

router.patch('/pix/:artistaId', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    const {
        tipoChave, chave
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(
            `UPDATE tblPixArtista SET tipoChave = ?, chave = ? WHERE idArtista = ?`,
            [tipoChave,chave,idArtista],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {

                            tipoChave: req.body.tipoChave,
                            chave: req.body.chave, 
                            mensagem: 'Pix de Artista atualizado com sucesso'
                     
                }

                res.status(201).send(response)

            }
        )
    })


})

router.get('/contaBancaria', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblContaBancariaArtista`, 
        
        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            res.status(200).send({
                    contasBancarias: results
            })
        })
    })
})


router.get('/contaBancaria/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblContaBancariaArtista WHERE idArtista = ?`, [id],

        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            res.status(200).send({
                    contaBancariaDeArtista: results
            })
        })
    })
})

router.post('/cadastrarContaBancaria', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    const {
        tipoConta, banco, titular,
        cpfTitular, agencia, digito,
        conta, digitoVerificador
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(
            `INSERT INTO tblContaBancariaArtista(tipoConta, banco, titular, cpfTitular, 
                agencia, digito, conta, digitoVerificador, idArtista) 
                VALUES(?,?,?,?,?,?,?,?,?)`,
                [tipoConta,banco,titular, cpfTitular,agencia,digito,conta,digitoVerificador,idArtista],

           (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    
                        tipoConta: req.body.tipoConta,
                        banco: req.body.banco,
                        titular: req.body.titular,
                        cpfTitular: req.body.cpfTitular,
                        agencia: req.body.agencia,
                        digito: req.body.digito,
                        conta: req.body.conta,
                        digitoVerificador: req.body.digitoVerificador,
                        mensagem: 'Conta Bancária de Artista cadastrado com sucesso' 
                     
                }

                conn.query('SELECT * FROM tblPixArtista WHERE idArtista = ?', [idArtista], 
                    (error, results) => {
                        conn.release()
                        if (error) { return res.status(500).send({ error: error }) } 
                        if (results.length > 0){
                            conn.query(
                                `DELETE FROM tblPixArtista WHERE idArtista = ?`, [idArtista],
                                (error, results) => {
                                    conn.release()
                                    if (error) { return res.status(500).send({ error: error }) } 
                                }
                            )
                        }
                    }
                )

                res.status(201).send(response)
                    

            }
        )
    })
})

router.patch('/atualizarContaBancaria', (req, res, next) => {

    const idArtista = req.artista.id_Artista

    const {
        tipoConta, banco, titular,
        cpfTitular, agencia, digito,
        conta, digitoVerificador
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(
            `UPDATE tblContaBancariaArtista SET tipoConta = ?, banco = ?, 
                                                titular = ?, cpfTitular = ?, 
                                                agencia = ?, digito = ?, 
                                                conta = ?, digitoVerificador = ? 
                                                WHERE idArtista = ?`,
            [tipoConta,banco,titular, cpfTitular,agencia,digito,conta,digitoVerificador,idArtista],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                   
                    tipoConta: req.body.tipoConta,
                    banco: req.body.banco,
                    titular: req.body.titular,
                    cpfTitular: req.body.cpfTitular,
                    agencia: req.body.agencia,
                    digito: req.body.digito,
                    conta: req.body.conta,
                    digitoVerificador: req.body.digitoVerificador,
                    mensagem: 'Conta Bancária de Artista atualizada com sucesso'
                     
                }

                res.status(201).send(response)

            }
        )
    })


})

module.exports = router