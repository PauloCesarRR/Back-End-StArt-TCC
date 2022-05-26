const express = require('express')
const router = express.Router()
const mysql = require('../../database/mysql').pool
const loginCliente = require('../middleware/loginCliente')
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
        conn.query(`SELECT tblCliente.nomeCompleto as nomeCliente, tblPedidoPersonalizado.descricao, tblPedidoPersonalizado.genero, 
                    tblPedidoPersonalizado.status, tblPedidoPersonalizado.imagem1opcional, tblPedidoPersonalizado.imagem2opcional,
                    tblPedidoPersonalizado.imagem3opcional, tblPedidoPersonalizado.idCliente FROM tblCliente, tblPedidoPersonalizado WHERE tblCliente.idCliente = tblPedidoPersonalizado.idCliente`, 
        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Não foi encontrado nenhum pedido personalizado cadastrado"
                })
            }

            const response = {
                qtdPedidosPersonalizados: results.length,
                pedidoPersonalizado: results.map(pedidoPersonalizado => {
                    return {
                        idPedidoPersonalizado: pedidoPersonalizado.idPedidoPersonalizado,
                        nomeCliente: pedidoPersonalizado.nomeCliente, 
                        descricao: pedidoPersonalizado.descricao, 
                        genero: pedidoPersonalizado.genero, 
                        status: pedidoPersonalizado.status, 
                        imagem1opcional: pedidoPersonalizado.imagem1opcional, 
                        imagem2opcional: pedidoPersonalizado.imagem2opcional, 
                        imagem3opcional: pedidoPersonalizado.imagem3opcional, 
                        idCliente: pedidoPersonalizado.idCliente, 

                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos  os Pedidos Personalizados',
                            url: 'http://localhost:3000/pedidoPersonalizado/' + pedidoPersonalizado.idPedidoPersonalizado
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
            return res.status(200).send({ pedidoPersonalizados: response })
        })
    })
    
})


