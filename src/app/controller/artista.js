const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('../../database/mysql').pool
const loginArtista = require('../middleware/loginArtista')
const multer = require('multer')
const md5 = require('md5')
const randomHash = require('random-hash')
const { resolve } =  require('path');
const cloudinary = require('cloudinary').v2;
const { config } = require('../../database/cloudinary')
cloudinary.config(config);
const fs = require('fs')

const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, randomHash.generateHash({length: 9}) + file.originalname)
    }
})   
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
})

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

router.get('/listagemArtistas', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT tblArtista.idArtista, tblArtista.fotoPerfilArtista, tblArtista.nomeArtistico, tblEspecialidadeArtista.nomeEspecialidadeArtista FROM tblArtista, tblEspecialidadeArtista WHERE tblArtista.idEspecialidadeArtista = tblEspecialidadeArtista.idEspecialidadeArtista', function(error, results, fields) {
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
                        nomeArtistico: artista.nomeArtistico, 
                        nomeEspecialidadeArtista: artista.nomeEspecialidadeArtista,
                        fotoPerfilArtista: artista.fotoPerfilArtista,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os artistas',
                            url: 'http://localhost:3000/artista/' + artista.idArtista
                        }
                    }
                })
            }

           return res.status(200).send(response)

        })
    })
    
})

