const connectionDb = require('../../database/connection')
const express = require('express')

const router = express()

router.get('/clientes', (req, res) => {
    execSQLQuery('SELECT * FROM tblCliente', res)
})


router.get('/clientes/:id?', (req, res) => {
    let filter = '';
    if(req.params.id) filter = ' WHERE ID =' + parseInt(req.params.id)
    execSQLQuery('SELECT * FROM tblCliente' + filter, res)
})


router.post('/clientes', (req, res) => {

    const {
        nomeCompleto,
        dataNascimento,
        telefoneCelular,
        cpf_cnpj,
        biografia,
        pais,
        preferencia,
        email,
        senha,
        contaEstaAtiva,
        fotoPerfilCliente,
        idEstado,
        idCidade,
        rua,
        cep,
        complemento,
        bairro

        
    } = req.body


    execSQLQuery(`INSERT INTO tblEnderecoCliente(rua, cep, complemento, bairro, idCidade) 
        VALUES('${rua}','${cep}','${complemento}','${bairro}','${idCidade})`, 
        res);
    

    const idEnderecoCliente = 1


 
    execSQLQuery(`INSERT INTO tblCliente(nomeCompleto, dataNascimento, telefoneCelular, 
                cpf_cnpj, biografia, pais, preferencia, email, senha, contaEstaAtiva, fotoPerfilCliente, idEnderecoCliente) 
                VALUES('${nomeCompleto}',${dataNascimento},'${telefoneCelular}','${cpf_cnpj}','${biografia}','${pais}',
                '${preferencia}','${email}','${senha}',${contaEstaAtiva},'${fotoPerfilCliente}',${idEnderecoCliente})`, 
                res);
})