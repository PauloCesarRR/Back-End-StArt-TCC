const express = require('express')
const router = express.Router()
const mysql = require('../../database/index').pool

router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblArtista', function(error, results, fields) {
            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Não foi encontrado nenhum artista cadastrado"
                })
            }

            const response = {
                qtdArtistas: results.length,
                artista: results.map(artista => {
                    return {
                        idArtista: artista.idArtista,
                        nomeCompleto: artista.nomeCompleto, 
                        nomeArtistico: artista.nomeArtistico, 
                        cpf_cnpj: artista.cpf_cnpj, 
                        telefoneCelular: artista.telefoneCelular, 
                        dataNascimento: artista.dataNascimento, 
                        biografia: artista.biografia, 
                        pais: artista.pais, 
                        nacionalidade: artista.nacionalidade, 
                        email: artista.email, 
                        senha: artista.senha, 
                        contaEstaAtiva: artista.contaEstaAtiva, 
                        eDestacado: artista.eDestacado, 
                        idEspecialidade: artista.idEspecialidade, 
                        fotoPerfilArtista: artista.fotoPerfilArtista,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os artistas',
                            url: 'http://localhost:3000/artista/' + artista.idArtista
                        }
                    }
                })
            }

           return res.status(200).send({ artistas: response })

        })
    })
    
})


router.get('/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblArtista WHERE idArtista = ?', [id],
        function(error, results, fields) {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Este artista não existe"
                })
            }

            const response = {
                artista: results.map(artista => {
                    return {
                        idArtista: artista.idArtista,
                        nomeCompleto: artista.nomeCompleto, 
                        nomeArtistico: artista.nomeArtistico, 
                        cpf_cnpj: artista.cpf_cnpj, 
                        telefoneCelular: artista.telefoneCelular, 
                        dataNascimento: artista.dataNascimento, 
                        biografia: artista.biografia, 
                        pais: artista.pais, 
                        nacionalidade: artista.nacionalidade, 
                        email: artista.email, 
                        senha: artista.senha, 
                        contaEstaAtiva: artista.contaEstaAtiva, 
                        eDestacado: artista.eDestacado, 
                        idEspecialidade: artista.idEspecialidade, 
                        fotoPerfilArtista: artista.fotoPerfilArtista,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna as informações do(a) ' + artista.nomeArtistico
                        }
                    }
                })
            }

            res.status(200).send(response)
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

        const senhaCriptografada = criptografar(senha)

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblArtista WHERE email = ?', [email], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) } 
            if (results.length > 0){
                    res.status(401).send({ mensagem: 'Este Cliente já está cadastrado' })
            } else {
                conn.query(
                    `INSERT INTO tblArtista(nomeCompleto, nomeArtistico, cpf_cnpj, telefoneCelular, 
                        dataNascimento, biografia, pais, nacionalidade, email, senha, contaEstaAtiva, 
                        eDestacado, idEspecialidade, fotoPerfilArtista) 
                        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                        [nomeCompleto,nomeArtistico,cpf_cnpj,telefoneCelular,dataNascimento,biografia,pais,nacionalidade,email,
                            senhaCriptografada,contaEstaAtiva,eDestacado,idEspecialidade,fotoPerfilArtista],

                    (error, results, fields) => {
                        conn.release()
                        
                        if (error) { return res.status(500).send({ error: error }) } 

                        const response = {
                            mensagem: 'Artista cadastrado com sucesso',
                            artistaCadastrado: {
                                idArtista: results.insertId,
                                nomeCompleto: req.body.nomeCompleto,
                                nomeArtistico: req.body.nomeArtistico,
                                request: {
                                    tipo: 'POST',
                                    descricao: 'Cadastra Artista',
                                    url: 'http://localhost:3000/artista/' + results.insertId
                                }
                            }
                        }

                        res.status(201).send({
                            artistaCadastrado: response
                        })

                    }
                )
            }
        })
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
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `UPDATE tblArtista SET nomeArtistico = ?, biografia = ?, pais = ?, nacionalidade = ?, 
                    idEspecialidade = ?, fotoPerfilArtista = ? 
                    WHERE idArtista = ?` ,

            [nomeArtistico,biografia,pais,nacionalidade,idEspecialidade,fotoPerfilArtista,id],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                       
                    nomeArtistico: req.body.nomeArtistico,
                    biografia: req.body.biografia,
                    pais: req.body.pais, 
                    nacionalidade: req.body.nacionalidade, 
                    idEspecialidade: req.body.idEspecialidade, 
                    fotoPerfilArtista: req.body.fotoPerfilArtista,
                    mensagem: 'Perfil de Artista atualizado com sucesso'
                
                    
                }

                res.status(201).send(response)


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
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `UPDATE tblArtista SET nomeCompleto = ?, dataNascimento =  ?, 
            telefoneCelular = ?, cpf_cnpj = ?, email = ? WHERE idArtista = ?` ,

            [nomeCompleto,dataNascimento,telefoneCelular,cpf_cnpj,email,id],

            (error, results, fields) => {
                conn.release()
                
               if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                
                    nomeCompleto: req.body.nomeCompleto,
                    dataNascimento: req.body.dataNascimento, 
                    telefoneCelular: req.body.telefoneCelular, 
                    cpf_cnpj: req.body.cpf_cnpj, 
                    email: req.body.email,
                    mensagem: 'Informações pessoais de Artista atualizadas com sucesso'
        
                }

            res.status(201).send(response)


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

    const novaSenhaCriptografada = criptografar(novaSenha)

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(`SELECT senha FROM tblArtista WHERE idArtista = ?`,
        [id], 
        
        function(err, rows, fields) {
            conn.release()
            const {senha} = rows[0]

            const senhaDescriptografada = descriptografar(senha)

            if(senhaAntiga == senhaDescriptografada){
                conn.query( 
                    `UPDATE tblArtista SET senha = ? WHERE idArtista = ?` ,
                    [novaSenhaCriptografada,id],
                    (error, results, fields) => {
                        conn.release()
            
                        if (error) { return res.status(500).send({ error: error }) } 

                        res.status(201).send({
                            mensagem: 'Senha de Artista foi atualizada com sucesso'
                        })
                    }
                

                )
              
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
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `UPDATE tblArtista SET contaEstaAtiva = 0 WHERE idArtista = ?` , [id],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Conta de Artista foi desativada com sucesso',
                    request: {
                        tipo: 'PATCH',
                        descricao: 'Ativa a conta de artista novamente',
                        url: 'http://localhost:3000/artista/ativarConta/' + id
                    }
                }

                res.status(201).send(response)


            }
        )
    })
     
 })

 router.patch('/ativarConta/:artistaId', async (req, res, next) => {

    const id = req.params.artistaId


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `UPDATE tblArtista SET contaEstaAtiva = 1 WHERE idArtista = ?` , [id],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Conta de Artista foi ativada com sucesso'
                }

                res.status(201).send(response)

            }
        )
    })
 
 })



 router.delete('/:artistaId', (req, res, next) => {

    const id = req.params.artistaId


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `DELETE FROM tblArtista WHERE idArtista = ${id}` ,

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: "Artista foi deletado com sucesso"
                }

                res.status(201).send(response)

            }
        )
    })
     
 })

 

module.exports = router