const express = require('express')
const router = express.Router()

const mysql = require('../../database/index').pool


router.get('/pix', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM tblPixArtista`, function(error, rows, fields) {

            if (error) {
                console.log(error);
                return res.status(500).send({
                    error: error,
                    response: null
                })
            } 

            res.status(200).send({
                    pix: rows
            })
        })
    })
    
})


router.get('/pix/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM tblPixArtista WHERE idArtista = ${id}`, function(err, rows, fields) {

            if (error) {
                console.log(error);
                return res.status(500).send({
                    error: error,
                    response: null
                })
            } 

            res.status(200).send({
                    pixDeArtista: rows
            })
        })
    })

})

router.post('/pix/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    const {
        tipoChave, chave
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query(
            `INSERT INTO tblPixArtista(tipoChave, chave, idArtista) 
                VALUES('${tipoChave}','${chave}',${id})`,

            (error, results, fields) => {
                conn.release()
                
                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                res.status(201).send({
                    mensagem: 'Pix de Artista cadastrado com sucesso'
                })

                conn.query(
                   `DELETE FROM tblContaBancariaArtista WHERE idArtista = ${id}`,
                   conn.release()
                )
                
            }
        )
    })


})

router.patch('/pix/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    const {
        tipoChave, chave
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE tblPixArtista SET tipoChave = '${tipoChave}', chave = '${chave}' WHERE idArtista = ${id}`,

            (error, results, fields) => {
                conn.release()
                
                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                res.status(201).send({
                    mensagem: 'Pix de Artista atualizado com sucesso'
                })

            

            }
        )
    })


})

router.get('/contaBancaria', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM tblContaBancariaArtista`, 
        
        function(error, rows, fields) {

            if (error) {
                console.log(error);
                return res.status(500).send({
                    error: error,
                    response: null
                })
            } 

            res.status(200).send({
                    contasBancarias: rows
            })
        })
    })
})


router.get('/contaBancaria/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM tblContaBancariaArtista WHERE idArtista = ${id}`, 

        function(err, rows, fields) {

            if (error) {
                console.log(error);
                return res.status(500).send({
                    error: error,
                    response: null
                })
            } 

            res.status(200).send({
                    contaBancariaDeArtista: rows
            })
        })
    })
})

router.post('/contaBancaria/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    const {
        tipoConta, banco, titular,
        cpfTitular, agencia, digito,
        conta, digitoVerificador
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query(
            `INSERT INTO tblContaBancariaArtista(tipoConta, banco, titular, cpfTitular, 
                agencia, digito, conta, digitoVerificador, idArtista) 
                VALUES('${tipoConta}','${banco}','${titular}',
                '${cpfTitular}','${agencia}','${digito}',
                '${conta}','${digitoVerificador}',${id})`,

            (error, results, fields) => {
                conn.release()
                
                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                res.status(201).send({
                    mensagem: 'Conta Bancária de Artista cadastrado com sucesso'
                })

                conn.query(
                    `DELETE FROM tblPixArtista WHERE idArtista = ${id}`,
                    conn.release()
                 )
                    

            }
        )
    })
})

router.patch('/contaBancaria/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    const {
        tipoConta, banco, titular,
        cpfTitular, agencia, digito,
        conta, digitoVerificador
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query(
            `UPDATE tblContaBancariaArtista SET tipoConta = '${tipoConta}', banco = '${banco}', 
                                                titular = '${titular}', cpfTitular = '${cpfTitular}', 
                                                agencia = '${agencia}', digito = '${digito}', 
                                                conta = '${conta}', digitoVerificador = '${digitoVerificador}' 
                                                WHERE idArtista = ${id}`,

            (error, results, fields) => {
                conn.release()
                
                if (error) {
                    console.log(error);
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                res.status(201).send({
                    mensagem: 'Conta Bancária de Artista atualizada com sucesso'
                })

 

            }
        )
    })


})

module.exports = router