router.get('/meuPerfil', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblArtista, tblEspecialidadeArtista WHERE tblArtista.idEspecialidadeArtista = tblEspecialidadeArtista.idEspecialidadeArtista AND tblArtista.idArtista = ?', [idArtista],
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
                        cpfCnpj: artista.cpf_cnpj, 
                        telefoneCelular: artista.telefoneCelular, 
                        dataNascimento: artista.dataNascimento, 
                        biografia: artista.biografia, 
                        pais: artista.pais, 
                        nacionalidade: artista.nacionalidade, 
                        email: artista.email, 
                        senha: artista.senha, 
                        contaEstaAtiva: artista.contaEstaAtiva, 
                        eDestacado: artista.eDestacado, 
                        idEspecialidadeArtista: artista.idEspecialidadeArtista,
                        nomeEspecialidadeArtista: artista.nomeEspecialidadeArtista, 
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


router.get('/:artistaId', (req, res, next) => {

    const id = req.params.artistaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblArtista, tblEspecialidadeArtista WHERE tblArtista.idEspecialidadeArtista = tblEspecialidadeArtista.idEspecialidadeArtista AND tblArtista.idArtista = ?', [id],
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
                        cpfCnpj: artista.cpf_cnpj, 
                        telefoneCelular: artista.telefoneCelular, 
                        dataNascimento: artista.dataNascimento, 
                        biografia: artista.biografia, 
                        pais: artista.pais, 
                        nacionalidade: artista.nacionalidade, 
                        email: artista.email, 
                        senha: artista.senha, 
                        contaEstaAtiva: artista.contaEstaAtiva, 
                        eDestacado: artista.eDestacado, 
                        idEspecialidadeArtista: artista.idEspecialidadeArtista,
                        nomeEspecialidadeArtista: artista.nomeEspecialidadeArtista, 
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


router.post('/cadastro', (req, res, next) => {

    const {
        nomeCompleto, nomeArtistico, cpf_cnpj, 
        telefoneCelular, dataNascimento,  
        email, senha, contaEstaAtiva, eDestacado, 
        idEspecialidade
    } = req.body

    const imgPerfil = "https://res.cloudinary.com/dvofkamsu/image/upload/v1651845922/obras/1586969992913-perfilsemfoto_wu9iqj.jpg";


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }


        bcrypt.hash(senha, 10, (errBcrypt, hash) => {

            if(errBcrypt){ return res.status(500).send({ error: errBcrypt})} 

            conn.query('SELECT * FROM tblArtista WHERE email = ?', [email], (error, results) => {
                if (error) { return res.status(500).send({ error: error }) } 
                if (results.length > 0){
                        res.status(401).send({ mensagem: 'Este Artista já está cadastrado' })
                } else {
                    conn.query(
                        `INSERT INTO tblArtista(nomeCompleto, nomeArtistico, cpf_cnpj, telefoneCelular, 
                            dataNascimento, email, senha, contaEstaAtiva, fotoPerfilArtista,
                            eDestacado, idEspecialidadeArtista) 
                            VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
                            [nomeCompleto,nomeArtistico,cpf_cnpj,telefoneCelular,dataNascimento,email,
                                hash,contaEstaAtiva,imgPerfil,eDestacado,idEspecialidade],

                        (error, results, fields) => {
                            conn.release()
                            
                            if (error) { return res.status(500).send({ error: error }) } 
                            
                            conn.query(
                                `INSERT INTO tblAvaliacaoArtista(idArtista,avaliacaoArtista,descricao) VALUES(?,?,?)`,
                                [results.insertId, 5, "Avaliação padrão do artista"],
                    
                                (error, results, fields) => {
                                    conn.release()
                                    if (error) { return res.status(500).send({ error: error }) }                    
                                }
                            )

                            const token = jwt.sign({
                                id_Artista: results.insertId,
                                email: req.body.email
                            }, 
                            'segredinhoartista', 
                            {
                                expiresIn: "864000"
                            })

                            const response = {
                                mensagem: 'Artista cadastrado com sucesso',
                                artistaCadastrado: {
                                    idArtista: results.insertId,
                                    nomeCompleto: req.body.nomeCompleto,
                                    nomeArtistico: req.body.nomeArtistico,
                                    token: token,
                                    request: {
                                        tipo: 'POST',
                                        descricao: 'Cadastra Artista',
                                        url: 'http://localhost:3000/artista/' + results.insertId
                                    }
                                }
                            }

                            res.status(201).send({
                                response: response
                            })
                        }
                    )
                }
            })
        })
    })

})


router.post('/login', (req, res, next) => {

    const {
        emailLogin, senhaLogin
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblArtista WHERE email = ?`, [emailLogin], 
        
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
                        id_Artista: results[0].idArtista,
                        email: results[0].email
                    }, 
                    'segredinhoartista', 
                    {
                        expiresIn: "864000"
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


router.put('/perfil', upload.fields([
    { name: 'fotoPerfilArtista', maxCount: 1 }]),
     loginArtista, async (req, res, next) => {

    const idArtista = req.artista.id_Artista

console.log(req.artista)
console.log(idArtista)

    const {
         nomeArtistico, 
         idEspecialidadeArtista, 
         nacionalidade, 
         pais, 
         biografia,
         imgPerfil
    } = req.body

    const files = req.files;


    const images = await Promise.all(Object.values(files).map(async files => {
        const file = files[0];

        
        const originalName = resolve(resolve(__dirname, '..', '..', '..', 'uploads'), file.filename);

        const result = await cloudinary.uploader.upload(
          originalName,
          {
            public_id: file.filename,
            folder: 'artistas',
            resource_type: 'auto',
          },
          (error, result) => {
            return result;
          },
        );
    
        await fs.promises.unlink(originalName);

    
        return {
            fieldname: file.fieldname,
            result,
        }
    }));

    var fotoPerfilArtista = "";

    if(images[0] != undefined){
        fotoPerfilArtista = images[0].result.url;
    } else {
        fotoPerfilArtista = imgPerfil;
    }



    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `UPDATE tblArtista SET nomeArtistico = ?, biografia = ?, pais = ?, nacionalidade = ?, 
                    idEspecialidadeArtista = ?, fotoPerfilArtista = ? 
                    WHERE idArtista = ?` ,

            [nomeArtistico,biografia,pais,nacionalidade,idEspecialidadeArtista,fotoPerfilArtista,idArtista],

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

 router.put('/dadosPessoais', loginArtista, (req, res, next) => {


    const idArtista = req.artista.id_Artista

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

            [nomeCompleto,dataNascimento,telefoneCelular,cpf_cnpj,email,idArtista],

            (error, result, fields) => {
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

            }
        )
    })
 
 })

 router.put('/alterarSenha', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    const {
        senhaAntiga,
        novaSenha
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(`SELECT senha FROM tblArtista WHERE idArtista = ?`,
        [idArtista],

            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) }

                console.log(results[0].senha)
            
                bcrypt.compare(senhaAntiga, results[0].senha, (err, result) => {
                    if (err) { 
                        res.status(201).send({mensagem: 'Falha na alteração de senha'})
                    }
                    if (result) {
                        bcrypt.hash(novaSenha, 10, (errBcrypt, hash) => {

                            if(err){ return res.status(500).send({ error: errBcrypt})}

                            conn.query( 
                                `UPDATE tblArtista SET senha = ? WHERE idArtista = ?` ,
                                [hash,idArtista],
                
                                (error, results, fields) => {
                                    conn.release()
                        
                                    if (error) { return res.status(500).send({ error: error }) } 
            
                                    res.status(200).send({
                                        mensagem: 'Senha de Artista foi atualizada com sucesso'
                                    })
                                }
                            )
                        })
                    }
                })      
            })
        })
   
 })


router.put('/desativarConta', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `UPDATE tblArtista SET contaEstaAtiva = 0 WHERE idArtista = ?` , [idArtista],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Conta de Artista foi desativada com sucesso',
                    request: {
                        tipo: 'PUT',
                        descricao: 'Ativa a conta de artista novamente',
                        url: 'http://localhost:3000/artista/ativarConta' 
                    }
                }

                res.status(201).send(response)


            }
        )
    })
     
 })

 router.put('/ativarConta', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `UPDATE tblArtista SET contaEstaAtiva = 1 WHERE idArtista = ?` , [idArtista],

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



 router.delete('/', (req, res, next) => {

    const idArtista = req.artista.id_Artista


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `DELETE FROM tblArtista WHERE idArtista = ?` , [idArtista],

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