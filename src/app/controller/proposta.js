const express = require('express')
const router = express.Router()
const mysql = require('../../database/mysql').pool
const loginArtista = require('../middleware/loginArtista')
const loginCliente = require('../middleware/loginCliente')


router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblProposta', (error, results, fields) => {
            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Não foi encontrada nenhuma proposta cadastrada"
                })
            }

            const response = {
                qtdPropostas: results.length,
                proposta: results.map(proposta => {
                    return {
                        idProposta: proposta.idProposta,
                        descricao: proposta.descricao,
                        preco: proposta.preco,
                        prazoEntrega: proposta.prazoEntrega,
                        status: proposta.status,
                        idArtista: proposta.idArtista,
                        idPedidoPersonalizado: proposta.idPedidoPersonalizado,

                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todas as propostas',
                            url: 'http://localhost:3000/artista/' + proposta.idProposta
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
           return res.status(200).send({ propostas: response })

        })
    })
    
})


router.get('/minhasPropostas', loginArtista, (req, res, next) => {

    const idArtista = req.artista.id_Artista

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(`SELECT tblArtista.idArtista, tblCliente.idCliente, tblCliente.fotoPerfilCliente, tblProposta.idProposta, tblPedidoPersonalizado.idPedidoPersonalizado, 
                    tblPedidoPersonalizado.imagem1opcional, tblPedidoPersonalizado.imagem2opcional, tblPedidoPersonalizado.imagem3opcional,
                    tblPedidoPersonalizado.descricao as descricaoPedidoPersonalizado, tblProposta.descricao as descricaoProposta, 
                    tblProposta.preco, tblProposta.prazoEntrega, tblProposta.status,
                    tblArtista.nomeArtistico as nomeArtista, tblCliente.nomeCompleto as nomeCliente, tblCategoria.nomeCategoria 
                    FROM tblProposta, tblArtista, tblPedidoPersonalizado, tblCliente, tblCategoria WHERE 
                    tblPedidoPersonalizado.idPedidoPersonalizado = tblProposta.idPedidoPersonalizado AND 
                    tblCliente.idCliente = tblPedidoPersonalizado.idCliente AND
                    tblPedidoPersonalizado.idCategoria = tblCategoria.idCategoria AND 
                    tblProposta.idArtista = tblArtista.idArtista AND tblArtista.idArtista = ?`, [idArtista],
        (error, results, fields) => {
            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                mysql.releaseConnection(conn)
                return res.status(404).send({ 
                    mensagem: "Não foi encontrada nenhuma proposta"
                })
            }

            const response = {
                qtdPropostas: results.length,
                proposta: results.map(proposta => {
                    return {
                        idProposta: proposta.idProposta,
                        idCliente: proposta.idCliente,
                        idPedidoPersonalizado: proposta.idPedidoPersonalizado,
                        descricaoPedidoPersonalizado: proposta.descricaoPedidoPersonalizado,
                        descricaoProposta: proposta.descricaoProposta,
                        preco: proposta.preco,
                        prazoEntrega: proposta.prazoEntrega,
                        imagem1opcional: proposta.imagem1opcional,
                        imagem2opcional: proposta.imagem2opcional,
                        imagem3opcional: proposta.imagem3opcional,
                        status: proposta.status,
                        nomeArtista: proposta.nomeArtista,
                        nomeCliente: proposta.nomeCliente,
                        notaCliente: proposta.notaCliente,
                        fotoPerfilCliente: proposta.fotoPerfilCliente,
                        nomeCategoria: proposta.nomeCategoria,

                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todas as propostas do artista logado'
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
           return res.status(200).send(response)
        })
    })

})


router.get('/propostasParaMim/:pedidoPersonalizadoId', loginCliente, (req, res, next) => {

    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(`SELECT tblArtista.fotoPerfilArtista, tblArtista.nomeArtistico as nomeArtista, tblArtista.idArtista, tblProposta.idProposta, tblProposta.descricao,
        tblProposta.preco, tblProposta.prazoEntrega, tblProposta.status, tblProposta.idPedidoPersonalizado
        FROM tblProposta, tblArtista WHERE tblProposta.idArtista = tblArtista.idArtista AND
        tblProposta.status <> "Recusada" AND
        tblProposta.idPedidoPersonalizado = ?;`, [idPedidoPersonalizado],
        (error, results, fields) => {
            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                mysql.releaseConnection(conn)
                return res.status(404).send({ 
                    mensagem: "Não foi encontrada nenhuma proposta"
                })
            }

            const response = {
                qtdPropostas: results.length,
                proposta: results.map(proposta => {
                    return {
                        idProposta: proposta.idProposta,
                        nomeArtista: proposta.nomeArtista,
                        fotoPerfilArtista: proposta.fotoPerfilArtista,
                        descricao: proposta.descricao,
                        preco: proposta.preco,
                        prazoEntrega: proposta.prazoEntrega,
                        status: proposta.status,
                        idArtista: proposta.idArtista,
                        idPedidoPersonalizado: proposta.idPedidoPersonalizado,

                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todas as propostas para um pedido personalizado'
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
           return res.status(200).send(response)

        })
    })

})


router.get('/:propostaId', loginArtista || loginCliente, (req, res, next) => {

    const id = req.params.propostaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblProposta WHERE idProposta = ?', [id],
        (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Esta proposta não existe"
                })
            }

            const response = {
                proposta: results.map(proposta => {
                    return {
                        idProposta: proposta.idProposta,
                        descricao: proposta.descricao,
                        preco: proposta.preco,
                        prazoEntrega: proposta.prazoEntrega,
                        status: proposta.status,
                        idArtista: proposta.idArtista,
                        idPedidoPersonalizado: proposta.idPedidoPersonalizado,
                        idPagamento: proposta.idPagamento,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna as informações de Proposta'
                        }
                    }
                })
            }
            mysql.releaseConnection(conn)
            res.status(200).send(response)
        })
    })

})


