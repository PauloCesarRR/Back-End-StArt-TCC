const express = require('express')
const router = express.Router()
const mysql = require('../../database/index').pool
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


router.get('/minhasObras', loginArtista, (req, res, next) => {
    
    const idArtista = req.artista.id_Artista

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM tblObraPronta, tblArtista, tblEspecialidade WHERE tblObraPronta.idEspecialidade = tblEspecialidade.idEspecialidade AND tblArtista.idArtista = tblObraPronta.idArtista AND tblObraPronta.idArtista = ?', [idArtista],
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
        conn.query('SELECT * FROM tblObraPronta WHERE idObraPronta = ?', [id],
            (error, results, fields) => {

            if (error) { return res.status(500).send({ error: error }) } 

            if (results.length == 0){
                return res.status(404).send({ 
                    mensagem: "Esta obra não existe"
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


router.post('/inserirObra', loginArtista, (req, res, next) => {

    const {
        nomeObra, preco, 
        quantidade, tecnica, desconto, 
        eExclusiva,  descricao, imagem1obrigatoria, 
        imagem2opcional, imagem3opcional, imagem4opcional, 
        imagem5opcional, imagem6opcional,idEspecialidade,
    } = req.body

    const idArtista = req.artista.id_Artista

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `INSERT INTO tblObraPronta(nomeObra, preco, quantidade, tecnica, desconto, 
                eExclusiva,  descricao, imagem1obrigatoria, imagem2opcional, imagem3opcional, imagem4opcional, 
                imagem5opcional, imagem6opcional, idArtista, idEspecialidade) 
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [nomeObra, preco, quantidade, tecnica, desconto, eExclusiva,  descricao, imagem1obrigatoria, 
                    imagem2opcional, imagem3opcional, imagem4opcional, imagem5opcional, imagem6opcional,
                    idArtista, idEspecialidade],

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

                res.status(201).send({
                    obraCadastrada: response
                })

            }
        )
    })
})


router.patch('/atualizarObra/:obraProntaId', loginArtista, (req, res, next) => {
    
    const {
        nomeObra, preco, 
        quantidade, tecnica, desconto, 
        eExclusiva,  descricao, imagem1obrigatoria, 
        imagem2opcional, imagem3opcional, imagem4opcional, 
        imagem5opcional, imagem6opcional,idEspecialidade,
    } = req.body

    const idObraPronta = req.params.obraProntaId

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }


            conn.query(
                `UPDATE tblObraPronta SET nomeObra = ?, preco = ?, quantidade = ?, tecnica = ?, desconto = ?, 
                    eExclusiva = ?,  descricao = ?, imagem1obrigatoria = ?, imagem2opcional = ?, imagem3opcional = ?, imagem4opcional = ?, 
                    imagem5opcional = ?, imagem6opcional = ?, idEspecialidade = ? WHERE idObraPronta = ?`,
                    [nomeObra, preco, quantidade, tecnica, desconto, eExclusiva,  descricao, imagem1obrigatoria, 
                        imagem2opcional, imagem3opcional, imagem4opcional, imagem5opcional, imagem6opcional,
                        idEspecialidade, idObraPronta],

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
    })
})

module.exports = router