const express = require('express')
const { criptografar, descriptografar } = require('../crypto')
const router = express.Router()

const mysql = require('../../database/index').pool

router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
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

    const senhaCriptografada = criptografar(senha)

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
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
                        res.status(401).send({ mensagem: 'Usuario já cadastrado' })
                    } else {
                        conn.query(
                            `INSERT INTO tblCliente(nomeCompleto, dataNascimento, telefoneCelular, 
                                cpf_cnpj, biografia, pais, nacionalidade, preferencia, email, senha, contaEstaAtiva, fotoPerfilCliente, idEnderecoCliente) 
                                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                                [nomeCompleto,dataNascimento,telefoneCelular,cpf_cnpj,biografia,pais,nacionalidade,
                                preferencia,email,senhaCriptografada,contaEstaAtiva,fotoPerfilCliente,idEnderecoClienteInserido],
                                (error, results) => {
                                    conn.release()
                                    if (error) { return res.status(500).send({ error: error }) } 
                                    res.status(201).send({
                                        mensagem: 'Cliente foi cadastrado com sucesso'
                                    })
                                }
                               
                        )

                        
                    }
                })


            }
        )
    })


})

router.patch('/perfil/:clienteId', (req, res, next) => {

    const id = req.params.clienteId

    const {
         fotoPerfilCliente, 
         preferencia, 
         nacionalidade, 
         pais, 
         biografia
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblCliente SET biografia = ?, pais = ?, nacionalidade = ?, 
                    preferencia = ?, fotoPerfilCliente = ? WHERE idCliente = ?` ,
            
                    [biografia,pais,nacionalidade,preferencia,fotoPerfilCliente,id],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                res.status(201).send({
                    mensagem: 'Perfil de Cliente atualizadas com sucesso'
                })


            }
        )
    })
 
     
 })

 

 router.patch('/dadosPessoais/:clienteId', async (req, res, next) => {

    const id = req.params.clienteId

    const {
        nomeCompleto, 
        dataNascimento,
        telefoneCelular, 
        cpf_cnpj,
        email
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblCliente SET nomeCompleto = ?, dataNascimento =  ?, telefoneCelular = ?, cpf_cnpj = ?, email = ? WHERE idCliente = ?` ,
            [nomeCompleto,dataNascimento,telefoneCelular,cpf_cnpj,email,id],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                res.status(201).send({
                    mensagem: 'Informações pessoais de Cliente atualizadas com sucesso'
                })


            }
        )
    })
 
     
 })

 router.patch('/alterarEndereco/:clienteId', async (req, res, next) => {

    const id = req.params.clienteId

    const {
        idCidade, 
        rua, cep, complemento, 
        bairro
    } = req.body

    mysql.getConnection((error, conn) => {

        conn.query(`SELECT idEnderecoCliente FROM tblCliente WHERE idCliente = ?`, 
        [id],
        
        function(err, rows, fields) {
            conn.release()
            const {idEnderecoCliente} = rows[0]

            res.status(201).send({
                mensagem: 'endereço de Cliente foi atualizado com sucesso'
            })
            conn.query( 
                `UPDATE tblEnderecoCliente SET rua = ?, cep = ?, complemento = ?, bairro = ?, idCidade = ? WHERE idEnderecoCliente = ?` ,
                [rua, cep, complemento, bairro, idCidade,idEnderecoCliente],
    
                    conn.release()

            )
        })

        })
   
 })

 router.patch('/alterarSenha/:clienteId', (req, res, next) => {

    const id = req.params.clienteId

    const {
        senhaAntiga,
        novaSenha
    } = req.body

    const novaSenhaCriptografada = criptografar(novaSenha)

    mysql.getConnection((error, conn) => {

        conn.query(`SELECT senha FROM tblCliente WHERE idCliente = ?`, 
        [id],
        
        function(err, rows, fields) {
            conn.release()
            const {senha} = rows[0]

            const senhaDescriptografada = descriptografar(senha)

            if(senhaAntiga == senhaDescriptografada){
                conn.query( 
                    `UPDATE tblCliente SET senha = ? WHERE idCliente = ?` ,
                    [novaSenhaCriptografada,id],
    
                    conn.release()
                )
                res.status(201).send({
                mensagem: 'Senha de Cliente foi atualizada com sucesso'
                })
            } else {
                res.status(404).send({
                    mensagem: 'A senha digitada não corresponde a senha atual'
                })
            }

            
           
        })

        })
   
 })

 router.patch('/desativarConta/:clienteId', (req, res, next) => {

    const id = req.params.clienteId


    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblCliente SET contaEstaAtiva = 0 WHERE idCliente = ?` ,
            [id],

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

 router.patch('/ativarConta/:clienteId', (req, res, next) => {

    const id = req.params.clienteId


    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblCliente SET contaEstaAtiva = 1 WHERE idCliente = ?` ,
            [id],

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

 router.delete('/:clienteId', async (req, res, next) => {

    const id = req.params.clienteId


    mysql.getConnection((error, conn) => {
        conn.query( 
            `DELETE FROM tblCliente WHERE idCliente = ?` ,
            [id],

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
