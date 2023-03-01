/* IMPORTACIONES */

const express = require('express')
const productRouter = require('./src/routes/productRouter.js')
const handlebars = require('express-handlebars')
const {
    Server
} = require('socket.io')
const fs = require('fs')
const Contenedor = require('./src/models/Contenedor.js')
const ruta = 'src/database/archivo.json'

/* MANEJO DE PRODUCTOS */
const contenedor = new Contenedor(ruta)

/* CONFIGURACION */
const app = express()
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => console.log('Server Up!'))
const io = new Server(server)
app.use(express.json())
app.use('/public', express.static('src/public'))
app.use('/uploads', express.static('src/database/uploads'))


/* MOTORES DE PLANTILLAS */

//Handlebars

app.engine('handlebars', handlebars.engine()) //establecemos la configuracion de handlebars
app.set('views', './src/public/views/handlebars') //establecemos el directorio donde se encuentran los archivos de plantilla
app.set('view engine', 'handlebars') //establecemos el motor de plantilla que se utiliza

//Pug

//app.set('view engine', 'pug')
//app.set('views', './src/public/views/pug')

//Ejs

//app.set('view engine', 'ejs')
//app.set('views', './src/public/views/ejs')

/* RUTAS */
app.use('/api/productos', productRouter)


app.get('/', (req, res) => {
    res.redirect('/api/productos')
})

/* WEBSOCKET */

let history = [] //Aqui almacenamos los {user, message} de todos los usuarios

io.on('connection', async socket => {

    /* PRODUCTOS */
    console.log('Socket connected!')
    let productos;
    await contenedor.getAll().then(result => productos = result)
    socket.emit('products', productos)


    /* MENSAJES */
    history = readHistoryOfMessages()
    socket.on('message', data => { //recibimos del index.js el {email, message}
        history.push(data)
        io.emit('history', history) //enviamos a index.js el log a todos los usuarios
        writeHistoryOfMessages(history)
    })
    socket.emit('history', history) //Para que el que se conecte, le lleguen todos los chats
})

/* Agregamos el historial de chat a un archivo messages.txt */

const writeHistoryOfMessages = (messages) => {
    console.log(messages)
    messages = JSON.stringify((messages), null, 2)
    try {
        fs.writeFileSync("./src/database/messages.txt", messages)
        console.log({
            message: "se añadio con exito",
            messages
        })
    } catch (err) {
        console.log('Error en la escritura', err)
    }
}

const readHistoryOfMessages = () => {
    try {
        let data = fs.readFileSync("./src/database/messages.txt", 'utf8');
        history = data.length > 0 ? JSON.parse(data) : [];
    } catch (err) {
        console.log('Error en la lectura del archivo', err)
    }
    return history
}
