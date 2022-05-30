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

    socket.emit('previousMessages', messages)

    socket.on('sendMessage', data => {

        messages.push(data)
        socket.broadcast.emit('receivedMessage', data)
    })
})


server.listen(port)