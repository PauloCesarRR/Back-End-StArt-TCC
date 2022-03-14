const express = require('express')
const router = express.Router()

const mysql = require('../../database/index').pool

router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM tblArtista`, function(err, rows, fields) {
            res.status(200).send({
                    artistas: rows
            })
        })
    })
    
})


router.get('/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM tblArtista WHERE idArtista = ${id}`, function(err, rows, fields) {
            res.status(200).send({
                    artista: rows
            })
        })
    })

})


router.post('/', (req, res, next) => {

    const {
        nomeCompleto, nomeArtistico, cpf_cnpj, 
        telefoneCelular, dataNascimento, 
        biografia, pais, nacionalidade, 
        email, senha, contaEstaAtiva, eDestacado, 
        idEspecialidade, fotoPerfilArtista
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query(
            `INSERT INTO tblArtista(nomeCompleto, nomeArtistico, cpf_cnpj, telefoneCelular, dataNascimento, biografia, pais, nacionalidade, email, senha, contaEstaAtiva, eDestacado, idEspecialidade, fotoPerfilArtista) 
                VALUES('${nomeCompleto}','${nomeArtistico}','${cpf_cnpj}','${telefoneCelular}','${dataNascimento}','${biografia}','${pais}','${nacionalidade}',
                '${email}','${senha}',${contaEstaAtiva},${eDestacado},${idEspecialidade},'${fotoPerfilArtista}')`,

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
                    mensagem: 'Artista cadastrado com sucesso'
                })

            }
        )
    })


})


router.patch('/perfil/:artistaId', async (req, res, next) => {

    const id = req.params.artistaId

    const {
         nomeArtistico,
         fotoPerfilArtista, 
         idEspecialidade, 
         nacionalidade, 
         pais, 
         biografia
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblArtista SET nomeArtistico = '${nomeArtistico}', biografia = '${biografia}', pais = '${pais}', nacionalidade = '${nacionalidade}', 
                    idEspecialidade = ${idEspecialidade},
                    fotoPerfilArtista = '${fotoPerfilArtista}' WHERE idArtista = ${id}` ,

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
                    mensagem: 'Perfil de Artista atualizado com sucesso'
                })


            }
        )
    })
 
     
 })

router.post('/pix/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    const {
        tipoChave, chave
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query(
            `INSERT INTO tblPixArtista(tipoChave, chave) 
                VALUES('${tipoChave}','${chave}')`,

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

            }
        )
    })


})

router.post('/ContaBancaria/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    const {
        tipoConta, banco, titular,
        cpfTitular, agencia, digito,
        conta, digitoVerificador
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query(
            `INSERT INTO tblPixArtista(tipoConta, banco, titular, cpfTitular, 
                agencia, digito, conta, digitoVerificador) 
                VALUES('${tipoConta}','${banco}','${titular}',
                '${cpfTitular}','${agencia}','${digito}',
                '${conta}','${digitoVerificador}')`,

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

            }
        )
    })


})




 router.delete('/:artistaId', (req, res, next) => {

    const id = req.params.artistaId


    mysql.getConnection((error, conn) => {
     
    })
 
     
 })

 

module.exports = router