router.get('/pedidosPublicos', loginArtista, (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT tblCliente.fotoPerfilCliente, tblCliente.nomeCompleto as nomeCliente, tblPedidoPersonalizado.idPedidoPersonalizado, tblPedidoPersonalizado.descricao, 
        tblPedidoPersonalizado.idEspecialidade, tblEspecialidade.nomeEspecialidade, tblPedidoPersonalizado.idCategoria, tblCategoria.nomeCategoria,
        tblPedidoPersonalizado.status, tblPedidoPersonalizado.imagem1opcional, tblPedidoPersonalizado.imagem2opcional,
        tblPedidoPersonalizado.imagem3opcional, tblPedidoPersonalizado.idCliente FROM tblCliente, tblPedidoPersonalizado, tblCategoria, tblEspecialidade WHERE 
        tblPedidoPersonalizado.idEspecialidade = tblEspecialidade.idEspecialidade AND 
        tblPedidoPersonalizado.idCategoria = tblCategoria.idCategoria AND
        tblCliente.idCliente = tblPedidoPersonalizado.idCliente AND tblPedidoPersonalizado.isPublic = 1 AND (tblPedidoPersonalizado.status = "Publicado" OR tblPedidoPersonalizado.status = "Aceito")`, 
        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                mysql.releaseConnection(conn)
                return res.status(404).send({ 
                    mensagem: "Não foi encontrado nenhum pedido personalizado cadastrado"
                })
            }

            const response = {
                qtdPedidosPersonalizados: results.length,
                pedidoPersonalizado: results.map(pedidoPersonalizado => {
                    return {
                        idPedidoPersonalizado: pedidoPersonalizado.idPedidoPersonalizado,
                        fotoPerfilCliente: pedidoPersonalizado.fotoPerfilCliente,
                        nomeCliente: pedidoPersonalizado.nomeCliente, 
                        descricao: pedidoPersonalizado.descricao, 
                        nomeCategoria: pedidoPersonalizado.nomeCategoria, 
                        nomeEspecialidade: pedidoPersonalizado.nomeEspecialidade, 
                        status: pedidoPersonalizado.status, 
                        imagem1opcional: pedidoPersonalizado.imagem1opcional, 
                        imagem2opcional: pedidoPersonalizado.imagem2opcional, 
                        imagem3opcional: pedidoPersonalizado.imagem3opcional, 
                        idCliente: pedidoPersonalizado.idCliente, 

                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos  os Pedidos Personalizados Públicos',
                            url: 'http://localhost:3000/pedidoPersonalizado/' + pedidoPersonalizado.idPedidoPersonalizado
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
            return res.status(200).send(response)
        })
    })
    
})


router.get('/meusPedidos', loginCliente, (req, res, next) => {

    const idCliente = req.cliente.id_Cliente

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT tblPedidoPersonalizado.idPedidoPersonalizado, tblCliente.nomeCompleto as nomeCliente, tblPedidoPersonalizado.descricao, 
                    tblPedidoPersonalizado.idEspecialidade, tblEspecialidade.nomeEspecialidade, tblPedidoPersonalizado.idCategoria, tblCategoria.nomeCategoria,
                    tblPedidoPersonalizado.status, tblPedidoPersonalizado.imagem1opcional, tblPedidoPersonalizado.imagem2opcional,
                    tblPedidoPersonalizado.imagem3opcional, tblPedidoPersonalizado.isPublic 
                    FROM tblCliente, tblPedidoPersonalizado, tblEspecialidade, tblCategoria, tblAvaliacaoCliente
                    WHERE tblPedidoPersonalizado.idEspecialidade = tblEspecialidade.idEspecialidade 
                    AND tblPedidoPersonalizado.idCategoria = tblCategoria.idCategoria 
                    AND tblCliente.idCliente = tblPedidoPersonalizado.idCliente 
                    AND tblPedidoPersonalizado.idCliente = ?`, 
                    [idCliente],
        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                mysql.releaseConnection(conn)
                return res.status(404).send({ 
                    mensagem: "Não foi encontrado nenhum pedido personalizado cadastrado"
                })
            }

            const response = {
                qtdPedidosPersonalizados: results.length,
                pedidoPersonalizado: results.map(pedidoPersonalizado => {
                    return {
                        idPedidoPersonalizado: pedidoPersonalizado.idPedidoPersonalizado,
                        nomeCliente: pedidoPersonalizado.nomeCliente, 
                        descricao: pedidoPersonalizado.descricao, 
                        nomeEspecialidade: pedidoPersonalizado.nomeEspecialidade,
                        nomeCategoria: pedidoPersonalizado.nomeCategoria,
                        status: pedidoPersonalizado.status,
                        imagem1opcional: pedidoPersonalizado.imagem1opcional,
                        imagem2opcional: pedidoPersonalizado.imagem2opcional,
                        imagem3opcional: pedidoPersonalizado.imagem3opcional,
                        idCliente: pedidoPersonalizado.idCliente,
                        isPublic: pedidoPersonalizado.isPublic,


                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos  os Pedidos Personalizados',
                            url: 'http://localhost:3000/pedidoPersonalizado/' + pedidoPersonalizado.idpedidoPersonalizado
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
            return res.status(200).send(response)
        })
    })

})


