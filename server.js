const express = require('express')
const path = require('path')
const { render } = require('ejs')
const { Console } = require('console')

const app = express()
const server = require('http').createServer(app) // Define o protocolo http do app
const io = require('socket.io')(server) // Definindo protocolo HSS  

app.use(express.static(path.join(__dirname, `public`))) // Public é onde ficarão os arquivo front-end
app.set('views', path.join(__dirname, `public`)) // Onde ficarão as views
app.engine('html', require('ejs').renderFile) // Bem comum de se usar quando se usa html
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let messages = [
    /* {
        id: 1,
        message: 'Olá!',
        author: 'eu'
    },
    {
        id: 2,
        message: 'Tudo bem!',
        author: 'você'
    }, */
]

io.on('connection', socket => { // Connection, toda vez que alguem conectar
    console.log(`Socket conectado: ${socket.id}`)

    socket.emit('previousMessage', messages)

    socket.on('sendMessage', data => {

        let message = {
            id: data.id,
            message: data.message,
            author: data.author
        }

        messages.push(message)
        console.log(message)

        socket.broadcast.emit('receivedMessage', message)
    })
})

server.listen(1000, () => {  //Servidor ouvindo a porta
    console.log('Servidor online na porta 1000')
})