router.post('/fazerProposta/:pedidoPersonalizadoId', loginArtista, (req, res, next) => {

    const {
        descricao, 
        preco, 
        prazoEntrega, 
        status
    } = req.body

    console.log(req.body)
    
    const idArtista = req.artista.id_Artista
    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `INSERT INTO tblProposta(descricao, preco, prazoEntrega, status, idArtista, idPedidoPersonalizado) 
                VALUES(?,?,?,?,?,?)`,
                [descricao, preco, prazoEntrega, status, idArtista, idPedidoPersonalizado],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                conn.query(
                    `UPDATE tblPedidoPersonalizado SET status = 'Aceito' WHERE idPedidoPersonalizado = ?`, [idPedidoPersonalizado],
        
                    (error, results, fields) => {
                        conn.release()
                        
                        if (error) { return res.status(500).send({ error: error }) } 
        
                        conn.query(
                            `DELETE FROM tblVisibilidadePedido WHERE idArtista = ? AND idPedidoPersonalizado = ?`, [idArtista, idPedidoPersonalizado],
                
                            (error, results, fields) => {
                                conn.release()
                                
                                if (error) { return res.status(500).send({ error: error }) } 
                
                                const response = {
                                    mensagem: 'Proposta enviada com sucesso',
                                    obraCadastrada: {
                                        descricao: req.body.descricao,
                                        preco: req.body.preco,
                                        prazoEntrega: req.body.prazoEntrega,
                                        status: req.body.status,
                                        request: {
                                            tipo: 'POST',
                                            descricao: 'Faz proposta',
                                            url: 'http://localhost:3000/proposta/' + results.insertId
                                        }
                                    }
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


router.put('/atualizarProposta/:propostaId', loginArtista, (req, res, next) => {

    const {
        descricao, preco, 
        prazoEntrega, status
    } = req.body
    
    const idProposta  = req.params.propostaId


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE tblProposta SET descricao = ?, preco = ?, prazoEntrega = ?, status = ? WHERE idProposta = ?`,
                [descricao, preco, prazoEntrega, status, idProposta],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Proposta atualizada com sucesso',
                    request: {
                        tipo: 'PUT',
                        descricao: 'Atualiza Proposta',
                        url: 'http://localhost:3000/proposta/' + idProposta
                    }
                }
                mysql.releaseConnection(conn)
                res.status(201).send({
                    obraAtualizada: response
                })

            }
        )
    })

})

router.put('/atualizarStatus/:propostaId', loginArtista, (req, res, next) => {

    const {
        status
    } = req.body
    
    const idProposta  = req.params.propostaId


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE tblProposta SET status = ? WHERE idProposta = ?`,
                [status, idProposta],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Proposta atualizada com sucesso',
                    request: {
                        tipo: 'PUT',
                        descricao: 'Atualiza Proposta',
                        url: 'http://localhost:3000/proposta/' + idProposta
                    }
                }
                mysql.releaseConnection(conn)
                res.status(201).send({
                    obraAtualizada: response
                })

            }
        )
    })

})


router.delete('/:propostaId', loginArtista || loginCliente, (req, res, next) => {

    const idProposta = req.params.propostaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `DELETE FROM tblProposta WHERE idProposta = ?` , [idProposta],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: "Proposta foi excluída com sucesso"
                }
                mysql.releaseConnection(conn)
                res.status(201).send(response)
            }
        )
    })

})

router.put('/aceitarProposta', loginCliente, (req, res, next) => {
    
        const {
            idProposta,
            idPedidoPersonalizado
        } = req.body
    
        mysql.getConnection((error, conn) => {
            if (error) { return res.status(500).send({ error: error }) }
            conn.query( 
                `UPDATE tblPedidoPersonalizado SET status = 'Esperando execução' WHERE idPedidoPersonalizado = ?` , [idPedidoPersonalizado],
    
                (error, results, fields) => {
                    conn.release()
                    
                    if (error) { return res.status(500).send({ error: error }) } 
                    conn.query( 
                        `UPDATE tblProposta SET status = 'Aceita' WHERE idProposta = ?` , [idProposta],
            
                        (error, results, fields) => {
                            conn.release()
                            
                            if (error) { return res.status(500).send({ error: error }) } 
    
                            conn.query( 
                                `DELETE FROM tblProposta WHERE idProposta <> ? AND idPedidoPersonalizado = ?` , [idProposta, idPedidoPersonalizado],
                    
                                (error, results, fields) => {
                                    conn.release()
                                    
                                    if (error) { return res.status(500).send({ error: error }) } 
                    
                                    const response = {
                                        mensagem: "Proposta foi aceita com sucesso"
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

router.put('/recusarProposta', loginCliente, (req, res, next) => {
    
    const {
        idPedidoPersonalizado,
        idProposta,
        idArtista
    } = req.body

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `UPDATE tblProposta SET status = 'Recusada' WHERE idProposta = ?` , [idProposta],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                conn.query( 
                    `DELETE FROM tblVisibilidadePedido WHERE idPedidoPersonalizado = ? AND idArtista = ?` , [idPedidoPersonalizado, idArtista],
        
                    (error, results, fields) => {
                        conn.release()
                        
                        if (error) { return res.status(500).send({ error: error }) } 
        
                        const response = {
                            mensagem: "Proposta foi recusada com sucesso"
                        }
                        mysql.releaseConnection(conn)
                        res.status(201).send(response)
        
                    }
                )

            }
        )
    })

})




module.exports = router