router.get('/artistaPedidoPersonalizado/:idPedidoPersonalizado', loginCliente, (req, res, next) => {

    const idPedidoPersonalizado = req.params.idPedidoPersonalizado

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT tblPedidoPersonalizado.idPedidoPersonalizado, tblArtista.idArtista
                    FROM tblPedidoPersonalizado, tblProposta, tblArtista
                    WHERE tblPedidoPersonalizado.idPedidoPersonalizado = ?
                    AND tblArtista.idArtista = tblProposta.idArtista`, 
                    [idPedidoPersonalizado],
        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                mysql.releaseConnection(conn)
                return res.status(404).send({ 
                    mensagem: "Não foi encontrado nenhum pedido personalizado cadastrado"
                })
            }

            const response = {
                artistaPedidoPersonalizado: results.map(artistaPedidoPersonalizado => {
                    return {
                        idPedidoPersonalizado: artistaPedidoPersonalizado.idPedidoPersonalizado,
                        idArtista: artistaPedidoPersonalizado.idArtista,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos  os Pedidos Personalizados',
                            url: 'http://localhost:3000/pedidoPersonalizado/' + artistaPedidoPersonalizado.idpedidoPersonalizado
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
            return res.status(200).send(response)
        })
    })

})


router.get('/pedidosParaMim', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT tblPedidoPersonalizado.idPedidoPersonalizado, tblCliente.fotoPerfilCliente, tblCliente.nomeCompleto as nomeCliente, tblPedidoPersonalizado.descricao, tblPedidoPersonalizado.idEspecialidade, 
        tblEspecialidade.nomeEspecialidade, tblPedidoPersonalizado.idCategoria, tblCategoria.nomeCategoria,
        tblPedidoPersonalizado.status, tblPedidoPersonalizado.imagem1opcional, tblPedidoPersonalizado.imagem2opcional,
        tblPedidoPersonalizado.imagem3opcional, tblPedidoPersonalizado.idCliente, tblArtista.nomeArtistico as paraArtista
        FROM tblCliente, tblPedidoPersonalizado, tblVisibilidadePedido, tblArtista, tblEspecialidade, tblCategoria
        WHERE tblPedidoPersonalizado.idEspecialidade = tblEspecialidade.idEspecialidade 
        AND tblCliente.idCliente = tblPedidoPersonalizado.idCliente 
        AND tblPedidoPersonalizado.idCategoria = tblCategoria.idCategoria 
        AND tblVisibilidadePedido.idPedidoPersonalizado = tblPedidoPersonalizado.idPedidoPersonalizado 
        AND tblVisibilidadePedido.idArtista = tblArtista.idArtista AND tblArtista.idArtista = ?
        AND tblPedidoPersonalizado.isPublic = 0 
        AND (tblPedidoPersonalizado.status = "Publicado" OR tblPedidoPersonalizado.status = "Aceito")`, 
                    [idArtista],
        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                mysql.releaseConnection(conn)
                return res.status(404).send({ 
                    mensagem: "Não foi encontrado nenhum pedido personalizado cadastrado"
                })
            }

            const response = {
                qtdPedidosPersonalizados: results.length,
                pedidoPersonalizado: results.map(pedidoPersonalizado => {
                    return {
                        idPedidoPersonalizado: pedidoPersonalizado.idPedidoPersonalizado,
                        fotoPerfilCliente: pedidoPersonalizado.fotoPerfilCliente,
                        nomeCliente: pedidoPersonalizado.nomeCliente, 
                        descricao: pedidoPersonalizado.descricao, 
                        nomeCategoria: pedidoPersonalizado.nomeCategoria, 
                        nomeEspecialidade: pedidoPersonalizado.nomeEspecialidade, 
                        status: pedidoPersonalizado.status, 
                        imagem1opcional: pedidoPersonalizado.imagem1opcional, 
                        imagem2opcional: pedidoPersonalizado.imagem2opcional, 
                        imagem3opcional: pedidoPersonalizado.imagem3opcional, 
                        idCliente: pedidoPersonalizado.idCliente,
                        idCategoria: pedidoPersonalizado.idCategoria,
                        idEspecialidade: pedidoPersonalizado.idEspecialidade,  
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos  os Pedidos Personalizados',
                            url: 'http://localhost:3000/pedidoPersonalizado/' + pedidoPersonalizado.idPedidoPersonalizado
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
            return res.status(200).send(response)
        })
    })
})


