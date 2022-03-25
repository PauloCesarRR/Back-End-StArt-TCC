const express = require('express')
const router = express.Router()
const mysql = require('../../database/index').pool
const loginCliente = require('../middleware/loginCliente')


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
                            url: 'http://localhost:3000/pedidoPersonalizado/' + pedidoPersonalizado.idpedidoPersonalizado
                        }
                    }
                })
            }
            return res.status(200).send({ pedidoPersonalizados: response })
        })
    })
    
})


router.get('/:pedidoPersonalizadoId', (req, res, next) => {


    const idCliente = req.cliente.id_Cliente

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) } 
        conn.query(`SELECT tblCliente.nomeCompleto as nomeCliente, tblPedidoPersonalizado.descricao, tblPedidoPersonalizado.genero, 
                    tblPedidoPersonalizado.status, tblPedidoPersonalizado.imagem1opcional, tblPedidoPersonalizado.imagem2opcional,
                    tblPedidoPersonalizado.imagem3opcional FROM tblCliente, tblPedidoPersonalizado WHERE tblCliente.idCliente = tblPedidoPersonalizado.idCliente AND tblPedidoPersonalizado.idCliente = ?`, 
                    [idCliente],
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
                            url: 'http://localhost:3000/pedidoPersonalizado/' + pedidoPersonalizado.idpedidoPersonalizado
                        }
                    }
                })
            }
            return res.status(200).send({ pedidoPersonalizados: response })
        })
    })

})

router.post('/cadastrarPedido', loginCliente, (req, res, next) => {

    const {
        descricao, genero, status,
        imagem1opcional, imagem2opcional, imagem3opcional
    } = req.body

    const idCliente = req.cliente.id_Cliente

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `INSERT INTO tblPedidoPersonalizado(descricao, genero, status, imagem1opcional, imagem2opcional, imagem3opcional, idCliente) 
                VALUES(?,?,?,?,?,?,?)`,
                [descricao, genero, status, imagem1opcional, imagem2opcional, imagem3opcional, idCliente],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Pedido Personalizado cadastrado com sucesso',
                    PedidoCadastrado: {
                        idPedidoPersonalizado: results.insertId,
                        descricao: req.body.descricao,
                        genero: req.body.genero,
                        request: {
                            tipo: 'POST',
                            descricao: 'Cadastra Pedido Personalizado de Cliente',
                            url: 'http://localhost:3000/pedidoPersonalizado/' + results.insertId
                        }
                    }
                }

                res.status(201).send({
                    pedidoPersonalizadoCadastrado: response
                })

            }
        )
    })

})

router.patch('/editarPedido/:pedidoPersonalizadoId', loginCliente, (req, res, next) => {
    
    const {
        descricao, genero, status,
        imagem1opcional, imagem2opcional, imagem3opcional
    } = req.body

    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE tblPedidoPersonalizado SET descricao = ?, genero = ?, status = ?, imagem1opcional = ?, imagem2opcional = ?, imagem3opcional = ? WHERE idPedidoPersonalizado = ?`,
                [descricao, genero, status, imagem1opcional, imagem2opcional, imagem3opcional, idPedidoPersonalizado],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: 'Pedido Personalizado editado com sucesso',
                    request: {
                        tipo: 'PATCH',
                        descricao: 'Edita Pedido Personalizado de Cliente',
                        url: 'http://localhost:3000/pedidoPersonalizado/' + idPedidoPersonalizado
                    }
                    
                }

                res.status(201).send({
                    pedidoPersonalizadoEditado: response
                })

            }
        )
    })

})

router.delete('/:pedidoPersonalizadoId', loginCliente, (req, res, next) => {

    const idPedidoPersonalizado = req.params.pedidoPersonalizadoId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query( 
            `DELETE FROM tblPedidoPersonalizado WHERE idPedidoPersonalizado = ?` , [idPedidoPersonalizado],

            (error, results, fields) => {
                conn.release()
                
                if (error) { return res.status(500).send({ error: error }) } 

                const response = {
                    mensagem: "Pedido Personalizado foi excluido com sucesso"
                }

                res.status(201).send(response)

            }
        )
    })

})

module.exports = router