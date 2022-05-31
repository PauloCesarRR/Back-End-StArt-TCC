const http = require('http')
const path = require('path')
const express = require('express')
const mysql = require('./database/mysql').pool
const loginCliente = require('./app/middleware/loginCliente')
const loginArtista = require('./app/middleware/loginArtista')
const port = process.env.PORT || 3000
const app = require('./app/index')
const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(express.static((path.join(__dirname, 'public'))));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html')
})

let messages = []

io.on('connection', socket => {


    console.log(`Socket conectado: ${socket.id}`)

    socket.on('idChat', idChat => {
    
        mysql.getConnection((error, conn) => {
            if (error) { return console.log(error) }
            conn.query('SELECT * FROM tblMensagem WHERE idChat = ? ORDER BY data_hora ASC', [idChat], 
            (error, results) => {

                messages = []

                if (error) { return console.log(error) }

                if (results.length == 0){
                    socket.emit('previousMessages', messages)
                }

                    const mensagem = results.map(mensagem => {
                        return {
                            idChat: mensagem.idChat,
                            idMensagem: mensagem.idMensagem,
                            mensagem: mensagem.mensagem,
                            foto: mensagem.foto,
                            data_hora: mensagem.data_hora,
                            artistaOUcliente: mensagem.artistaOUcliente,
                            idUsuario: mensagem.idUsuario
                        }
                    })

                messages = mensagem

                socket.emit('previousMessages', messages)
                mysql.releaseConnection(conn)
            })
        })


    


        socket.on('sendMessage', data => {

            mysql.getConnection((error, conn) => {
                if (error) { return console.log(error) }
                conn.query('INSERT INTO tblMensagem (idChat, mensagem, foto, data_hora, artistaOUcliente, idUsuario) VALUES (?, ?, ?, ?, ?, ?)', [idChat, data.mensagem, data.foto, data.data_hora, data.artistaOUcliente, data.idUsuario],
                (error, results) => {
                    if (error) { return console.log(error) }
                    mysql.releaseConnection(conn)
                })
            })
            
            socket.broadcast.emit('receivedMessage', data)
        })
    })

})


server.listen(port)