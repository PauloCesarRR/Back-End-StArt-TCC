const express = require('express')
const router = express.Router()
const mysql = require('../../database/mysql').pool
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
    if (file.mimetype === 'image/gif' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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
const loginArtista = require('../middleware/loginArtista')


router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT * FROM tblObraPronta`, 
        function(error, results, fields) {
        
            
            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Não foi encontrado nenhuma obra cadastrada"
                })
            }

            const response = {
                qtdObrasProntas: results.length,
                obraPronta: results.map(obraPronta => {
                    return {
                        idObraPronta: obraPronta.idObraPronta,
                        nomeObra: obraPronta.nomeObra, 
                        preco: obraPronta.preco, 
                        quantidade: obraPronta.quantidade, 
                        tecnica: obraPronta.tecnica, 
                        desconto: obraPronta.desconto, 
                        eExclusiva: obraPronta.eExclusiva, 
                        descricao: obraPronta.descricao, 
                        imagem1obrigatoria: obraPronta.imagem1obrigatoria, 
                        imagem2opcional: obraPronta.imagem2opcional, 
                        imagem3opcional: obraPronta.imagem3opcional, 
                        imagem4opcional: obraPronta.imagem4opcional, 
                        imagem5opcional: obraPronta.imagem5opcional, 
                        imagem6opcional: obraPronta.imagem6opcional,
                        idArtista: obraPronta.idArtista,
                        idEspecialidade: obraPronta.idEspecialidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os obraProntas',
                            url: 'http://localhost:3000/obraPronta/' + obraPronta.idObraPronta
                        }
                    }
                })
            }

           return res.status(200).send({ obraProntas: response })
        })
    })
    
})


router.get('/Obras', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `SELECT tblObraPronta.idObraPronta, tblArtista.nomeArtistico as nomeArtista, tblObraPronta.nomeObra, tblObraPronta.preco, 
             tblObraPronta.quantidade, tblObraPronta.tecnica, tblObraPronta.desconto, tblObraPronta.eExclusiva,
             tblObraPronta.descricao, tblObraPronta.imagem1obrigatoria, tblCategoria.nomeCategoria FROM tblObraPronta, tblArtista, tblCategoria
             WHERE tblObraPronta.idCategoria = tblCategoria.idCategoria AND 
             tblObraPronta.idArtista = tblArtista.idArtista`,
            (error, result, field) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    obrasProntas: result.map(obraPronta => {
                        return {
                            idObraPronta: obraPronta.idObraPronta,
                            nomeObra: obraPronta.nomeObra,
                            preco: obraPronta.preco,
                            quantidade: obraPronta.quantidade,
                            nomeArtista: obraPronta.nomeArtista,
                            tecnica: obraPronta.tecnica,
                            desconto: obraPronta.desconto,
                            descricao: obraPronta.descricao,
                            eExclusiva: obraPronta.eExclusiva,
                            imagem1obrigatoria: obraPronta.imagem1obrigatoria,
                            nomeCategoria: obraPronta.nomeCategoria,
                        }
                    })
                }
                return res.status(200).send(response)
            }
        )
    })
})


router.get('/minhasObras', loginArtista, (req, res, next) => {
    
    const idArtista = req.artista.id_Artista

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblObraPronta, tblArtista, tblEspecialidade, tblCategoria WHERE tblObraPronta.idCategoria = tblCategoria.idCategoria AND tblObraPronta.idEspecialidade = tblEspecialidade.idEspecialidade AND tblArtista.idArtista = tblObraPronta.idArtista AND tblObraPronta.idArtista = ?', [idArtista],
            (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Você não possui obras cadastradas"
                })
            }

            const response = {obraPronta: results.map(obraPronta => {
                return {
                    idObraPronta: obraPronta.idObraPronta,
                    nomeObra: obraPronta.nomeObra, 
                    preco: obraPronta.preco, 
                    quantidade: obraPronta.quantidade, 
                    tecnica: obraPronta.tecnica, 
                    desconto: obraPronta.desconto, 
                    eExclusiva: obraPronta.eExclusiva, 
                    descricao: obraPronta.descricao, 
                    imagem1obrigatoria: obraPronta.imagem1obrigatoria, 
                    imagem2opcional: obraPronta.imagem2opcional, 
                    imagem3opcional: obraPronta.imagem3opcional, 
                    imagem4opcional: obraPronta.imagem4opcional, 
                    imagem5opcional: obraPronta.imagem5opcional, 
                    imagem6opcional: obraPronta.imagem6opcional,
                    idArtista: obraPronta.idArtista,
                    idEspecialidade: obraPronta.idEspecialidade,
                    nomeArtista: obraPronta.nomeArtistico,
                    nomeCategoria: obraPronta.nomeCategoria,
                    nomeEspecialidade: obraPronta.nomeEspecialidade,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna as obras de ' + obraPronta.idArtista,
                    }
                }
            })}
            res.status(200).send(response)
        })
    })
})


router.get('/:obraProntaId', (req, res, next) => {
    
    const id = req.params.obraProntaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(`SELECT tblArtista.fotoPerfilArtista, tblObraPronta.idArtista, tblObraPronta.idEspecialidade, tblObraPronta.idCategoria, tblObraPronta.eExclusiva, tblObraPronta.idObraPronta, tblObraPronta.nomeObra, tblObraPronta.preco, tblObraPronta.quantidade, 
                    tblObraPronta.tecnica, tblObraPronta.descricao, tblObraPronta.desconto, tblObraPronta.imagem1obrigatoria, tblObraPronta.imagem2opcional, tblObraPronta.imagem3opcional, 
                    tblObraPronta.imagem4opcional, tblObraPronta.imagem5opcional, tblObraPronta.imagem6opcional, tblArtista.nomeArtistico as nomeArtista, 
                    tblEspecialidade.nomeEspecialidade as nomeSubCategoria, tblCategoria.nomeCategoria FROM tblObraPronta, tblArtista, tblCategoria, tblEspecialidade 
                    WHERE tblObraPronta.idArtista = tblArtista.idArtista 
                    AND tblObraPronta.idEspecialidade = tblEspecialidade.idEspecialidade 
                    AND tblObraPronta.idCategoria = tblCategoria.idCategoria 
                    AND tblObraPronta.idObraPronta = ?`, [id],
            (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Esta obra não existe"
                })
            }

            const response = {
                obraPronta: results.map(obraPronta => {
                return {
                    idObraPronta: obraPronta.idObraPronta,
                    nomeObra: obraPronta.nomeObra, 
                    preco: obraPronta.preco, 
                    quantidade: obraPronta.quantidade, 
                    tecnica: obraPronta.tecnica, 
                    desconto: obraPronta.desconto, 
                    eExclusiva: obraPronta.eExclusiva, 
                    descricao: obraPronta.descricao, 
                    imagem1obrigatoria: obraPronta.imagem1obrigatoria, 
                    imagem2opcional: obraPronta.imagem2opcional, 
                    imagem3opcional: obraPronta.imagem3opcional, 
                    imagem4opcional: obraPronta.imagem4opcional, 
                    imagem5opcional: obraPronta.imagem5opcional, 
                    imagem6opcional: obraPronta.imagem6opcional,
                    idArtista: obraPronta.idArtista,
                    idEspecialidade: obraPronta.idEspecialidade,
                    idCategoria: obraPronta.idCategoria,
                    nomeSubCategoria: obraPronta.nomeSubCategoria,
                    nomeArtista: obraPronta.nomeArtista,
                    nomeCategoria: obraPronta.nomeCategoria,
                    fotoPerfilArtista: obraPronta.fotoPerfilArtista,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna as informações de ' + obraPronta.nomeObra,
                    }
                }
            })}
            res.status(200).send(response)
        })
    })
})


router.post('/inserirObra', upload.fields([
    { name: 'imagem1obrigatoria', maxCount: 1 },
    { name: 'imagem2opcional', maxCount: 1 },
    { name: 'imagem3opcional', maxCount: 1 },
    { name: 'imagem4opcional', maxCount: 1 },
    { name: 'imagem5opcional', maxCount: 1 },
    { name: 'imagem6opcional', maxCount: 1 }
]), loginArtista, async (req, res, next) => {

    const {
        nomeObra, preco, 
        quantidade, tecnica, desconto, 
        eExclusiva,  descricao, idEspecialidade, idCategoria
    } = req.body

    const idArtista = req.artista.id_Artista;

    const files = req.files;

    console.log(req)

    const images = await Promise.all(Object.values(files).map(async files => {
        const file = files[0];


        const originalName = resolve(resolve(__dirname, '..', '..', '..', 'uploads'), file.filename);

        const result = await cloudinary.uploader.upload(
          originalName,
          {
            public_id: file.filename,
            folder: 'obras',
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
 
    var imagem1obrigatoria = "";
    var imagem2opcional = "";
    var imagem3opcional = "";
    var imagem4opcional = "";
    var imagem5opcional = "";
    var imagem6opcional = "";

    if(images[0] != undefined){
        imagem1obrigatoria = images[0].result.url;
    }
    if(images[1] != undefined){
        imagem2opcional = images[1].result.url;
    }
    if(images[2] != undefined){
        imagem3opcional = images[2].result.url;
    }
    if(images[3] != undefined){
        imagem4opcional = images[3].result.url;
    }
    if(images[4] != undefined){
        imagem5opcional = images[4].result.url;
    }
    if(images[5] != undefined){
        imagem6opcional = images[5].result.url;
    }


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `INSERT INTO tblObraPronta(nomeObra, preco, quantidade, tecnica, desconto, 
                eExclusiva,  descricao, imagem1obrigatoria, imagem2opcional, imagem3opcional, imagem4opcional, 
                imagem5opcional, imagem6opcional, idArtista, idEspecialidade, idCategoria) 
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [nomeObra, preco, quantidade, tecnica, desconto, eExclusiva,  descricao, imagem1obrigatoria, 
                    imagem2opcional, imagem3opcional, imagem4opcional, imagem5opcional, imagem6opcional,
                    idArtista, idEspecialidade,idCategoria],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Obra cadastrada com sucesso',
                    obraCadastrada: {
                        idObraPronta: results.insertId,
                        nomeObra: req.body.nomeObra,
                        tecnica: req.body.tecnica,
                        request: {
                            tipo: 'POST',
                            descricao: 'Cadastra Obra',
                            url: 'http://localhost:3000/obraPronta/' + results.insertId
                        }
                    }
                }

                res.status(201).send(response)

            }
        )
    })
})


