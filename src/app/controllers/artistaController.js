const express = require('express')
const router = express.Router()

const mysql = require('../../database/index').pool

router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        conn.query(`SELECT * FROM tblArtista`, function(error, rows, fields) {

            if (error) {
                console.log(error);
                return res.status(500).send({
                    error: error,
                    response: null
                })
            } 

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

            if (error) {
                console.log(error);
                return res.status(500).send({
                    error: error,
                    response: null
                })
            } 

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
            `INSERT INTO tblArtista(nomeCompleto, nomeArtistico, cpf_cnpj, telefoneCelular, 
                dataNascimento, biografia, pais, nacionalidade, email, senha, contaEstaAtiva, 
                eDestacado, idEspecialidade, fotoPerfilArtista) 
                VALUES('${nomeCompleto}','${nomeArtistico}','${cpf_cnpj}','${telefoneCelular}',
                '${dataNascimento}','${biografia}','${pais}','${nacionalidade}','${email}','${senha}',
                ${contaEstaAtiva},${eDestacado},${idEspecialidade},'${fotoPerfilArtista}')`,

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
                    idEspecialidade = ${idEspecialidade}, fotoPerfilArtista = '${fotoPerfilArtista}' 
                    WHERE idArtista = ${id}` ,

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

 router.patch('/dadosPessoais/:artistaId', async (req, res, next) => {

    const id = req.params.artistaId

    const {
        nomeCompleto, 
        dataNascimento,
        telefoneCelular, 
        cpf_cnpj,
        email
    } = req.body

    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblArtista SET nomeCompleto = '${nomeCompleto}', dataNascimento =  '${dataNascimento}', 
            telefoneCelular = '${telefoneCelular}', cpf_cnpj = '${cpf_cnpj}', email = '${email}' WHERE idArtista = ${id}` ,

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
                    mensagem: 'Informações pessoais de Artista atualizadas com sucesso'
                })


            }
        )
    })
 
 })

 router.patch('/alterarSenha/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    const {
        senhaAntiga,
        novaSenha
    } = req.body

    mysql.getConnection((error, conn) => {

        conn.query(`SELECT senha FROM tblArtista WHERE idArtista = ${id}`, 
        
        function(err, rows, fields) {
            conn.release()
            const {senha} = rows[0]

            if(senhaAntiga == senha){
                conn.query( 
                    `UPDATE tblArtista SET senha = '${novaSenha}' WHERE idArtista = ${id}` ,
    
                    conn.release()

                )
                res.status(201).send({
                mensagem: 'Senha de Artista foi atualizada com sucesso'
                })
            } else {
                res.status(404).send({
                    mensagem: 'A senha está incorreta'
                })
            }

            
           
        })

        })
   
 })


router.patch('/desativarConta/:artistaId', async (req, res, next) => {

    const id = req.params.artistaId


    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblArtista SET contaEstaAtiva = 0 WHERE idArtista = ${id}` ,

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
                    mensagem: 'Conta de Artista foi desativada com sucesso'
                })


            }
        )
    })
     
 })

 router.patch('/ativarConta/:artistaId', async (req, res, next) => {

    const id = req.params.artistaId


    mysql.getConnection((error, conn) => {
        conn.query( 
            `UPDATE tblArtista SET contaEstaAtiva = 1 WHERE idArtista = ${id}` ,

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
                    mensagem: 'Conta de Artista foi ativada com sucesso'
                })


            }
        )
    })
 
 })



 router.delete('/:artistaId', (req, res, next) => {

    const id = req.params.artistaId


    mysql.getConnection((error, conn) => {
        conn.query( 
            `DELETE FROM tblArtista WHERE idArtista = ${id}` ,

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
                    mensagem: 'Artista foi deletado com sucesso'
                })

                conn.query(
                   
                )

                conn.release()

            }
        )
    })
     
 })

 

module.exports = router