router.get('/:pedidoPersonalizadoId', (req, res, next) => {

    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT tblCliente.fotoPerfilCliente, AVG(DISTINCT tblAvaliacaoCliente.avaliacaoCliente) as notaCliente, tblCliente.nomeCompleto as nomeCliente, tblPedidoPersonalizado.descricao, tblPedidoPersonalizado.idEspecialidade, 
                    tblEspecialidade.nomeEspecialidade, tblPedidoPersonalizado.idCategoria, tblCategoria.nomeCategoria,
                    tblPedidoPersonalizado.status, tblPedidoPersonalizado.imagem1opcional, tblPedidoPersonalizado.imagem2opcional,
                    tblPedidoPersonalizado.imagem3opcional, tblPedidoPersonalizado.idCliente FROM tblCliente, tblPedidoPersonalizado, tblEspecialidade, tblCategoria, tblAvaliacaoCliente
                    WHERE tblPedidoPersonalizado.idCategoria = tblCategoria.idCategoria AND
                    tblPedidoPersonalizado.idEspecialidade = tblEspecialidade.idEspecialidade AND tblCliente.idCliente = tblPedidoPersonalizado.idCliente 
                    AND tblAvaliacaoCliente.idCliente = tblPedidoPersonalizado.idCliente AND tblPedidoPersonalizado.idPedidoPersonalizado = ?`, 
        [idPedidoPersonalizado],
        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                mysql.releaseConnection(conn)
                return res.status(404).send({ 
                    mensagem: "Não foi encontrado nenhum pedido personalizado cadastrado 1"
                })
            }

            const response = {
                pedidoPersonalizado: results.map(pedidoPersonalizado => {
                    return {
                        idPedidoPersonalizado: pedidoPersonalizado.idPedidoPersonalizado,
                        fotoPerfilCliente: pedidoPersonalizado.fotoPerfilCliente,
                        notaCliente: pedidoPersonalizado.notaCliente,
                        nomeCliente: pedidoPersonalizado.nomeCliente, 
                        descricao: pedidoPersonalizado.descricao, 
                        genero: pedidoPersonalizado.genero, 
                        status: pedidoPersonalizado.status, 
                        imagem1opcional: pedidoPersonalizado.imagem1opcional, 
                        imagem2opcional: pedidoPersonalizado.imagem2opcional, 
                        imagem3opcional: pedidoPersonalizado.imagem3opcional, 
                        idCliente: pedidoPersonalizado.idCliente, 

                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todas as informações de Pedido Personalizado',
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
            return res.status(200).send(response)
        })
    })
    
})


router.post('/cadastrarPedido', upload.fields([
    { name: 'imagem1opcional', maxCount: 1 },
    { name: 'imagem2opcional', maxCount: 1 },
    { name: 'imagem3opcional', maxCount: 1 }
    ]), loginCliente, async (req, res, next) => {

    const idCliente = req.cliente.id_Cliente
    var ePublico = 0

    const {
        descricao, idEspecialidade, status, visibilidadeArray,
        idCategoria
    } = req.body


    var visibilidade = JSON.parse(visibilidadeArray).array


    if (visibilidade == "") {
        ePublico = 1
    } else {
        ePublico = 0
    }

    const files = req.files;

    const images = await Promise.all(Object.values(files).map(async files => {
        const file = files[0];

        
        const originalName = resolve(resolve(__dirname, '..', '..', '..', 'uploads'), file.filename);

        const result = await cloudinary.uploader.upload(
          originalName,
          {
            public_id: file.filename,
            folder: 'pedidosPersonalizados',
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


    var imagem1opcional = "";
    var imagem2opcional = "";
    var imagem3opcional = "";
  

    if(images[0] != undefined){
        imagem1opcional = images[0].result.url;
    }
    if(images[1] != undefined){
        imagem2opcional = images[1].result.url;
    }
    if(images[2] != undefined){
        imagem3opcional = images[2].result.url;
    }

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `INSERT INTO tblPedidoPersonalizado(descricao, idEspecialidade, status, imagem1opcional, imagem2opcional, imagem3opcional, idCliente, idCategoria, isPublic) 
                VALUES(?,?,?,?,?,?,?,?,?)`,
                [descricao, idEspecialidade, status, imagem1opcional, imagem2opcional, imagem3opcional, idCliente, idCategoria, ePublico],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const idPedidoPersonalizado = results.insertId

                const response = {
                    mensagem: 'Pedido Personalizado cadastrado com sucesso',
                    PedidoCadastrado: {
                        idPedidoPersonalizado: results.insertId,
                        descricao: req.body.descricao,
                        genero: req.body.genero,
                        request: {
                            tipo: 'POST',
                            descricao: 'Cadastra Pedido Personalizado de Cliente'
                        }
                    }
                }

                if (visibilidade != "") {

                    const quantidadeDeArtistas = visibilidade.length

                    for (let i = 0; i < quantidadeDeArtistas; i++) {

                        var idArtistaVisibilidade = visibilidade[i]

                        conn.query(
                        'INSERT INTO tblVisibilidadePedido(idPedidoPersonalizado, idArtista) VALUES (?,?)', 
                            [idPedidoPersonalizado, idArtistaVisibilidade],
                            (error, results, fields) => {
                                conn.release()
                                if (error) { return res.status(500).send({ error: error }) } 
                            }
                        )
                    }
                }
                mysql.releaseConnection(conn)
                res.status(201).send(response)
            }
        )
    })
})


router.put('/editarPedido/:pedidoPersonalizadoId', upload.fields([
    { name: 'imagem1opcional', maxCount: 1 },
    { name: 'imagem2opcional', maxCount: 1 },
    { name: 'imagem3opcional', maxCount: 1 }
    ]), loginCliente, async (req, res, next) => {
    
    const {
        descricao, idEspecialidade, idCategoria, img1, img2, img3
    } = req.body


    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId

    const files = req.files;

    const images = await Promise.all(Object.values(files).map(async files => {
        const file = files[0];
        const originalName = resolve(resolve(__dirname, '..', '..', '..', 'uploads'), file.filename);

        const result = await cloudinary.uploader.upload(
          originalName,
          {
            public_id: file.filename,
            folder: 'pedidosPersonalizados',
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

    var imagem1opcional = "";
    var imagem2opcional = "";
    var imagem3opcional = "";
 

    indexImagem1 = images.filter(image => {
        return image.fieldname == "imagem1opcional"
    })

    indexImagem2= images.filter(image => {
        return image.fieldname == "imagem2opcional"
    })

    indexImagem3 = images.filter(image => {
        return image.fieldname == "imagem3opcional"
    })


    if(indexImagem1.length > 0){
             imagem1opcional = indexImagem1[0].result.url;
    } else {
        imagem1opcional = img1
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


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE tblPedidoPersonalizado SET descricao = ?, idEspecialidade = ?, imagem1opcional = ?, imagem2opcional = ?, imagem3opcional = ?, idCategoria = ? WHERE idPedidoPersonalizado = ?`,
                [descricao, idEspecialidade, imagem1opcional, imagem2opcional, imagem3opcional, idCategoria, idPedidoPersonalizado],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Pedido Personalizado editado com sucesso',
                    request: {
                        tipo: 'PUT',
                        descricao: 'Edita Pedido Personalizado de Cliente',
                        url: 'http://localhost:3000/pedidoPersonalizado/' + idPedidoPersonalizado
                    }
                    
                }
                mysql.releaseConnection(conn)
                res.status(201).send({
                    pedidoPersonalizadoEditado: response
                })

            }
        )
    })
})


