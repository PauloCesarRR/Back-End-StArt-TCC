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
                    mensagem: 'Endereço de Cliente cadastrado com sucesso'
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

router.patch('/perfil/:clienteId', async (req, res, next) => {

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
            `UPDATE tblCliente SET biografia = '${biografia}', pais = '${pais}', nacionalidade = '${nacionalidade}', 
                    preferencia = '${preferencia}',
                    fotoPerfilCliente = '${fotoPerfilCliente}' WHERE idCliente = ${id}` ,

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
            `UPDATE tblCliente SET nomeCompleto = '${nomeCompleto}', dataNascimento =  '${dataNascimento}', telefoneCelular = '${telefoneCelular}', cpf_cnpj = '${cpf_cnpj}', email = '${email}' WHERE idCliente = ${id}` ,

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

        conn.query(`SELECT idEnderecoCliente FROM tblCliente WHERE idCliente = ${id}`, 
        
        function(err, rows, fields) {
            conn.release()
            const {idEnderecoCliente} = rows[0]

            res.status(201).send({
                mensagem: 'endereço de Cliente foi atualizado com sucesso'
            })
            conn.query( 
                `UPDATE tblEnderecoCliente SET rua = '${rua}', cep = '${cep}', complemento = '${complemento}', bairro = '${bairro}', idCidade = ${idCidade} WHERE idEnderecoCliente = ${idEnderecoCliente}` ,
    
                    conn.release()

            )
        })

        })
   
 })

 router.patch('/desativarConta/:clienteId', async (req, res, next) => {

    const id = req.params.clienteId


    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblCliente SET contaEstaAtiva = 0 WHERE idCliente = ${id}` ,

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
                    mensagem: 'Conta de Cliente foi desativada com sucesso'
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
                    mensagem: 'Cliente foi deletado com sucesso'
                })

                conn.query(
                   
                )

                conn.release()

            }
        )
    })
 
     
 })

 

module.exports = router