router.patch('/atualizarObra/:obraProntaId', upload.fields([
    { name: 'imagem1obrigatoria', maxCount: 1 },
    { name: 'imagem2opcional', maxCount: 1 },
    { name: 'imagem3opcional', maxCount: 1 },
    { name: 'imagem4opcional', maxCount: 1 },
    { name: 'imagem5opcional', maxCount: 1 },
    { name: 'imagem6opcional', maxCount: 1 }
    ]), loginArtista, async (req, res, next) => {
    
    const {
        nomeObra, preco, 
        quantidade, tecnica, desconto, 
        eExclusiva,  descricao, idEspecialidade, idCategoria,
        img1,img2,img3,img4,img5,img6
    } = req.body

    const idObraPronta = req.params.obraProntaId


    const files = req.files;

    const images = await Promise.all(Object.values(files).map(async files => {
        const file = files[0];

        
        const originalName = resolve(resolve(__dirname, '..', '..', '..', 'uploads'), file.filename);

        const result = await cloudinary.uploader.upload(
          originalName,
          {
            public_id: file.filename,
            folder: 'obras',
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


    var imagem1obrigatoria = "";
    var imagem2opcional = "";
    var imagem3opcional = "";
    var imagem4opcional = "";
    var imagem5opcional = "";
    var imagem6opcional = "";

    indexImagem1 = images.filter(image => {
        return image.fieldname == "imagem1obrigatoria"
    })

    indexImagem2= images.filter(image => {
        return image.fieldname == "imagem2opcional"
    })

    indexImagem3 = images.filter(image => {
        return image.fieldname == "imagem3opcional"
    })

    indexImagem4 = images.filter(image => {
        return image.fieldname == "imagem4opcional"
    })

    indexImagem5 = images.filter(image => {
        return image.fieldname == "imagem5opcional"
    })

    indexImagem6 = images.filter(image => {
        return image.fieldname == "imagem6opcional"
    })


    if(indexImagem1.length > 0){
        imagem1obrigatoria = indexImagem1[0].result.url;
    } else {
        imagem1obrigatoria = img1
    }

    if(indexImagem2.length > 0){
        imagem2opcional = indexImagem2[0].result.url;
    } else {
        imagem2opcional = img2
    }

    if(indexImagem3.length > 0){
            imagem3opcional = indexImagem3[0].result.url;
    } else {
        imagem3opcional = img3
    }

    if(indexImagem4.length > 0){
        imagem4opcional = indexImagem4[0].result.url;
    } else {
        imagem4opcional = img4
    }

    if(indexImagem5.length > 0){
        imagem5opcional = indexImagem5[0].result.url;
    } else {
        imagem5opcional = img5
    }

    if(indexImagem6.length > 0){
        imagem6opcional = indexImagem6[0].result.url;
    } else {
        imagem6opcional = img6
    }

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

            conn.query(
                `UPDATE tblObraPronta SET nomeObra = ?, preco = ?, quantidade = ?, tecnica = ?, desconto = ?, 
                    eExclusiva = ?,  descricao = ?, imagem1obrigatoria = ?, imagem2opcional = ?, imagem3opcional = ?, imagem4opcional = ?, 
                    imagem5opcional = ?, imagem6opcional = ?, idEspecialidade = ?, idCategoria = ? WHERE idObraPronta = ?`,
                    [nomeObra, preco, quantidade, tecnica, desconto, eExclusiva,  descricao, imagem1obrigatoria, 
                        imagem2opcional, imagem3opcional, imagem4opcional, imagem5opcional, imagem6opcional,
                        idEspecialidade, idCategoria, idObraPronta],

                (error, results, fields) => {
                    conn.release()
                    
                    if (error) { return res.status(500).send({ error: error }) } 

                    const response = {
                        mensagem: 'Obra editada com sucesso',
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Edita Obra',
                            url: 'http://localhost:3000/obraPronta/' + idObraPronta
                        }
                    }

                    res.status(201).send({
                        obraEditada: response
                    })

                }
            )
    })
})


router.delete('/:obraProntaId', loginArtista, (req, res, next) => {

    const idObraPronta = req.params.obraProntaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `DELETE FROM tblObraFavorita WHERE idObraPronta = ?` , [idObraPronta],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                conn.query( 
                    `DELETE FROM tblObraPronta WHERE idObraPronta = ?` , [idObraPronta],
        
                    (error, results, fields) => {
                        conn.release()
                        
                        if (error) { return res.status(500).send({ error: error }) } 
        
                        const response = {
                            mensagem: "Obra foi deletada com sucesso"
                        }
        
                        res.status(201).send(response)
        
                    }
                )

            }
        )
    })
})

module.exports = router