router.put('/atualizarStatusPedido/:pedidoPersonalizadoId', loginArtista , (req, res, next) => {
    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId

    const { status } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(`Update tblPedidoPersonalizado SET status = ? WHERE idPedidoPersonalizado = ?`, 
        [status, idPedidoPersonalizado], 
        (error, results, fields) => {
            conn.release()
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                mensagem: 'Status do Pedido Personalizado atualizado com sucesso',
                request: {
                    tipo: 'PUT',
                    descricao: 'Atualiza Status do Pedido Personalizado de Cliente',
                    url: 'http://localhost:3000/pedidoPersonalizado/' + idPedidoPersonalizado
                }
            }
            mysql.releaseConnection(conn)
            res.status(201).send({
                pedidoPersonalizadoAtualizado: response
            })
        })
    })
})


router.delete('/:pedidoPersonalizadoId', loginCliente, (req, res, next) => {

    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query( 
        `DELETE FROM tblProposta WHERE idPedidoPersonalizado = ?` , [idPedidoPersonalizado],
            (error, results, fields) => {
                conn.release()
                if (error) { return res.status(500).send({ error: error }) } 
                conn.query( 
                   `DELETE FROM tblVisibilidadePedido WHERE idPedidoPersonalizado = ?` , [idPedidoPersonalizado],
                    (error, results, fields) => {
                        conn.release()
                        if (error) { return res.status(500).send({ error: error }) } 
                        conn.query( 
                            `DELETE FROM tblPedidoPersonalizado WHERE idPedidoPersonalizado = ?` , [idPedidoPersonalizado],
                
                            (error, results, fields) => {
                                conn.release()

                                if (error) { return res.status(500).send({ error: error }) } 
        
                                const response = {
                                    mensagem: "Pedido Personalizado foi excluido com sucesso"
                                }                          
                                mysql.releaseConnection(conn)
                                res.status(201).send(response)
                            }   
                        )
                    }
                )
            }
        )
    })
})

router.delete('/recusarPedidoPersonalizado/:pedidoPersonalizadoId', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista
    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM tblVisibilidadePedido WHERE idArtista = ? AND idPedidoPersonalizado = ?`, [idArtista, idPedidoPersonalizado],
            (error, results, fields) => {
                conn.release()

                if (error) { return res.status(500).send({ error: error }) } 

                conn.query(
                    `SELECT * FROM tblVisibilidadePedido WHERE idPedidoPersonalizado = ?`, [idPedidoPersonalizado],
                    (error, results, fields) => {
                        conn.release()
        
                        if (error) { return res.status(500).send({ error: error }) } 
                        
                        if (results.length == 0){
                            conn.query( 
                                `UPDATE tblPedidoPersonalizado SET status = 'Recusado' WHERE idPedidoPersonalizado = ?` , [idPedidoPersonalizado],

                                (error, results, fields) => {
                                    conn.release()
                                    
                                    if (error) { return res.status(500).send({ error: error }) } 

                                    const response = {
                                        mensagem: "Pedido Personalizado foi recusado com sucesso"
                                    }
                                    mysql.releaseConnection(conn)
                                    res.status(201).send(response)

                                }
                            )
                        }
                    }
                )
            }
        )
    })


})


module.exports = router