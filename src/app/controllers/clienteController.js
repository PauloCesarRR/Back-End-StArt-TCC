const connectionDb = require('../../database/index').pool
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {

   res.status(200).send({
    mensagem: 'OK, Deu Certo'
    })

    
})


router.get('/:clienteId', (req, res) => {

    const id = req.params.clienteId

    if (id === 'especial'){
        res.status(200).send({
            mensagem: 'OK, Deu Certo Especial',
            id: id
        })
    } else {
        res.status(200).send({
                mensagem: 'OK, Deu Certo'
        })
    }

  
})


router.post('/', (req, res) => {

    const {
        nomeCompleto, dataNascimento, telefoneCelular, 
        cpf_cnpj, biografia, pais, nacionalidade, preferencia, 
        email, senha, contaEstaAtiva, 
        fotoPerfilCliente, idCidade, 
        rua, cep, complemento, 
        bairro
    } = req.body

    connectionDb.getConnection((error, conn) => {
        conn.query(
            `INSERT INTO tblEnderecoCliente(rua, cep, complemento, bairro, idCidade) 
            VALUES('${rua}','${cep}','${complemento}','${bairro}',${idCidade})`,
            (error, results, fields) => {
                conn.release()
                
                if (error) {

                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                } 
                res.status(201).send({
                    mensagem: 'Endereço de  Cliente criado com sucesso',
                    id_produto: results.insertId
                })
            }
        )
    })
 
})

router.patch('/', async (req, res) => {

    res.status(200).send({
     mensagem: 'OK, Deu Certo PATCH'
     })
 
     
 })

 router.delete('/', async (req, res) => {

    res.status(200).send({
     mensagem: 'OK, Deu Certo DELETE'
     })
 
     
 })

module.exports = router

/*`INSERT INTO tblCliente(nomeCompleto, dataNascimento, telefoneCelular, 
    cpf_cnpj, biografia, pais, nacionalidade, preferencia, email, senha, contaEstaAtiva, fotoPerfilCliente, idEnderecoCliente) 
    VALUES('${nomeCompleto}',${dataNascimento},'${telefoneCelular}','${cpf_cnpj}','${biografia}','${pais}','${nacionalidade}',
    '${preferencia}','${email}','${senha}',${contaEstaAtiva},'${fotoPerfilCliente}',LAST_INSERT_ID())`
*/