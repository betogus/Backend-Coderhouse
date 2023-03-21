/* IMPORTACIONES */

const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const Contenedor = require('./src/models/Contenedor.js')
const {configMySQL, configSqlite} = require('./src/options/db.config.js')
const multer = require('multer')
const Mensajes = require('./src/models/Mensajes.js')

/* CONFIGURACIONES DE LA BASE DE DATOS */

const contenedor = new Contenedor(configMySQL, "products")
const mensajes = new Mensajes(configSqlite, 'mensajes')

/* CONFIGURACION */
const app = express()
const PORT = process.env.port || 8080
const server = app.listen(PORT, () => console.log('Server Up!'))
const io = new Server(server)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public', express.static('src/public'))
app.use('/uploads', express.static('src/database/uploads'))

/* MULTER */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/database/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
app.use(multer({ storage }).single('thumbnail'))

/* MOTORES DE PLANTILLAS */

//Handlebars

app.engine('handlebars', handlebars.engine()) 
app.set('views', './src/public/views/handlebars') 
app.set('view engine', 'handlebars') 



/* RUTAS */
app.get('/api/productos', async (req, res) => {
    await contenedor.getAll()
    res.render('dashboard')
})

app.get('/', (req, res) => {
    res.redirect('/api/productos')
})

app.post('/upload', async (req, res) => {
    let producto = req.body
    producto.thumbnail = req.file.filename
    await contenedor.insertData(producto)
    .then(result => res.status(200).send(result))
    .catch(err => res.send({error: 0, descripcion: err})) 
})

//Rutas inexistentes
app.use((req, res) => {
res.status(404).send({error: -2, descripcion: `ruta
${req.baseUrl}${req.url} método ${req.method} no implementada`});
});

/* WEBSOCKET */

io.on('connection', async socket => {
    console.log('Socket connected!')
    
    /* PRODUCTOS */
    await contenedor.createTable()
    let productos = await contenedor.getAll()
    io.emit('products', productos)
    socket.on('product', async data => {
        productos = await contenedor.getAll()
        io.emit('products', productos)
    }) 
     socket.emit('products', productos) //para que el que se conecte, le lleguen todos los productos
    
   


    /* MENSAJES */
    await mensajes.createTable()
    let history = await mensajes.getAll()
    socket.on('message', async data => { //recibimos del index.js el {email, message}
        await mensajes.insertData(data)
        history = await mensajes.getAll()
        io.emit('history', history) //enviamos a index.js el log a todos los usuarios
    })
    socket.emit('history', history) //Para que el que se conecte, le lleguen todos los chats 
})

