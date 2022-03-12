const express = require('express')
const router = express.Router()

const mysql = require('../../database/index').pool

router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM tblCliente`, function(err, rows, fields) {
            res.status(200).send({
                    clientes: rows
            })
        })
    })
    
})


router.get('/:clienteId', (req, res, next) => {

    const id = req.params.clienteId

    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM tblCliente WHERE idCliente = ${id}`, function(err, rows, fields) {
            res.status(200).send({
                    clientes: rows
            })
        })
    })

})


router.post('/', (req, res, next) => {

    const {
        nomeCompleto, dataNascimento, telefoneCelular, 
        cpf_cnpj, biografia, pais, nacionalidade, preferencia, 
        email, senha, contaEstaAtiva, 
        fotoPerfilCliente, 
        idCidade, 
        rua, cep, complemento, 
        bairro
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query(
            `INSERT INTO tblEnderecoCliente(rua, cep, complemento, bairro, idCidade) 
            VALUES(?,?,?,?,?)`,
            [rua, cep, complemento, bairro, idCidade],
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
                    mensagem: 'Endereço de Cliente cadastrado com sucesso',
                    id_enderecoCliente: results.insertId
                })

                conn.query(
                    `INSERT INTO tblCliente(nomeCompleto, dataNascimento, telefoneCelular, 
                        cpf_cnpj, biografia, pais, nacionalidade, preferencia, email, senha, contaEstaAtiva, fotoPerfilCliente, idEnderecoCliente) 
                        VALUES('${nomeCompleto}','${dataNascimento}','${telefoneCelular}','${cpf_cnpj}','${biografia}','${pais}','${nacionalidade}',
                        '${preferencia}','${email}','${senha}',${contaEstaAtiva},'${fotoPerfilCliente}',${results.insertId})`    
                )

                conn.release()

            }
        )
    })


})

router.patch('/:clienteId', async (req, res, next) => {

    const id = req.params.clienteId

    const {
        nomeCompleto, dataNascimento, telefoneCelular, 
        cpf_cnpj, biografia, pais, nacionalidade, preferencia, 
        email, senha, contaEstaAtiva, 
        fotoPerfilCliente,
        idEnderecoCliente,
        idCidade, 
        rua, cep, complemento, 
        bairro
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblCliente SET nomeCompleto = '${nomeCompleto}', dataNascimento =  '${dataNascimento}', telefoneCelular = '${telefoneCelular}, 
                    cpf_cnpj = '${cpf_cnpj}', biografia = '${biografia}', pais = '${pais}', nacionalidade = '${nacionalidade}', 
                    preferencia = '${preferencia}', email = '${email}', senha = '${senha}', contaEstaAtiva = ${contaEstaAtiva}, 
                    fotoPerfilCliente = '${fotoPerfilCliente}', idEnderecoCliente = '${idEnderecoCliente}'` ,

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
                    mensagem: 'Informações de Cliente atualizadas com sucesso',
                    id_enderecoCliente: results.insertId
                })

                conn.query(
                   
                )

                conn.release()

            }
        )
    })
 
     
 })

 router.delete('/:clienteId', async (req, res, next) => {

    const id = req.params.clienteId


    mysql.getConnection((error, conn) => {
        conn.query( 
            `DELETE FROM tblCliente WHERE idCliente = ${id}` ,

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
                    mensagem: 'Informações de Cliente atualizadas com sucesso',
                    id_enderecoCliente: results.insertId
                })

                conn.query(
                   
                )

                conn.release()

            }
        )
    })
 
     
 })

module.exports = router

/*
     `UPDATE tblEnderecoCliente SET rua = '${rua}', cep = '${cep}', complemento = '${complemento}', bairro = '${bairro}', idCidade = ${idCidade})
            WHERE idEnderecoCliente = ${idEnderecoCliente}`
*/
