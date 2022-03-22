const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('../../database/index').pool
const loginCliente = require('../middleware/loginCliente')

router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblCliente`, 
        function(error, results, fields) {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Não foi encontrado nenhum cliente cadastrado"
                })
            }

            const response = {
                qtdClientes: results.length,
                cliente: results.map(cliente => {
                    return {
                        idCliente: cliente.idCliente,
                        nomeCompleto: cliente.nomeCompleto, 
                        cpf_cnpj: cliente.cpf_cnpj, 
                        telefoneCelular: cliente.telefoneCelular, 
                        dataNascimento: cliente.dataNascimento, 
                        biografia: cliente.biografia, 
                        pais: cliente.pais, 
                        nacionalidade: cliente.nacionalidade, 
                        preferencia: cliente.preferencia, 
                        email: cliente.email, 
                        senha: cliente.senha, 
                        contaEstaAtiva: cliente.contaEstaAtiva, 
                        idEnderecoCliente: cliente.idEnderecoCliente, 
                        fotoPerfilCliente: cliente.fotoPerfilCliente,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os clientes',
                            url: 'http://localhost:3000/cliente/' + cliente.idCliente
                        }
                    }
                })
            }

           return res.status(200).send({ clientes: response })
        })
    })
    
})


router.get('/:clienteId', (req, res, next) => {

    const id = req.params.clienteId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblCliente WHERE idCliente = ?`, [id],

        function(error, results, fields) {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Este cliente não existe"
                })
            }

            const response = {
                cliente: results.map(cliente => {
                    return {
                        idCliente: cliente.idCliente,
                        nomeCompleto: cliente.nomeCompleto, 
                        cpf_cnpj: cliente.cpf_cnpj, 
                        telefoneCelular: cliente.telefoneCelular, 
                        dataNascimento: cliente.dataNascimento, 
                        biografia: cliente.biografia, 
                        pais: cliente.pais, 
                        nacionalidade: cliente.nacionalidade, 
                        preferencia: cliente.preferencia, 
                        email: cliente.email, 
                        senha: cliente.senha, 
                        contaEstaAtiva: cliente.contaEstaAtiva, 
                        idEnderecoCliente: cliente.idEnderecoCliente, 
                        fotoPerfilCliente: cliente.fotoPerfilCliente,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os clientes',
                            url: 'http://localhost:3000/cliente/' + cliente.idCliente
                        }
                    }
                })
            }

           return res.status(200).send(response)
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

        if (error) { return res.status(500).send({ error: error }) } 

        bcrypt.hash(senha, 10, (errBcrypt, hash) => {

            if(errBcrypt){ return res.status(500).send({ error: errBcrypt})}

            conn.query(
                `INSERT INTO tblEnderecoCliente(rua, cep, complemento, bairro, idCidade) 
                VALUES(?,?,?,?,?)`,
                [rua, cep, complemento, bairro, idCidade],
                (error, results, fields) => {
                    conn.release()

                    if (error) { return res.status(500).send({ error: error }) } 

                    const idEnderecoClienteInserido = results.insertId

                    conn.query('SELECT * FROM tblCliente WHERE email = ?', [email], (error, results) => {
                        if (error) { return res.status(500).send({ error: error }) } 
                        if (results.length > 0){
                            res.status(401).send({ mensagem: 'Este Cliente já está cadastrado' })
                        } else {
                            conn.query(
                                `INSERT INTO tblCliente(nomeCompleto, dataNascimento, telefoneCelular, 
                                cpf_cnpj, biografia, pais, nacionalidade, preferencia, email, senha, contaEstaAtiva, fotoPerfilCliente, idEnderecoCliente) 
                                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                                [nomeCompleto,dataNascimento,telefoneCelular,cpf_cnpj,biografia,pais,nacionalidade,
                                preferencia,email,hash,contaEstaAtiva,fotoPerfilCliente,idEnderecoClienteInserido],
                                (error, results) => {
                                    conn.release()
                                    if (error) { return res.status(500).send({ error: error }) } 

                                    const response = {
                                        mensagem: 'Artista cadastrado com sucesso',
                                        clienteCadastrado: {
                                            idCliente: results.insertId,
                                            nomeCompleto: req.body.nomeCompleto,
                                            email: req.body.email,
                                            request: {
                                                tipo: 'POST',
                                                descricao: 'Cadastra Cliente',
                                                url: 'http://localhost:3000/cliente/' + results.insertId
                                            }
                                        }
                                    }
                                    res.status(201).send(response)
                                }  
                            ) 
                        }
                    })
                }
            )
        })
    })
})


router.post('/login', (req, res, next) => {

    const {
        emailLogin, senhaLogin
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblCliente WHERE email = ?`, [emailLogin], 
        
        (error, results, fields) => {
            conn.release()
            
            if (error) { return res.status(500).send({ error: error }) } 
            if (results.length < 1) {
                return res.status(401).send({ mensagem:'Falha na autenticação'})
            }
            bcrypt.compare(senhaLogin, results[0].senha, (err, result) => {
                if(err){
                    return res.status(401).send({ mensagem:'Falha na autenticação'})
                }
                if(result){
                    const token = jwt.sign({
                        idArtista: results[0].idArtista,
                        email: results[0].email
                    }, 
                    'segredinhocliente', 
                    {
                        expiresIn: "1h"
                    })


                    return res.status(200).send({ 
                        mensagem:'Autenticado com sucesso',
                        token: token
                    }) 
                }
                return res.status(401).send({ mensagem:'Falha na autenticação'})
            })

        })
    })

})


router.patch('/perfil', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    const {
         fotoPerfilCliente, 
         preferencia, 
         nacionalidade, 
         pais, 
         biografia
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(
            `UPDATE tblCliente SET biografia = ?, pais = ?, nacionalidade = ?, 
                    preferencia = ?, fotoPerfilCliente = ? WHERE idCliente = ?` ,
            
                    [biografia,pais,nacionalidade,preferencia,fotoPerfilCliente,idCliente],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    biografia: req.body.biografia,
                    pais: req.body.pais, 
                    nacionalidade: req.body.nacionalidade, 
                    preferencia: req.body.preferencia, 
                    fotoPerfilCliente: req.body.fotoPerfilCliente,
                    mensagem: 'Perfil de Cliente atualizado com sucesso'
                }

                res.status(201).send(response)

            }
        )
    })
 
     
 })

 

 router.patch('/dadosPessoais', loginCliente, async (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    const {
        nomeCompleto, 
        dataNascimento,
        telefoneCelular, 
        cpf_cnpj,
        email
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query( 
            `UPDATE tblCliente SET nomeCompleto = ?, dataNascimento =  ?, telefoneCelular = ?, cpf_cnpj = ?, email = ? WHERE idCliente = ?` ,
            [nomeCompleto,dataNascimento,telefoneCelular,cpf_cnpj,email,idCliente],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    nomeCompleto: req.body.nomeCompleto,
                    dataNascimento: req.body.dataNascimento, 
                    telefoneCelular: req.body.telefoneCelular, 
                    cpf_cnpj: req.body.cpf_cnpj, 
                    email: req.body.email,
                    mensagem: 'Informações pessoais de Cliente atualizadas com sucesso'
                }

                res.status(201).send(response)

            }
        )
    })
 
     
 })

 router.patch('/alterarEndereco', loginCliente, async (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    const {
        idCidade, 
        rua, cep, complemento, 
        bairro
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT idEnderecoCliente FROM tblCliente WHERE idCliente = ?`, 
        [idCliente], (error, results, fields) => {
            conn.release()
            const {idEnderecoCliente} = results[0]

            
            conn.query( 
                `UPDATE tblEnderecoCliente SET rua = ?, cep = ?, complemento = ?, bairro = ?, idCidade = ? WHERE idEnderecoCliente = ?` ,
                [rua, cep, complemento, bairro, idCidade,idEnderecoCliente],
                (error, results, fields) => {
                    conn.release()

                    if (error) { return res.status(500).send({ error: error }) } 

                    const response = {

                        rua: req.body.rua,
                        cep: req.body.cep, 
                        complemento: req.body.complemento, 
                        bairro: req.body.bairro, 
                        idCidade: req.body.idCidade,
                        mensagem: 'Endereço de Cliente foi atualizado com sucesso'
                         
                    }

                    res.status(201).send(response)
                }
            )
        })

        })
   
 })

 router.patch('/alterarSenha', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    const {
        senhaAntiga,
        novaSenha
    } = req.body


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblCliente WHERE idCliente = ?`, 
        [idCliente],
        
        (error, results, fields) => {
            conn.release()

            if (error) { return res.status(500).send({ error: error }) } 
         
            bcrypt.compare(senhaAntiga, results[0].senha, (err, result) => {
                if (err) { 
                    res.status(201).send({mensagem: 'Falha na alteração de senha'})
                }
                if (result) { 
                    bcrypt.hash(novaSenha, 10, (errBcrypt, hash) => {

                        if(err){ return res.status(500).send({ error: errBcrypt})}

                        conn.query( 
                            `UPDATE tblCliente SET senha = ? WHERE idCliente = ?` ,
                            [hash,idCliente],
            
                            (error, results, fields) => {
                                conn.release()
                    
                                if (error) { return res.status(500).send({ error: error }) } 
        
                                res.status(201).send({
                                    mensagem: 'Senha de Cliente foi atualizada com sucesso'
                                })
                            }
                        )
                    })
                }
                res.status(201).send({mensagem: 'Falha na alteração de senha'})
            })      
        })

    })
   
 })

 router.patch('/desativarConta', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query( 
            `UPDATE tblCliente SET contaEstaAtiva = 0 WHERE idCliente = ?` ,
            [idCliente],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                res.status(201).send({
                    mensagem: 'Conta de Cliente foi desativada com sucesso'
                })


            }
        )
    })
 
     
 })

 router.patch('/ativarConta', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query( 
            `UPDATE tblCliente SET contaEstaAtiva = 1 WHERE idCliente = ?` ,
            [idCliente],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                res.status(201).send({
                    mensagem: 'Conta de Cliente foi ativada com sucesso'
                })


            }
        )
    })
 
     
 })

 router.delete('/', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query( 
            `DELETE FROM tblCliente WHERE idCliente = ?` ,
            [idCliente],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                res.status(201).send({
                    mensagem: 'Cliente foi deletado com sucesso'
                })



            }
        )
    })
 
     
 })

 

module.exports = router
